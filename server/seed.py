from server.app import app
from server.seed_utils import seed

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        seed()
        print("Seed complete!")