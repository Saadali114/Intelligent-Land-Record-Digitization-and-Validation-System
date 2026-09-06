#!/usr/bin/env python
"""
Dataset Statistics Script
=========================
Tracks dataset growth and reports:
- Total Documents & Pages
- Language breakdown
- Document types (7/12, Ferfar, 8A, Sale Deed)
- Entity counts per label
- Total annotated tokens
- Training, Validation, and Test example counts

Usage:
    python scripts/dataset_stats.py
"""

import os
import sys
import glob
import json
import csv
from collections import Counter

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def main():
    print("=" * 60)
    print("LAND RECORD AI - DATASET STATISTICS")
    print("=" * 60)

    # 1. Metadata check
    meta_path = "data/metadata.csv"
    meta_docs = []
    doc_types = Counter()
    languages = Counter()

    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                meta_docs.append(row)
                doc_types[row.get("document_type", "unknown")] += 1
                languages[row.get("language", "unknown")] += 1

    # 2. Raw documents check
    raw_files = glob.glob("data/raw/**/*.*", recursive=True)
    raw_images = [f for f in raw_files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.pdf'))]

    # 3. OCR documents check
    ocr_files = glob.glob("data/ocr/*.json")

    # 4. Annotations & Entities breakdown
    annotation_files = glob.glob("data/annotations/*.json")
    entity_counts = Counter()
    total_tokens = 0

    for af in annotation_files:
        try:
            with open(af, "r", encoding="utf-8") as f:
                data = json.load(f)
                entities = data.get("entities", [])
                for e in entities:
                    entity_counts[e.get("label", "UNKNOWN")] += 1
                words = data.get("words", [])
                if words:
                    total_tokens += len(words)
                else:
                    text = data.get("text", "")
                    total_tokens += len(text.split())
        except Exception:
            pass

    # 5. Partition counts
    train_docs = len(glob.glob("data/train/*.json"))
    # Subtract train.json combined file if present
    if os.path.exists("data/train/train.json") and train_docs > 1:
        train_docs -= 1

    val_docs = len(glob.glob("data/validation/*.json"))
    if os.path.exists("data/validation/val.json") and val_docs > 1:
        val_docs -= 1

    test_docs = len(glob.glob("data/test/*.json"))
    if os.path.exists("data/test/test.json") and test_docs > 1:
        test_docs -= 1

    print(f"\n[Documents & Provenance]")
    print(f"  Raw Scans Collected   : {len(raw_images)}")
    print(f"  Metadata Records       : {len(meta_docs)}")
    print(f"  OCR Processed Scans    : {len(ocr_files)}")
    print(f"  Annotated Documents    : {len(annotation_files)}")
    print(f"  Annotated Tokens (Words): {total_tokens}")

    print(f"\n[Document Types]")
    if doc_types:
        for dtype, count in doc_types.items():
            print(f"  {dtype:<18}: {count}")
    else:
        print("  No categorized document types in metadata.csv yet.")

    print(f"\n[Languages]")
    if languages:
        for lang, count in languages.items():
            print(f"  {lang:<18}: {count}")
    else:
        print("  No languages recorded in metadata.csv yet.")

    print(f"\n[Entity Label Distribution]")
    if entity_counts:
        for ent, count in entity_counts.most_common():
            print(f"  {ent:<20}: {count}")
    else:
        print("  No annotated entities found in data/annotations/.")

    print(f"\n[Dataset Partitions]")
    print(f"  Training Examples     : {train_docs}")
    print(f"  Validation Examples   : {val_docs}")
    print(f"  Test Examples         : {test_docs}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
