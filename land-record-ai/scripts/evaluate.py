#!/usr/bin/env python
"""
Model Evaluation Script
=======================
Evaluates a trained model checkpoint on the test partition.
Calculates exact entity-level Precision, Recall, and F1.
Reports 'No trained model/evaluation results available.' if not trained.

Usage:
    python scripts/evaluate.py --model-dir models/land-ner-v1 --test-data data/test
"""

import os
import sys
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.training.model import load_trained_model
from src.training.dataset import LandRecordNERDataset
from src.training.tokenizer import SubwordAligner
from src.training.evaluate import evaluate_model_on_dataset, format_evaluation_report


def main():
    parser = argparse.ArgumentParser(description="Evaluate Land Record NER Model")
    parser.add_argument("--model-dir", type=str, default="models/land-ner-v1", help="Trained model directory")
    parser.add_argument("--test-data", type=str, default="data/test", help="Test dataset directory or file")
    parser.add_argument("--batch-size", type=int, default=8, help="Evaluation batch size")
    parser.add_argument("--device", type=str, default=None, choices=["cuda", "cpu"], help="Override computing device")

    args = parser.parse_args()

    import torch
    device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")

    # 1. Check if model exists
    model, tokenizer, info = load_trained_model(args.model_dir, device=device)
    if model is None:
        print("\nNo trained model/evaluation results available.")
        print(f"Model status: NOT TRAINED ({info.get('message')})\n")
        sys.exit(0)

    # 2. Check if test dataset exists
    if not os.path.exists(args.test_data):
        print(f"\nTest dataset path '{args.test_data}' does not exist.")
        print("No evaluation dataset available.\n")
        sys.exit(0)

    aligner = SubwordAligner(model_name=args.model_dir)
    test_dataset = LandRecordNERDataset(args.test_data, tokenizer_aligner=aligner)

    if len(test_dataset) == 0:
        print("\nNo trained model/evaluation results available.")
        print(f"Test dataset '{args.test_data}' contains 0 samples.\n")
        sys.exit(0)

    print(f"\nRunning evaluation on {len(test_dataset)} test documents using {device.upper()}...")
    metrics = evaluate_model_on_dataset(model, test_dataset, batch_size=args.batch_size, device=device)

    print(format_evaluation_report(metrics))


if __name__ == "__main__":
    main()
