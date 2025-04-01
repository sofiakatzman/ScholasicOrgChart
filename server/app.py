from flask import render_template
from config import app, jsonify
from routes.routes import *
from seed_utils import seed
from models.models import User
from routes.data_tree import build_tree, get_airtable_data

# system logging
import sys
print(sys.path)

def check_and_seed():
    with app.app_context():
        if User.query.first() is None:
            print("No users found, seeding database...")
            seed()
        else:
            print("Users already exist. Skipping seeding.")


@app.route('/api/users')
def api_users():
    return jsonify({"message": "API endpoint for users"})

@app.route('/api/org-chart', methods=['GET'])
def get_org_chart():
    people_data = get_airtable_data() 
    print("Building Tree!")
    org_chart = build_tree(people_data) 
    return jsonify(org_chart)

@app.route('/')
@app.route('/auth')
@app.route('/useronly')

def index(id=0):
    return render_template("index.html")
if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=8000, debug=False)
    check_and_seed()
    app.run(port=5555, debug=True)