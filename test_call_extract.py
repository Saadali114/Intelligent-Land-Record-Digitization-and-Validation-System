import requests  # type: ignore
import json
import os

url = "http://localhost:8000/extract"
file_path = "backend/uploads/file-1788689957557-414671962.png"

with open(file_path, "rb") as f:
    files = {"file": (os.path.basename(file_path), f, "image/png")}
    data = {"language": "Marathi", "file_name": "ChatGPT Image Sep 6, 2026, 03_22_21 PM.png"}
    res = requests.post(url, files=files, data=data)

print("Status:", res.status_code)
if res.status_code == 200:
    out = res.json()
    print(json.dumps(out, indent=2, ensure_ascii=False))
else:
    print(res.text)
