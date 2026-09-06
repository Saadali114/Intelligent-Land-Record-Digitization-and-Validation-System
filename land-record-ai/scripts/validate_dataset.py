#!/usr/bin/env python
"""
Dataset Validation Script
=========================
Checks dataset integrity prior to training:
- Broken JSON
- Empty documents
- Overlapping entity spans
- Invalid entity character positions (out of bounds, inverted)
- Missing labels or unsupported label names
- Duplicate document texts
- Invalid BIO sequence transitions

Usage:
    python scripts/validate_dataset.py --dataset data/dataset.json
    python scripts/validate_dataset.py --annotations-dir data/annotations
"""

import os
import sys
import glob
import json
import argparse
from typing import List, Dict, Any, Tuple

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.extraction.labels import label_manager


def validate_document_record(rec: Dict[str, Any]) -> List[str]:
    """Validates an individual document record and returns a list of error strings."""
    errors = []
    doc_id = rec.get("document_id", "UNKNOWN_DOC")

    # 1. Empty OCR check
    text = rec.get("text", "")
    words = rec.get("words", [])
    if not text.strip() and not words:
        errors.append("empty OCR text/tokens")
        return errors

    # 2. Entity span validation
    entities = rec.get("entities", [])
    valid_labels = set(label_manager.get_labels())
    sorted_spans: List[Tuple[int, int, str]] = []

    text_len = len(text)
    for idx, ent in enumerate(entities):
        lbl = ent.get("label")
        start = ent.get("start")
        end = ent.get("end")

        if not lbl:
            errors.append(f"missing label on entity #{idx}")
            continue

        if lbl not in valid_labels:
            errors.append(f"unsupported label '{lbl}' on entity #{idx}")

        if start is None or end is None:
            errors.append(f"missing start or end on entity #{idx}")
            continue

        if not isinstance(start, int) or not isinstance(end, int):
            errors.append(f"invalid non-integer entity bounds: [{start}, {end}]")
            continue

        if start < 0 or (text and end > text_len):
            errors.append(f"invalid entity position: [{start}, {end}] outside text boundary (0 to {text_len})")
            continue

        if start >= end:
            errors.append(f"invalid inverted or zero-length entity position: [{start}, {end}]")
            continue

        sorted_spans.append((start, end, lbl))

    # 3. Check for overlapping entities
    sorted_spans.sort(key=lambda s: s[0])
    for i in range(len(sorted_spans) - 1):
        cur_start, cur_end, cur_lbl = sorted_spans[i]
        next_start, next_end, next_lbl = sorted_spans[i + 1]

        # Overlap if next starts before current ends
        if next_start < cur_end:
            errors.append(f"overlapping entities: [{cur_start}:{cur_end}] ({cur_lbl}) and [{next_start}:{next_end}] ({next_lbl})")

    # 4. Check BIO tags if pre-tokenized words and tags exist
    tags = rec.get("tags", [])
    if words and tags:
        if len(words) != len(tags):
            errors.append(f"token/tag length mismatch: {len(words)} words vs {len(tags)} tags")

        prev_label = None
        for t_idx, tag in enumerate(tags):
            if tag != "O":
                if not (tag.startswith("B-") or tag.startswith("I-")):
                    errors.append(f"invalid tag format '{tag}' at index {t_idx}")
                else:
                    cur_label = tag[2:]
                    if tag.startswith("I-"):
                        # I- tag must follow B- or I- of the SAME label
                        if prev_label != cur_label:
                            errors.append(f"invalid BIO transition: 'I-{cur_label}' without preceding 'B-{cur_label}' at token index {t_idx}")
                    prev_label = cur_label
            else:
                prev_label = None

    return errors


def main():
    parser = argparse.ArgumentParser(description="Validate Land Record Dataset Integrity")
    parser.add_argument("--dataset", type=str, default="data/dataset.json", help="Path to compiled dataset JSON")
    parser.add_argument("--annotations-dir", type=str, default="data/annotations", help="Annotations directory")
    args = parser.parse_args()

    records = []

    # Try loading from compiled dataset
    if os.path.exists(args.dataset):
        try:
            with open(args.dataset, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    records = data
                elif isinstance(data, dict) and "examples" in data:
                    records = data["examples"]
        except Exception as e:
            print(f"Error loading dataset file '{args.dataset}': {e}")

    # Fallback to scanning annotation files in data/annotations/
    if not records and os.path.exists(args.annotations_dir):
        files = glob.glob(os.path.join(args.annotations_dir, "*.json"))
        for fpath in files:
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    records.append(json.load(f))
            except Exception as e:
                doc_name = os.path.basename(fpath)
                records.append({"document_id": doc_name, "_broken_json": str(e)})

    total_docs = len(records)
    if total_docs == 0:
        print("Dataset Validation")
        print("===================")
        print("Documents: 0")
        print("Valid: 0")
        print("Invalid: 0")
        print("\nNo documents found in dataset or annotations directory.")
        print("Please add and annotate documents before validating.")
        return

    valid_count = 0
    invalid_count = 0
    problems: Dict[str, List[str]] = {}
    seen_texts: Dict[str, str] = {}

    for rec in records:
        doc_id = rec.get("document_id", "DOC")
        doc_errors = []

        if "_broken_json" in rec:
            doc_errors.append(f"broken JSON: {rec['_broken_json']}")
        else:
            doc_errors = validate_document_record(rec)

            # Duplicate text check
            text_snippet = rec.get("text", "")[:120].strip()
            if text_snippet:
                if text_snippet in seen_texts:
                    doc_errors.append(f"duplicate text of {seen_texts[text_snippet]}")
                else:
                    seen_texts[text_snippet] = doc_id

        if doc_errors:
            invalid_count += 1
            problems[doc_id] = doc_errors
        else:
            valid_count += 1

    print("\nDataset Validation")
    print("===================")
    print(f"Documents: {total_docs}")
    print(f"Valid: {valid_count}")
    print(f"Invalid: {invalid_count}")

    if problems:
        print("\nProblems:")
        for did, errs in problems.items():
            for e in errs:
                print(f"{did} → {e}")
        sys.exit(1)
    else:
        print("\nAll documents passed validation checks successfully.")


if __name__ == "__main__":
    main()
