import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

file_path = "backend/uploads/file-1788689957557-414671962.png"
if not os.path.exists(file_path):
    print("File not found:", file_path)
    sys.exit(1)

import easyocr
reader = easyocr.Reader(["mr", "en"], gpu=False, model_storage_directory="ai-service/models")
res = reader.readtext(file_path)

print("=== RAW OCR TOKENS ===")
for bbox, text, conf in res:
    print(f"{conf:.2f} | {text}")

full_text = "\n".join([r[1] for r in res])
print("\n=== FULL TEXT ===")
print(full_text)

with open("ocr_dump_current.txt", "w", encoding="utf-8") as f:
    f.write(full_text)
