#!/usr/bin/env python
"""
Train Script
============
CLI interface for fine-tuning XLM-RoBERTa Token Classification head.

Usage:
    python scripts/train.py \
        --task ner \
        --model xlm-roberta-base \
        --epochs 5 \
        --batch-size 8 \
        --learning-rate 2e-5 \
        --output-dir models/land-ner
"""

import os
import sys
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.training.train import train_model


def main():
    parser = argparse.ArgumentParser(description="Train XLM-RoBERTa Land NER Model")
    parser.add_argument("--task", type=str, default="ner", choices=["ner"], help="Task name")
    parser.add_argument("--model", type=str, default="xlm-roberta-base", help="Pretrained model identifier")
    parser.add_argument("--dataset", type=str, default="data/train", help="Training dataset path or directory")
    parser.add_argument("--val-dataset", type=str, default="data/validation", help="Validation dataset path or directory")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=8, help="Per-device batch size")
    parser.add_argument("--learning-rate", type=float, default=2e-5, help="Learning rate for AdamW")
    parser.add_argument("--output-dir", type=str, default="models/land-ner-v1", help="Directory to save model checkpoint")
    parser.add_argument("--device", type=str, default=None, choices=["cuda", "cpu"], help="Override computing device")

    args = parser.parse_args()

    print("=" * 60)
    print("LAND RECORD AI - MODEL TRAINING")
    print("=" * 60)
    print(f"Task          : {args.task}")
    print(f"Base Model    : {args.model}")
    print(f"Train Dataset : {args.dataset}")
    print(f"Val Dataset   : {args.val_dataset}")
    print(f"Epochs        : {args.epochs}")
    print(f"Batch Size    : {args.batch_size}")
    print(f"Learning Rate : {args.learning_rate}")
    print(f"Output Dir    : {args.output_dir}")
    print("=" * 60)

    res = train_model(
        model_name=args.model,
        train_data_path=args.dataset,
        val_data_path=args.val_dataset,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        device_override=args.device,
    )

    if res.get("status") == "ABORTED":
        print(f"\n[Warning] {res.get('reason')}")
        sys.exit(0)


if __name__ == "__main__":
    main()
