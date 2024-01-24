from flask import Flask, request

app = Flask(__name__)

@app.route('/negotiations', methods=['POST'])
def create_negotiation():
    # Logic to create a new negotiation
    pass

@app.route('/negotiations/<int:negotiation_id>', methods=['GET'])
def get_negotiation(negotiation_id):
    # Logic to get the details of a specific negotiation
    pass

@app.route('/negotiations/<int:negotiation_id>', methods=['PUT'])
def update_negotiation(negotiation_id):
    # Logic to update a specific negotiation
    pass

@app.route('/negotiations/<int:negotiation_id>', methods=['DELETE'])
def delete_negotiation(negotiation_id):
    # Logic to delete a specific negotiation
    pass
