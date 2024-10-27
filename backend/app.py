from errno import EOWNERDEAD

from flask import Flask, jsonify, request
from flask_cors import CORS #Cross origin requests, assuming React front and Flask back
import mysql.connector
import configparser

from backend.fake_data import streets

app = Flask(__name__)

CORS(app)

config_file = "../sm_db_config.ini"
config_parse = configparser.ConfigParser()
config_parse.read(config_file)

if config_parse.has_section('DEFAULT'):
    config = {'user':config_parse['DEFAULT']['username'],
              'password':config_parse['DEFAULT']['password'],
              'host':config_parse['DEFAULT']['servername'],
              'database':config_parse['DEFAULT']['dbname']}

else: # To operate mysql locally make sure you have it running.
    config = {'user':'USERNAME',
              'password':'localPassword', # I suggest having no password on your local account
              'host':'localhost',
              'database':'sublet_matcher'}

conn = mysql.connector.connect(
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

    if conn and conn.is_connected():
        cursor = conn.cursor(buffered=True)
        result = cursor.execute(query)
        rows = cursor.fetchall()

        success = len(rows) == 1

        return jsonify({"success": success})

    else:

        print("Could not connect")


    return jsonify({"error": "Incorrect username or password"})

@app.route('/addlease', methods=['POST'])
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
    return jsonify({"error": "Property upload unsuccessful"})


if __name__ == '__main__':
    app.run(debug=True)