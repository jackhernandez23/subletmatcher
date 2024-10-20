from flask import Flask, jsonify, request
from flask_cors import CORS #Cross origin requests, assuming React front and Flask back
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

CORS(app)


#Todo : Put MySQL connection

@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "This is a test..."})


@app.route('/signup', methods=['POST'])  #Sign up route
def signup():
    data = request.get_json()
    email = data.get('email')
    passphrase = generate_password_hash(data.get('passphrase')) #Hashes password for storage
    name = data.get('name')
    phone = data.get('phone')

    query = "INSERT INTO User(Email, Passphrase, Name, Phone) VALUES (%s, %s, %s, %s)"
    try:
        # TODO: Execute database query
        return jsonify({"message": "Account created successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/login', methods=['POST']) #Log in route
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('passphrase')

    query = "SELECT Passphrase FROM User WHERE EMAIL = %s"

    #TODO: Execute database query, use check_password_hash from werkzeug to check that stored password
    # hash matches password, check_password_hash(hashedpassword, password)

    return jsonify({"error": "Incorrect username or password"})

@app.route('/addlease', methods=['POST'])
def addLease():
    return None


if __name__ == '__main__':
    app.run(debug=True)