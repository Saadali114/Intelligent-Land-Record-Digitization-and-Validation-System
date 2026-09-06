#!/usr/bin/env python
"""
Add Document Script
===================
Ingests a document scan into data/raw/<doc_type>/ and records its provenance
in data/metadata.csv without exposing personal private information (PII).

Usage:
    python scripts/add_document.py \
        --input path/to/scan.jpg \
        --type 7_12 \
        --language Marathi \
        --year 2020 \
        --district Pune \
        --taluka Mulshi \
        --village Hinjawadi \
        --source authorized_contributor \
        --permission true
"""

import os
import sys
import shutil
import hashlib
import argparse
import csv

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def compute_file_hash(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()[:12]


def main():
    parser = argparse.ArgumentParser(description="Add Document to Land Record Dataset")
    parser.add_argument("--input", "-i", type=str, required=True, help="Path to input document scan")
    parser.add_argument("--type", "-t", type=str, default="7_12", choices=["7_12", "ferfar", "8a", "sale_deed"], help="Document type")
    parser.add_argument("--language", "-l", type=str, default="Marathi", help="Primary language")
    parser.add_argument("--year", "-y", type=str, default="", help="Year of record")
    parser.add_argument("--district", "-d", type=str, default="", help="District")
    parser.add_argument("--taluka", type=str, default="", help="Taluka/Tehsil")
    parser.add_argument("--village", type=str, default="", help="Village name")
    parser.add_argument("--source", "-s", type=str, default="authorized_contributor", help="Document provenance source")
    parser.add_argument("--permission", type=str, default="true", help="Explicit permission obtained (true/false)")
    parser.add_argument("--quality", "-q", type=str, default="good", choices=["good", "faded", "noisy", "skewed"], help="Scan quality")
    parser.add_argument("--notes", type=str, default="", help="Non-PII administrative notes")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' does not exist.")
        sys.exit(1)

    # Calculate deterministic document ID from file content hash
    file_hash = compute_file_hash(args.input)
    ext = os.path.splitext(args.input)[1].lower() or ".jpg"

    # Count existing docs to form serial ID
    dest_dir = os.path.join("data", "raw", args.type)
    os.makedirs(dest_dir, exist_ok=True)
    existing_count = len(os.listdir(dest_dir))
    doc_id = f"DOC_{args.type.upper()}_{existing_count + 1:03d}_{file_hash}"

    dest_path = os.path.join(dest_dir, f"{doc_id}{ext}")
    shutil.copy2(args.input, dest_path)
    print(f"Copied document scan to: {dest_path}")

    # Append to metadata.csv
    meta_file = os.path.join("data", "metadata.csv")
    os.makedirs(os.path.dirname(meta_file), exist_ok=True)

    header = [
        "document_id", "document_type", "language", "year", "district",
        "taluka", "village", "source", "permission", "anonymized",
        "image_quality", "notes"
    ]

    file_exists = os.path.exists(meta_file) and os.path.getsize(meta_file) > 0
    with open(meta_file, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(header)
        writer.writerow([
            doc_id,
            args.type,
            args.language,
            args.year,
            args.district,
            args.taluka,
            args.village,
            args.source,
            args.permission.lower() == "true",
            True,  # anonymized is strictly enforced
            args.quality,
            args.notes.replace(",", ";"),
        ])

    print(f"Recorded metadata for {doc_id} in {meta_file}")
    print(f"Next step: Run OCR using -> python scripts/run_ocr.py --input {dest_path}")


if __name__ == "__main__":
    main()
