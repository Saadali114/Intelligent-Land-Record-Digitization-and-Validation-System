#!/usr/bin/env python
"""
Run OCR Script
==============
Executes image preprocessing and multilingual OCR on a raw document scan,
saving tokens, bounding boxes, confidence, and page number into data/ocr/<doc_id>.json.

Usage:
    python scripts/run_ocr.py --input data/raw/7_12/DOC_001.jpg
"""

import os
import sys
import argparse

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.preprocessing.image_processor import image_processor
from src.ocr.ocr_processor import ocr_processor


def main():
    parser = argparse.ArgumentParser(description="Run OCR on a Land Document")
    parser.add_argument("--input", "-i", type=str, required=True, help="Path to input image")
    parser.add_argument("--output", "-o", type=str, default="", help="Custom output JSON path")
    parser.add_argument("--doc-id", type=str, default="", help="Explicit document ID")
    parser.add_argument("--engine", type=str, default="paddleocr", choices=["paddleocr", "easyocr"], help="Primary OCR engine")
    parser.add_argument("--save-preprocessed", action="store_true", help="Save preprocessed image to data/processed/")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' does not exist.")
        sys.exit(1)

    filename = os.path.basename(args.input)
    doc_id = args.doc_id or os.path.splitext(filename)[0]

    print(f"[OCR Runner] Processing: {args.input} (ID: {doc_id})...")

    # 1. Preprocessing
    print("[OCR Runner] Stage 1: Running OpenCV image enhancement & deskewing...")
    prep_res = image_processor.process(args.input)
    print(f"[OCR Runner] Preprocessing complete. Skew angle: {prep_res.skew_angle:.2f} deg.")

    if args.save_preprocessed:
        proc_path = os.path.join("data", "processed", f"{doc_id}_processed.png")
        os.makedirs(os.path.dirname(proc_path), exist_ok=True)
        import cv2
        cv2.imwrite(proc_path, prep_res.final_image)
        print(f"[OCR Runner] Saved preprocessed image to: {proc_path}")

    # 2. OCR
    print(f"[OCR Runner] Stage 2: Running text recognition ({args.engine})...")
    ocr_processor.primary_engine = args.engine
    ocr_res = ocr_processor.process_image(prep_res.final_image, document_id=doc_id)

    # 3. Save to data/ocr/<doc_id>.json
    out_path = args.output or os.path.join("data", "ocr", f"{doc_id}.json")
    ocr_res.save(out_path)

    print(f"\n[OCR Runner] Extraction Succeeded!")
    print(f"Engine Used     : {ocr_res.engine_used}")
    print(f"Tokens Extracted: {len(ocr_res.tokens)}")
    print(f"Saved Output To : {out_path}")
    print(f"Next step       : Annotate tokens with the Annotation Tool or create dataset.")


if __name__ == "__main__":
    main()
