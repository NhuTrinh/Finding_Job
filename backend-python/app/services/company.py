import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.json_helper import load_json_file, save_json_file
from app.utils.security import hash_password, verify_password, create_access_token, decode_token
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "company_profile.json"
security = HTTPBearer()

def get_company():
    company = load_json_file(DATA_FILE)

    list_company = []

    for c in company:
        dic_company = {}
        dic_company["id"] = c['id']
        dic_company["name"] = c['name']
        list_company.append(dic_company)
    return list_company

def update_company(id, update_data):
    company = load_json_file(DATA_FILE)

    data_update = update_data.model_dump(exclude_unset=True)

    for index, r in enumerate(company):
        if r['id'] == id:

            company[index].update(data_update)

            save_json_file(DATA_FILE, company)

            return {
                'status': 'success',
                'message': 'Company updated successfully.',
                'data': company[index]
            }
        
def get_company_by_id(id):
    company = load_json_file(DATA_FILE)

    for c in company:
        if c['id'] == id:
            return c