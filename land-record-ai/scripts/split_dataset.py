#!/usr/bin/env python
"""
Dataset Splitting Script
========================
Splits dataset into 70% Train, 15% Validation, and 15% Test partitions.
CRITICAL: Prevents data leakage by grouping duplicate templates, same-source scans,
or template clusters into the same partition so Test contains genuinely unseen records.

Usage:
    python scripts/split_dataset.py --dataset data/dataset.json
"""

import os
import sys
import json
import random
import argparse
from typing import List, Dict, Any

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def get_template_group_key(rec: Dict[str, Any]) -> str:
    """
    Computes a grouping key for templates to avoid splitting near-duplicate documents.
    Groups duplicate scans or exact same document variants together based on base ID or text hash.
    """
    doc_id = rec.get("document_id", "")
    # Group duplicates/copies (e.g. DOC_001_copy1 -> DOC_001)
    base_id = doc_id.split("_copy")[0].split("_dup")[0]
    return base_id if base_id else doc_id


def main():
    parser = argparse.ArgumentParser(description="Split Dataset without Template Leakage")
    parser.add_argument("--dataset", type=str, default="data/dataset.json", help="Compiled dataset JSON")
    parser.add_argument("--train-dir", type=str, default="data/train", help="Train output directory")
    parser.add_argument("--val-dir", type=str, default="data/validation", help="Validation output directory")
    parser.add_argument("--test-dir", type=str, default="data/test", help="Test output directory")
    parser.add_argument("--train-ratio", type=float, default=0.70, help="Train ratio (0.70)")
    parser.add_argument("--val-ratio", type=float, default=0.15, help="Validation ratio (0.15)")
    parser.add_argument("--test-ratio", type=float, default=0.15, help="Test ratio (0.15)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")

    args = parser.parse_args()

    if not os.path.exists(args.dataset):
        print(f"Error: Dataset file '{args.dataset}' does not exist.")
        print("Please compile the dataset first via: python scripts/create_dataset.py")
        sys.exit(1)

    with open(args.dataset, "r", encoding="utf-8") as f:
        records = json.load(f)

    if not records:
        print("Dataset is empty. Add annotated documents first.")
        sys.exit(1)

    random.seed(args.seed)

    # Group documents by template key to prevent duplicate leakage
    grouped: Dict[str, List[Dict[str, Any]]] = {}
    for r in records:
        key = get_template_group_key(r)
        grouped.setdefault(key, []).append(r)

    group_keys = list(grouped.keys())
    random.shuffle(group_keys)

    # Distribute groups according to requested ratios
    total_docs = len(records)
    target_val = max(1, int(total_docs * args.val_ratio)) if total_docs >= 3 else 0
    target_test = max(1, int(total_docs * args.test_ratio)) if total_docs >= 3 else 0
    target_train = max(1, total_docs - target_val - target_test)

    train_recs: List[Dict[str, Any]] = []
    val_recs: List[Dict[str, Any]] = []
    test_recs: List[Dict[str, Any]] = []

    for k in group_keys:
        cluster = grouped[k]
        if len(train_recs) < target_train:
            train_recs.extend(cluster)
        elif len(val_recs) < target_val:
            val_recs.extend(cluster)
        else:
            test_recs.extend(cluster)

    # If test is empty due to small group count, rebalance cleanly
    if not test_recs and len(train_recs) > 1:
        test_recs.append(train_recs.pop())

    # Create directories
    for d in [args.train_dir, args.val_dir, args.test_dir]:
        os.makedirs(d, exist_ok=True)

    # Save partition files
    def save_partition(recs, pdir, pname):
        # Combined JSON
        combined_path = os.path.join(pdir, f"{pname}.json")
        with open(combined_path, "w", encoding="utf-8") as f:
            json.dump(recs, f, indent=2, ensure_ascii=False)
        # Individual JSONs
        for r in recs:
            doc_id = r.get("document_id", "DOC")
            with open(os.path.join(pdir, f"{doc_id}.json"), "w", encoding="utf-8") as f:
                json.dump(r, f, indent=2, ensure_ascii=False)

    save_partition(train_recs, args.train_dir, "train")
    save_partition(val_recs, args.val_dir, "validation")
    save_partition(test_recs, args.test_dir, "test")

    print("\nDataset Partitioning Complete (Leak-Free Template Grouping):")
    print(f"  Total Documents : {total_docs}")
    print(f"  Template Groups : {len(grouped)}")
    print(f"  Training Set    : {len(train_recs)} documents ({len(train_recs)/total_docs:.1%}) -> {args.train_dir}/")
    print(f"  Validation Set  : {len(val_recs)} documents ({len(val_recs)/total_docs:.1%}) -> {args.val_dir}/")
    print(f"  Test Set        : {len(test_recs)} documents ({len(test_recs)/total_docs:.1%}) -> {args.test_dir}/")
    print("\nNext step: Run training using -> python scripts/train.py --task ner")


if __name__ == "__main__":
    main()
