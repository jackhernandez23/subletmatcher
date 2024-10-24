from flask import Flask, jsonify, request
from flask_cors import CORS #Cross origin requests, assuming React front and Flask back
import mysql.connector
import configparser

app = Flask(__name__)

CORS(app)

config_file = "../database/sm_db_config.ini"
config = configparser.ConfigParser()
config.read(config_file)

conn = mysql.connector.connect(
    user=config['DEFAULT']['username'],
    password=config['DEFAULT']['password'],
  host=config['DEFAULT']['servername'],
  database=config['DEFAULT']['dbname'])


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
        # TODO: Execute database query
        return jsonify({"message": "Account created successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})


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
    return None


if __name__ == '__main__':
    app.run(debug=True)