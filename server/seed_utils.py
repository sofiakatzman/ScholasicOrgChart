from server.models.models import User
from server.config import db

def seed():
    # delete current data
    User.query.delete()

    # create admin user
    admin = User(username="admin", admin=True)
    admin.password_hash = 'admin'

    db.session.add(admin)
    db.session.commit()