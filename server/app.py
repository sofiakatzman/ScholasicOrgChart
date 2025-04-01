from flask import render_template
from server.config import app, jsonify
from server.routes.routes import *
from server.seed_utils import seed
from server.models.models import User

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

@app.route('/')
@app.route('/auth')
@app.route('/useronly')

def index(id=0):
    return render_template("index.html")
if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=8000, debug=False)
    check_and_seed()
    app.run(port=5555, debug=True)