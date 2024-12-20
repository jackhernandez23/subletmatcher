from errno import EOWNERDEAD

from flask import Flask, jsonify, request, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS  # Cross origin requests, assuming React front and Flask back
from os import path, makedirs
import mysql.connector
import configparser

from fake_data import streets
from send_email import send_email, get_code

app = Flask(__name__)

prop_pics_folder = 'prop_pics/'
lease_folder = 'leases/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

if not path.exists(lease_folder):
    makedirs(lease_folder)

if not path.exists(prop_pics_folder):
    makedirs(prop_pics_folder)

CORS(app)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def getConn():
    config_file = "../sm_db_config.ini"
    config_parse = configparser.ConfigParser()
    config_parse.read(config_file)

    if config_parse.has_section('creds'):
        config = {'user': config_parse['creds']['username'],
                  'password': config_parse['creds']['password'],
                  'host': config_parse['creds']['servername'],
                  'database': config_parse['creds']['dbname']}

    else:  # To operate mysql locally make sure you have it running.
        config = {'user': 'user1',
                  'password': 'password',  # I suggest having no password on your local account
                  'host': 'localhost',
                  'database': 'sublet_matcher'}

    return mysql.connector.connect(
        user=config['user'],
        password=config['password'],
        host=config['host'],
        database=config['database'],
        auth_plugin='mysql_native_password')


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
        return jsonify({'success': False, "error": str(err)})
    except Exception as e:
        return jsonify({'success': False, "error": str(e)})
    return jsonify({'success': False, "error": "Account creation unsuccessful"})


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

    return jsonify({"success": False, "error": "Incorrect username or password"})


@app.route('/addlease', methods=['POST'])  # Lease upload route
def addLease():
    street = request.form.get('street')
    unit = request.form.get('unit')
    zipcode = request.form.get('zipcode')
    owner = request.form.get('owner')
    contact = request.form.get('contact')
    price = request.form.get('price')
    available = request.form.get('available')
    numOfRoomates = request.form.get('numOfRoommates')
    startDate = request.form.get('startDate')
    endDate = request.form.get('endDate')
    description = request.form.get('description')
    lease = request.files.get('lease')
    photos = request.files.getlist('photos')

    query = "INSERT INTO Property(street, unit, zipcode, owner, contact, price, available, numOfRoommates, startDate, endDate, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    
    conn = getConn()
    try:
        if conn and conn.is_connected():

            # add property to database
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (street, unit, zipcode, owner, contact, price, available, numOfRoomates, startDate, endDate, description))
            conn.commit()

            # save lease file
            lease_filename = secure_filename(f"{unit}{street}{zipcode}.pdf")
            lease.save(path.join(lease_folder, lease_filename))

            #save photos
            print(photos)
            count = 0
            for photo in photos:
                print(photo)
                if photo and photo.filename:
                    if photo.filename.lower().endswith("png"):
                        photo_filename = secure_filename(f"{unit}{street}{zipcode}{count}.png")
                    elif photo.filename.lower().endswith("jpg"):
                        photo_filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpg")
                    else:
                        photo_filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpeg")

                    photo.save(path.join(prop_pics_folder, photo_filename))
                    count += 1

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
    contact = request.args.get('contact')
    price = request.args.get('price')
    available = request.args.get('available')
    numOfRoommates = request.args.get('numOfRoommates')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    description = request.args.get('description')

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
    if contact:
        query += " AND contact = %s"
        params.append(contact)
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
    if description:
        query += " AND description = %s"
        params.append(description)

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
            cursor.execute(query, (street, unit, zipcode))
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
    data = request.get_json()
    userEmail = data.get('email')
    newPassword = data.get('password')

    query = "UPDATE User SET passphrase = sha1(%s) WHERE email = %s;"

    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (newPassword, userEmail))
            conn.commit()
            cursor.close()
        return jsonify({"success": True, "message": "Password changed successfully"})
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
    street = data.get('street')
    zipcode = data.get('zipcode')
    unit = data.get('unit')

    query = "INSERT INTO Bookmarks(Email, Street, Zipcode, Unit) VALUES (%s, %s, %s, %s)"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, street, zipcode, unit))
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
            cursor.execute(query, (userEmail,))
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
    email = request.args.get('email')
    zipcode = request.args.get('zipcode')
    street = request.args.get('street')
    unit = request.args.get('unit')

    query = "DELETE FROM Bookmarks WHERE email=%s AND street = %s AND zipcode = %s AND Unit = %s"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, street, zipcode, unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Deleted bookmarked successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Deleted bookmarked unsuccessful"})


@app.route('/edit-user-lease', methods=['POST'])
def editUserLease():
    data = request.get_json()
    street = data.get('street')
    unit = data.get('unit')
    zipcode = data.get('zipcode')
    contact = data.get('contact')
    price = data.get('price')
    available = data.get('available')
    numOfRoommates = data.get('numOfRoommates')
    description = data.get('description')

    query = "UPDATE Property SET price = %s, available = %s, numOfRoommates = %s, description = %s WHERE contact = %s AND street = %s AND zipcode = %s AND unit = %s;"

    conn = getConn()

    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (price, available, numOfRoommates, description, contact, street, zipcode, unit))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Lease successfully edited"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Edit unsuccessful"})


@app.route('/prop-photos', methods=['POST'])  # upload extra property photos
def upload_prop_photos():
    data = request.json
    zipcode = data.get('zipcode')
    street = data.get('street')
    unit = data.get('unit')

    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"success": "False", "error": "No file uploaded"})

    filepaths = []
    count = 0
    # If the user does not select a file, the browser submits an empty file without a filename.
    for file in request.files.getlist('file'):
        if file.filename == '':
            return jsonify({"success": "False", "error": "No file uploaded"})

        if file and allowed_file(file.filename):
            filename = secure_filename(f"{unit}{street}{zipcode}{count}")
            filepaths.append(filename)
            count += 1

    for i, file in request.files.getlist('file'):
        file.save(path.join(prop_pics_folder, filepaths[i]))

    return jsonify({"success": "True"})


@app.route('/get-num-prop-photos', methods=['GET'])  # get property photos
def get_prop_photos():
    zipcode = request.args.get('zipcode')
    street = request.args.get('street')
    unit = request.args.get('unit')

    for count in range(100):
        filename = secure_filename(f"{unit}{street}{zipcode}{count}.png")
        photoPath = path.abspath(path.join(prop_pics_folder, filename))
        if(path.exists(photoPath)):
            continue
        
        filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpg")
        photoPath = path.abspath(path.join(prop_pics_folder, filename))
        if(path.exists(photoPath)):
            continue
        
        filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpeg")
        photoPath = path.abspath(path.join(prop_pics_folder, filename))
        if(path.exists(photoPath)):
            continue
        
        break

    return jsonify({"success": "True", "numPics": count})

@app.route('/prop-photo/<street>/<unit>/<zipcode>/<count>')  # Get prop pic
def prop_photo(street, unit, zipcode, count):

    filename = secure_filename(f"{unit}{street}{zipcode}{count}.png")
    photoPath = path.abspath(path.join(prop_pics_folder, filename))
    if(path.exists(photoPath)):
        return send_file(photoPath)
    
    filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpg")
    photoPath = path.abspath(path.join(prop_pics_folder, filename))
    if(path.exists(photoPath)):
        return send_file(photoPath)
    
    filename = secure_filename(f"{unit}{street}{zipcode}{count}.jpeg")
    photoPath = path.abspath(path.join(prop_pics_folder, filename))
    if(path.exists(photoPath)):
        return send_file(photoPath)
    
    return jsonify({"error": "no image found"})

@app.route('/upload_lease', methods=['POST'])  # Upload lease document
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
        filename = secure_filename(f"{unit}{street}{zipcode}.pdf")
        file.save(path.join(lease_folder, filename))
        return jsonify({"success": "True"})

    return jsonify({"success": "False", "error": "File was not uploaded"})


@app.route('/download-lease/<street>/<unit>/<zipcode>')  # Get lease document
def download_lease(street, unit, zipcode):

    filename = secure_filename(f"{unit}{street}{zipcode}.pdf")

    return send_file(path.abspath(path.join(lease_folder, filename)), as_attachment=True)


@app.route('/get-name', methods=['GET'])  # user's name from their email
def get_name():
    user_email = request.args.get('email')
    query = "SELECT name FROM User WHERE email = %s;"
    conn = getConn()

    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (user_email,))
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


if __name__ == '__main__':
    app.run(debug=True)
