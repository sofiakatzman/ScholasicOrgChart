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
                "children": [],
                "collapsed": True  # default to collapsed
            }
            people_by_id[record_id] = person
            name_to_id[name] = record_id

    # Step 2: Build tree and track direct reports to Laura
    root = None
    laura_id = name_to_id.get(root_name)
    direct_reports = set()

    for person in people_by_id.values():
        manager_id = person["reports_to"]
        if manager_id == laura_id:
            direct_reports.add(person["id"])
        if manager_id and manager_id in people_by_id:
            people_by_id[manager_id]["children"].append(person)
        elif person["name"] == root_name:
            root = person

    # Step 3: Uncollapse Laura and her direct reports
    if root:
        root["collapsed"] = False
    for report_id in direct_reports:
        people_by_id[report_id]["collapsed"] = False

    # Add compact flag for those with more than 2 children
    for person in people_by_id.values():
        if len(person["children"]) > 2 and person["name"] != root_name:
            person["compact"] = True
            person["hybrid"] = True

    if not root:
        print(f"\n❗ Root person '{root_name}' not found.")
    return root

def flatten_for_d3_org_chart(records):
    flat_data = []
    existing_ids = {record["id"] for record in records}

    for record in records:
        fields = record.get("fields", {})
        record_id = record["id"]
        name = fields.get("Name")
        if not name:
            continue

        entry = {
            "id": record_id,
            "name": name,
            "title": fields.get("Title", ""),
            "className": fields.get("Designation Type", "").lower().replace(" ", "-") if fields.get("Designation Type") else "",
            "photo": fields.get("Photo", [{}])[0].get("url", "") if fields.get("Photo") else "",
        }

        manager = fields.get("Reports to", [None])[0] if isinstance(fields.get("Reports to"), list) else fields.get("Reports to")
        
        if manager and manager in existing_ids:
            entry["parentId"] = manager
        else:
            if manager:
                entry["parentId"] = None
                print(f"⚠️ Manager {manager} not found for {name} — treating as root.")

        flat_data.append(entry)

    return flat_data
