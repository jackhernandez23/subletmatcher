from errno import EOWNERDEAD

from flask import Flask, jsonify, request, url_for
from werkzeug.utils import secure_filename
from flask_cors import CORS  # Cross origin requests, assuming React front and Flask back
from os import path
import mysql.connector
import configparser

from fake_data import streets
from send_email import send_email, get_code

app = Flask(__name__)

pfp_folder = 'pfps/'
prop_pics_folder = 'prop_pics/'
lease_folder = 'leases/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}


CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def getConn():
    config_file = "../sm_db_config.ini"
    config_parse = configparser.ConfigParser()
    config_parse.read(config_file)

    if config_parse.has_section('DEFAULT'):
        config = {'user': config_parse['DEFAULT']['username'],
                  'password': config_parse['DEFAULT']['password'],
                  'host': config_parse['DEFAULT']['servername'],
                  'database': config_parse['DEFAULT']['dbname']}

    else:  # To operate mysql locally make sure you have it running.
        config = {'user': 'user1',
                  'password': 'password',  # I suggest having no password on your local account
                  'host': 'localhost',
                  'database': 'sublet_matcher',
                  'auth_plugin': 'mysql_native_password'}

    return mysql.connector.connect(
        user=config['user'],
        password=config['password'],
        host=config['host'],
        database=config['database'],
        auth_plugin=config['auth_plugin'])


@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "This is a test..."})


@app.route('/signup', methods=['POST'])  # Sign up route
def signup():
    data = request.get_json()
    email = data.get('email')
    passphrase = data.get('password')  # Hashes password for storage
    name = data.get('name')
    phone = data.get('phoneNumber')

    query = "INSERT INTO User(Email, Passphrase, Name, Phone) VALUES (%s, sha1(%s), %s, %s)"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, passphrase, name, phone))
            conn.commit()
            cursor.close()

            return jsonify({"message": "successfully signed up"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Account creation unsuccessful"})


@app.route('/login', methods=['GET'])  # Log in route
def login():
    email = request.args.get('email')
    password = request.args.get('password')

    query = f"SELECT * FROM User WHERE Email = %s and sha1(%s) = Passphrase"

    conn = getConn()
    if conn and conn.is_connected():
        cursor = conn.cursor(buffered=True)
        cursor.execute(query, (email, password))
        rows = cursor.fetchall()

        success = len(rows) == 1

        return jsonify({"success": success})

    else:

        print("Could not connect")

    return jsonify({"error": "Incorrect username or password"})


@app.route('/addlease', methods=['POST'])  # Lease upload route
def addLease():
    data = request.get_json()
    street = data.get('street')
    unit = data.get('unit')
    zipcode = data.get('zipcode')
    owner = data.get('owner')
    price = data.get('price')
    available = data.get('available')
    numOfRoomates = data.get('numOfRoommates')
    startDate = data.get('startDate')
    endDate = data.get('endDate')

    query = "INSERT INTO Property(street, unit, zipcode, owner, price, available, numOfRoommates, startDate, endDate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (street, unit, zipcode, owner, price, available, numOfRoomates, startDate, endDate))
            conn.commit()
            cursor.close()
        return jsonify({"message": "Property uploaded successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/listings', methods=['GET'])  # Listings route
def getlistings():
    street = request.args.get('street')
    unit = request.args.get('unit')
    zipcode = request.args.get('zipcode')
    owner = request.args.get('owner')
    price = request.args.get('price')
    available = request.args.get('available')
    numOfRoommates = request.args.get('numOfRoommates')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')

    query = "SELECT * FROM Property WHERE 1=1"
    params = []

    if street:
        query += " AND street = %s"
        params.append(street)
    if unit:
        query += " AND unit = %s"
        params.append(unit)
    if zipcode:
        query += " AND zipcode = %s"
        params.append(zipcode)
    if owner:
        query += " AND owner = %s"
        params.append(owner)
    if price:
        query += " AND price = %s"
        params.append(price)
    if available is not None:
        query += " AND available = %s"
        params.append(available)
    if numOfRoommates:
        query += " AND numOfRoommates = %s"
        params.append(numOfRoommates)
    if startDate:
        query += " AND startDate = %s"
        params.append(startDate)
    if endDate:
        query += " AND endDate = %s"
        params.append(endDate)

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params)
            result = cursor.fetchall()
            cursor.close()
            conn.close()

            if result:
                return jsonify(result)
            else:
                return jsonify([])
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Listing unsuccessful"})


@app.route('/get-listing', methods=['GET'])  # Get all info on a single Listing
def getListing():

    street = request.args.get('street')
    unit = request.args.get('unit')
    zipcode = request.args.get('zipcode')

    query = "SELECT * FROM Property WHERE street = %s AND unit = %s AND zipcode = %s;"

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, street, unit, zipcode)
            result = cursor.fetchall()
            cursor.close()
            conn.close()

            if result:
                return jsonify(result)
            else:
                return jsonify([])
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Listing unsuccessful"})


@app.route('/change-password', methods=['POST'])  # Change password
def changePassword():
    data = request.json
    userEmail = data.get('email')
    newPassword = data.get('passphrase')

    query = "UPDATE User SET passphrase = sha1(%s) WHERE email = %s;"

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (newPassword, userEmail))
            conn.commit()
            cursor.close()
        return jsonify({"message": "Password changed successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/2fA-code', methods=['GET'])  # Get 2FA Code
def getCode():
    userEmail = request.args.get('email')
    return jsonify({"code": get_code(userEmail)})


@app.route('/verify-email', methods=['GET'])  # Send 2Fa email
def sendEmail():
    userEmail = request.args.get('email')
    return jsonify({"success": send_email(userEmail)})


@app.route('/bookmark', methods=['POST'])  # Bookmark Listing
def bookmark():
    data = request.get_json()
    email = data.get('email')
    zipcode = data.get('zipcode')  # Hashes password for storage
    street = data.get('street')
    unit = data.get('unit')

    query = "INSERT INTO Bookmarks(Email, Street, Zipcode, Unit) VALUES (%s, %s, %s, %s)"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, zipcode, street, unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Bookmarked successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Bookmarked unsuccessful"})


@app.route('/list-bookmarks', methods=['GET'])  # Get a users bookmarks
def listBookmarks():
    userEmail = request.args.get('email')
    query = "SELECT Street, Unit, Zipcode FROM Bookmarks WHERE email = %s;"
    conn = getConn()

    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, userEmail)
            result = cursor.fetchall()
            cursor.close()
            conn.close()

            if result:
                return jsonify(result)
            else:
                return jsonify([])
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Listing unsuccessful"})


@app.route('/delete-bookmark', methods=['POST'])  # Bookmark Listing
def delete_bookmark():
    data = request.get_json()
    email = data.get('email')
    zipcode = data.get('zipcode')
    street = data.get('street')
    unit = data.get('unit')

    query = "DELETE FROM Bookmarks WHERE email=%s AND street = %s AND zipcode = %s AND Unit = %s"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, zipcode, street, unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Deleted bookmarked successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Deleted bookmarked unsuccessful"})


@app.route('/get-user-listings', methods=['GET'])
def getuserlistings():
    data = request.json
    userEmail = data.get('email')

    query = "SELECT * FROM Property where owner = %s;"

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (userEmail,))
            results = cursor.fetchall()
            cursor.close()

            listings = []
            for (street, unit, zipcode, owner, price, available, numOfRoommates, startDate, endDate) in results:
                listings.append({
                    "street": street,
                    "unit": unit,
                    "zipcode": zipcode,
                    "owner": owner,
                    "price": price,
                    "available": available,
                    "numOfRoommates": numOfRoommates,
                    "startDate": startDate,
                    "endDate": endDate
                })

            return jsonify({"User listings": listings})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})

app.route('/edit-user-lease', methods=['POST'])
def editUserLease():
    data = request.get_json()
    street = data.get('street')
    unit = data.get('unit')
    zipcode = data.get('zipcode')
    owner = data.get('owner')
    price = data.get('price')
    available = data.get('available')
    numOfRoommates = data.get('numOfRoommates')
    startDate = data.get('startDate')
    endDate = data.get('endDate')

    query = "UPDATE Property SET price = %s, available = %s, numOfRoommates = %s, startDate = %s, endDate = %s WHERE owner = %s AND street = %s AND zipcode = %s AND unit = %s;"

    conn = getConn()

    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (price, available, numOfRoommates, startDate, endDate, owner ,street, zipcode, unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Lease successfully edited"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Edit unsuccessful"})

app.route('/delete-listing', methods=['POST'])
def deleteListing():
    data = request.get_json()
    email = data.get('email')
    street = data.get('street')
    zipcode = data.get('zipcode')
    unit = data.get('unit')

    query = "DELETE FROM Property WHERE owner = %s AND street = %s AND zipcode = %s AND unit = %s"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, street, zipcode,unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Deleted bookmarked successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Deleted bookmarked unsuccessful"})


@app.route('/set-pfp', methods=['POST'])  # Bookmark Listing
def set_pfp():
    data = request.json
    userEmail = data.get('email')

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"success": "False", "error": "No file uploaded"})

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename.
    if file.filename == '':
        return jsonify({"success": "False", "error": "No file uploaded"})

    if file and allowed_file(file.filename):
        filename = secure_filename(userEmail)
        file.save(path.join(pfp_folder, filename))
        return jsonify({"success": "True"})

    return  jsonify({"success": "False", "error": "File was not uploaded"})


@app.route('/prop-photos', methods=['POST'])  # Bookmark Listing
def upload_prop_photos():
    data = request.json
    zipcode = data.get('zipcode')
    street = data.get('street')
    unit = data.get('unit')

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"success": "False", "error": "No file uploaded"})

    files = request.files['files']
    filepaths = []
    count = 0
    # If the user does not select a file, the browser submits an empty file without a filename.
    for file in files:
        if file.filename == '':
            return jsonify({"success": "False", "error": "No file uploaded"})

        if file and allowed_file(file.filename):
            filename = secure_filename(f"{unit}{street}{zipcode}{count}")
            filepaths.append(filename)
            count += 1

    for i, file in enumerate(files):
        file.save(path.join(pfp_folder, filepaths[i]))

    return jsonify({"success": "True"})


@app.route('/upload_lease', methods=['POST'])  # Bookmark Listing
def upload_lease():
    data = request.json

    zipcode = data.get('zipcode')
    street = data.get('street')
    unit = data.get('unit')

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"success": "False", "error": "No file uploaded"})

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename.
    if file.filename == '':
        return jsonify({"success": "False", "error": "No file uploaded"})

    if file and allowed_file(file.filename):
        filename = secure_filename(f"{unit}{street}{zipcode}")
        file.save(path.join(lease_folder, filename))
        return jsonify({"success": "True"})

    return jsonify({"success": "False", "error": "File was not uploaded"})

if __name__ == '__main__':
    app.run(debug=True)
