import requests
from dotenv import load_dotenv
import os
from pathlib import Path
from urllib.parse import quote
import ast
import json

dotenv_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path)

AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
BASE_ID = os.getenv("BASE_ID")
TABLE_ID = os.getenv("TABLE_ID")
VIEW_ID = os.getenv("VIEW_ID")
FIELDS = ast.literal_eval(os.getenv("FIELDS"))


fields_query = "&" + "&".join([f"fields[]={quote(field)}" for field in FIELDS])

def get_airtable_data():
    url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}?view={VIEW_ID}{fields_query}"
    print(url)
    headers = {
        'Authorization': f'Bearer {AIRTABLE_API_KEY}'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()['records']

def build_tree(records, root_name="Laura Lundgren"):
    # Step 1: Index people by record ID and build name lookup
    people_by_id = {}
    name_to_id = {}

    for record in records:
        fields = record.get("fields", {})
        name = fields.get("Name")
        record_id = record["id"]
        if name:
            person = {
                "id": record_id,
                "name": name,
                "title": fields.get("Title", ""),
                "className": fields.get("Designation Type", "").lower().replace(" ", "-") if fields.get("Designation Type") else "",
                "photo": fields.get("Photo", [{}])[0].get("url", "") if fields.get("Photo") else "",
                "reports_to": fields.get("Reports to", [None])[0] if isinstance(fields.get("Reports to"), list) else fields.get("Reports to"),
                "children": []
            }
            people_by_id[record_id] = person
            name_to_id[name] = record_id

    print("\nIndexed people:")
    for name in name_to_id:
        print("-", name)

    # Step 2: Build tree by assigning children to their manager by ID
    root = None
    for person in people_by_id.values():
        manager_id = person["reports_to"]
        if manager_id and manager_id in people_by_id:
            people_by_id[manager_id]["children"].append(person)
        elif person["name"] == root_name:
            root = person

    if not root:
        print(f"\n❗ Root person '{root_name}' not found.")
    return root
