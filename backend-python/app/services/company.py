from fastapi import HTTPException
from app.utils.json_helper import load_json_file, save_json_file
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "company_profile.json"


def get_company():
    company = load_json_file(DATA_FILE)
    return [{"id": c["id"], "name": c["name"]} for c in company]


def update_company(company_id: int, update_data):
    company = load_json_file(DATA_FILE)
    data_update = update_data.model_dump(exclude_unset=True)

    for index, c in enumerate(company):
        if c["id"] == company_id:
            company[index].update(data_update)
            save_json_file(DATA_FILE, company)
            return {
                "status": "success",
                "message": "Company updated successfully.",
                "data": company[index]
            }

    raise HTTPException(status_code=404, detail="Company not found")


def get_company_by_id(company_id: int):
    company = load_json_file(DATA_FILE)
    for c in company:
        if c["id"] == company_id:
            return c
    raise HTTPException(status_code=404, detail="Company not found")