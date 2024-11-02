from errno import EOWNERDEAD

from flask import Flask, jsonify, request
from flask_cors import CORS #Cross origin requests, assuming React front and Flask back
import mysql.connector
import configparser

from fake_data import streets

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}})

def getConn():
    config_file = "../sm_db_config.ini"
    config_parse = configparser.ConfigParser()
    config_parse.read(config_file)

    if config_parse.has_section('DEFAULT'):
        config = {'user':config_parse['DEFAULT']['username'],
                'password':config_parse['DEFAULT']['password'],
                'host':config_parse['DEFAULT']['servername'],
                'database':config_parse['DEFAULT']['dbname']}

    else: # To operate mysql locally make sure you have it running.
        config = {'user':'user1',
                'password':'password', # I suggest having no password on your local account
                'host':'127.0.0.1',
                'database':'sublet_matcher'}

    return mysql.connector.connect(
        user=config['user'],
        password=config['password'],
        host=config['host'],
        database=config['database'])

@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "This is a test..."})


@app.route('/signup', methods=['POST'])  #Sign up route
def signup():
    data = request.get_json()
    email = data.get('email')
    passphrase = data.get('passphrase') #Hashes password for storage
    name = data.get('name')
    phone = data.get('phone')

    query = "INSERT INTO User(Email, Passphrase, Name, Phone) VALUES (%s, sha1(%s), %s, %s)"
    conn = getConn()
    try:
        if conn and conn.is_connected():
            cursor = conn.cursor(buffered=True)
            cursor.execute(query, (email, passphrase, name, phone))
            conn.commit()
            cursor.close()
            return jsonify({"message": "Account created successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})
    return jsonify({"error": "Account creation unsuccessful"})


@app.route('/login', methods=['GET']) #Log in route
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('passphrase')

    query = f"SELECT * FROM User WHERE Email = '{email}' and sha1('{password}') = Passphrase"

    conn = getConn()
    if conn and conn.is_connected():
        cursor = conn.cursor(buffered=True)
        result = cursor.execute(query)
        rows = cursor.fetchall()

        success = len(rows) == 1

        return jsonify({"success": success})

    else:

        print("Could not connect")


    return jsonify({"error": "Incorrect username or password"})

@app.route('/addlease', methods=['POST']) #Lease upload route
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
            result = cursor.execute(query, (street, unit, zipcode, owner, price, available, numOfRoomates, startDate, endDate))
            conn.commit()
            cursor.close()
        return jsonify({"message": "Property uploaded successfully"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/listings', methods=['GET']) #Listings route
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

if __name__ == '__main__':
    app.run(debug=True)