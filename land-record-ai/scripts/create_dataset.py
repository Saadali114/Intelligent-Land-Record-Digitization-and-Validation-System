#!/usr/bin/env python
"""
Create Dataset Script
=====================
Reads individual document annotations from data/annotations/*.json and
converts them into standardized (words, BIO tags) dataset format.

Usage:
    python scripts/create_dataset.py --input-dir data/annotations --output data/dataset.json
"""

import os
import sys
import glob
import json
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.extraction.labels import text_and_spans_to_bio, label_manager


def main():
    parser = argparse.ArgumentParser(description="Compile Annotations into Training Dataset")
    parser.add_argument("--input-dir", type=str, default="data/annotations", help="Annotations directory")
    parser.add_argument("--output", "-o", type=str, default="data/dataset.json", help="Combined dataset JSON file")
    args = parser.parse_args()

    files = glob.glob(os.path.join(args.input_dir, "*.json"))
    if not files:
        print(f"No annotation JSON files found in '{args.input_dir}'.")
        print("Please annotate documents first via the Annotation Tool.")
        sys.exit(0)

    dataset = []
    total_tokens = 0
    total_entities = 0

    print(f"[Dataset Compiler] Compiling {len(files)} annotation files...")

    for fpath in files:
        with open(fpath, "r", encoding="utf-8") as f:
            rec = json.load(f)

        doc_id = rec.get("document_id", os.path.splitext(os.path.basename(fpath))[0])
        text = rec.get("text", "")
        entities = rec.get("entities", [])

        # If already formatted with words and tags
        if "words" in rec and "tags" in rec:
            words = rec["words"]
            tags = rec["tags"]
        else:
            bio_tuples = text_and_spans_to_bio(text, entities)
            words = [t[0] for t in bio_tuples]
            tags = [t[1] for t in bio_tuples]

        total_tokens += len(words)
        total_entities += len(entities)

        dataset.append({
            "document_id": doc_id,
            "text": text,
            "entities": entities,
            "words": words,
            "tags": tags,
        })

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f"[Dataset Compiler] Successfully compiled dataset:")
    print(f"  Documents   : {len(dataset)}")
    print(f"  Total Words : {total_tokens}")
    print(f"  Entities    : {total_entities}")
    print(f"  Output File : {args.output}")
    print(f"Next step: Split dataset using -> python scripts/split_dataset.py")


if __name__ == "__main__":
    main()
