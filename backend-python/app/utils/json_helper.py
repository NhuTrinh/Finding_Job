import json
import os

from pathlib import Path

def load_json_file(path):
    file = Path(path)

    if not file.exists():
        return []

    if file.stat().st_size == 0:
        return []

    try:
        with open(file, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []
    
def save_json_file(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)