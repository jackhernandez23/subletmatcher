from flask import Flask, jsonify, request
from flask_cors import CORS #Cross origin requests, assuming React front and Flask back
app = Flask(__name__)

CORS(app)

@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "This is a test..."})



if __name__ == '__main__':
    app.run()