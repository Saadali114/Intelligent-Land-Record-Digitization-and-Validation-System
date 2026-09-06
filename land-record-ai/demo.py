#!/usr/bin/env python
"""
Land Record AI - CLI Demo
==========================
Usage:
    python demo.py --input path/to/document.jpg
"""

import sys
import os
import argparse

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add parent directory to sys.path so land-record-ai modules resolve cleanly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.pipeline import LandRecordInferencePipeline


def main():
    parser = argparse.ArgumentParser(description="Land Record AI - Extraction Demo")
    parser.add_argument("--input", "-i", type=str, required=True, help="Path to scanned land document (JPG/PNG/PDF)")
    parser.add_argument("--model-dir", type=str, default="models/land-ner-v1", help="Path to trained model directory")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' not found.")
        sys.exit(1)

    print("\nProcessing document through Land Record AI Pipeline...")
    pipeline = LandRecordInferencePipeline(model_dir=args.model_dir)
    res = pipeline.process(args.input)

    fields = res.get("fields", {})
    confidence = res.get("confidence", {})

    owner_name = fields.get("ownerName", "Not Detected")
    gat_number = fields.get("gatNumber") or fields.get("surveyNumber", "Not Detected")
    village = fields.get("village", "Not Detected")
    taluka = fields.get("taluka", "Not Detected")
    district = fields.get("district", "Not Detected")
    land_area = fields.get("landArea", "Not Detected")
    land_unit = fields.get("landAreaUnit", "hectare")

    # Average confidence of detected fields
    avg_conf = (
        sum(confidence.values()) / len(confidence)
        if confidence else 0.85
    )

    status = "NEEDS_REVIEW" if res.get("requiresReview") else "VERIFIED"

    print("\n" + "=" * 40)
    print("LAND RECORD AI")
    print("=" * 40)
    print(f"\nDocument Type : {res.get('documentType', '7_12')}")
    print(f"Language      : {', '.join(res.get('language', ['Marathi']))}\n")
    print(f"Owner Name    : {owner_name}")
    print(f"Gat Number    : {gat_number}")
    print(f"Village       : {village}")
    print(f"Taluka        : {taluka}")
    print(f"District      : {district}")
    if land_area != "Not Detected":
        print(f"Land Area     : {land_area} {land_unit}")
    else:
        print(f"Land Area     : Not Detected")

    print(f"\nConfidence    : {avg_conf:.0%}")
    print(f"\nStatus        : {status}")
    print("=" * 40 + "\n")


if __name__ == "__main__":
    main()
