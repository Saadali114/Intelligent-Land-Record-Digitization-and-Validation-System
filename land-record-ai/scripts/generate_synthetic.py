#!/usr/bin/env python
"""
Synthetic Dataset Generator
===========================
Generates clearly labeled, fictional test documents for testing the training,
annotation, and inference pipeline.

IMPORTANT (Requirement 23):
- Strictly uses fictional names, example villages, and test coordinates.
- Watermarked as [SYNTHETIC TEST DOCUMENT - NOT A REAL RECORD].
- Supplements initial system verification; does NOT replace real documents.

Usage:
    python scripts/generate_synthetic.py --count 6
"""

import os
import sys
import csv
import json
import argparse
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


# Fictional template entries
FICTIONAL_SAMPLES = [
    {
        "doc_id": "SYN_712_001",
        "doc_type": "7_12",
        "owner": "राम गणपत पाटील",
        "gat": "145/2A",
        "khata": "128",
        "area": "1.25",
        "unit": "हेक्टर",
        "village": "Example Village A",
        "taluka": "Example Taluka Alpha",
        "district": "Pune",
        "mutation": "312/2020",
        "date": "15/06/2020",
    },
    {
        "doc_id": "SYN_712_002",
        "doc_type": "7_12",
        "owner": "सुरेश बाबुराव गायकवाड",
        "gat": "89/1B",
        "khata": "245",
        "area": "2.40",
        "unit": "हेक्टर",
        "village": "Example Village Beta",
        "taluka": "Example Taluka Gamma",
        "district": "Nashik",
        "mutation": "450/2019",
        "date": "10/08/2019",
    },
    {
        "doc_id": "SYN_712_003",
        "doc_type": "7_12",
        "owner": "अनिल दत्तात्रय शिंदे",
        "gat": "204/3",
        "khata": "512",
        "area": "0.75",
        "unit": "हेक्टर",
        "village": "Example Village Delta",
        "taluka": "Example Taluka Epsilon",
        "district": "Satara",
        "mutation": "180/2021",
        "date": "22/01/2021",
    },
    {
        "doc_id": "SYN_FERFAR_004",
        "doc_type": "ferfar",
        "owner": "दिनेश मारुती जाधव",
        "gat": "310/2",
        "khata": "78",
        "area": "1.80",
        "unit": "हेक्टर",
        "village": "Example Village Zeta",
        "taluka": "Example Taluka Eta",
        "district": "Nagpur",
        "mutation": "670/2022",
        "date": "05/11/2022",
    },
    {
        "doc_id": "SYN_712_005",
        "doc_type": "7_12",
        "owner": "विजय तुकाराम पवार",
        "gat": "56/4C",
        "khata": "320",
        "area": "3.10",
        "unit": "हेक्टर",
        "village": "Example Village Theta",
        "taluka": "Example Taluka Iota",
        "district": "Kolhapur",
        "mutation": "210/2018",
        "date": "14/03/2018",
    },
    {
        "doc_id": "SYN_DEED_006",
        "doc_type": "sale_deed",
        "owner": "मनोज बाळकृष्ण भोसले",
        "gat": "112/1",
        "khata": "90",
        "area": "0.50",
        "unit": "हेक्टर",
        "village": "Example Village Kappa",
        "taluka": "Example Taluka Lambda",
        "district": "Thane",
        "mutation": "990/2023",
        "date": "19/07/2023",
    },
]


def render_synthetic_image(sample: dict, output_path: str) -> None:
    """Renders a simulated scanned document image using PIL."""
    width, height = 1400, 1000
    # Aged paper background color
    img = Image.new("RGB", (width, height), color=(248, 245, 237))
    draw = ImageDraw.Draw(img)

    # Draw border
    draw.rectangle([30, 30, width - 30, height - 30], outline=(100, 100, 100), width=2)
    draw.rectangle([35, 35, width - 35, height - 35], outline=(180, 180, 180), width=1)

    # Header Watermark
    watermark = "[SYNTHETIC TEST DOCUMENT - FICTIONAL DEMO ONLY - NOT A REAL RECORD]"
    draw.text((320, 45), watermark, fill=(180, 50, 50))

    # Form Header
    title = f"गाव नमुना नं. ७ (सातबारा) - {sample['doc_id']}" if sample['doc_type'] == "7_12" else f"जमीन अभिलेख फेरफार पत्रक - {sample['doc_id']}"
    draw.text((450, 90), title, fill=(20, 20, 20))

    # Top jurisdiction table
    draw.text((100, 160), f"गाव: {sample['village']}", fill=(30, 30, 30))
    draw.text((500, 160), f"तालुका: {sample['taluka']}", fill=(30, 30, 30))
    draw.text((900, 160), f"जिल्हा: {sample['district']}", fill=(30, 30, 30))

    # Horizontal divider
    draw.line([(50, 200), (width - 50, 200)], fill=(120, 120, 120), width=2)

    # Fields list
    lines = [
        f"१. जमीन धारकांचे नांव : {sample['owner']}",
        f"२. सर्व्हे / गट नं. : {sample['gat']}",
        f"३. एकूण क्षेत्रफळ : {sample['area']} {sample['unit']}",
        f"४. खाते क्रमांक : {sample['khata']}",
        f"५. शेवटचा फेरफार क्रमांक : MTR-{sample['mutation']}",
        f"६. नोंदणी दिनांक : {sample['date']}",
        f"७. भोगवटा प्रकार : Occupant Class 1 (भोगवटादार वर्ग - १)",
        f"८. जमीन वापर : शेती (कृषी जिरायत)",
    ]

    y = 240
    for line in lines:
        draw.text((100, y), line, fill=(20, 20, 20))
        y += 50

    # Draw simulated boundary coordinates box
    draw.rectangle([100, 680, 800, 850], outline=(140, 140, 140), width=1)
    draw.text((120, 695), "चतुःसीमा (Plot Boundaries):", fill=(40, 40, 40))
    draw.text((120, 730), "उत्तर (North): रस्ता (Public Road)", fill=(50, 50, 50))
    draw.text((120, 760), "दक्षिण (South): गट क्र. 144", fill=(50, 50, 50))
    draw.text((120, 790), "पूर्व (East): गट क्र. 146", fill=(50, 50, 50))
    draw.text((120, 820), "पश्चिम (West): ओढा (Stream Canal)", fill=(50, 50, 50))

    # Stamp / Signature simulation
    draw.ellipse([980, 720, 1180, 880], outline=(60, 60, 180), width=3)
    draw.text((1020, 790), "तहसीलदार कार्यालय", fill=(60, 60, 180))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, quality=90)


def create_ground_truth_annotation(sample: dict) -> dict:
    """Creates exact character-offset entity annotation JSON."""
    text_content = (
        f"महाराष्ट्र शासन जमीन अभिलेख सातबारा\n"
        f"गाव: {sample['village']} तालुका: {sample['taluka']} जिल्हा: {sample['district']}\n"
        f"१. जमीन धारकांचे नांव : {sample['owner']}\n"
        f"२. सर्व्हे / गट नं. : {sample['gat']}\n"
        f"३. एकूण क्षेत्रफळ : {sample['area']} {sample['unit']}\n"
        f"४. खाते क्रमांक : {sample['khata']}\n"
        f"५. शेवटचा फेरफार क्रमांक : MTR-{sample['mutation']}\n"
        f"६. नोंदणी दिनांक : {sample['date']}\n"
        f"७. भोगवटा प्रकार : Occupant Class 1\n"
    )

    entities = []

    def add_ent(sub: str, label: str):
        if not sub:
            return
        idx = text_content.find(sub)
        if idx != -1:
            entities.append({
                "start": idx,
                "end": idx + len(sub),
                "label": label,
                "value": sub,
            })

    add_ent(sample["owner"], "OWNER_NAME")
    add_ent(sample["gat"], "GAT_NUMBER")
    add_ent(sample["village"], "VILLAGE")
    add_ent(sample["taluka"], "TALUKA")
    add_ent(sample["district"], "DISTRICT")
    add_ent(sample["area"], "LAND_AREA")
    add_ent(sample["unit"], "LAND_AREA_UNIT")
    add_ent(sample["khata"], "KHATA_NUMBER")
    add_ent(f"MTR-{sample['mutation']}", "MUTATION_NUMBER")
    add_ent(sample["date"], "DOCUMENT_DATE")

    # Sort entities by start index
    entities.sort(key=lambda e: e["start"])

    return {
        "document_id": sample["doc_id"],
        "document_type": sample["doc_type"],
        "is_synthetic": True,
        "text": text_content,
        "entities": entities,
    }


def main():
    parser = argparse.ArgumentParser(description="Generate Synthetic Test Dataset")
    parser.add_argument("--count", "-c", type=int, default=6, help="Number of synthetic documents to generate (max 6)")
    args = parser.parse_args()

    count = min(args.count, len(FICTIONAL_SAMPLES))
    samples = FICTIONAL_SAMPLES[:count]

    print(f"[Synthetic Generator] Generating {count} clearly labeled test documents...")

    meta_file = os.path.join("data", "metadata.csv")
    os.makedirs(os.path.dirname(meta_file), exist_ok=True)
    header = [
        "document_id", "document_type", "language", "year", "district",
        "taluka", "village", "source", "permission", "anonymized",
        "image_quality", "notes"
    ]
    meta_exists = os.path.exists(meta_file) and os.path.getsize(meta_file) > 0

    with open(meta_file, "a", newline="", encoding="utf-8") as mf:
        writer = csv.writer(mf)
        if not meta_exists:
            writer.writerow(header)

        for s in samples:
            raw_path = os.path.join("data", "raw", s["doc_type"], f"{s['doc_id']}.jpg")
            render_synthetic_image(s, raw_path)

            ann_data = create_ground_truth_annotation(s)
            ann_path = os.path.join("data", "annotations", f"{s['doc_id']}.json")
            os.makedirs(os.path.dirname(ann_path), exist_ok=True)
            with open(ann_path, "w", encoding="utf-8") as af:
                json.dump(ann_data, af, indent=2, ensure_ascii=False)

            # Metadata entry
            writer.writerow([
                s["doc_id"],
                s["doc_type"],
                "Marathi",
                s["date"].split('/')[-1] if '/' in s["date"] else "2020",
                s["district"],
                s["taluka"],
                s["village"],
                "synthetic_demo",
                True,
                True,
                "good",
                "Fictional test record for pipeline verification only",
            ])

    print(f"[Synthetic Generator] Created {count} test scans in data/raw/ and annotations in data/annotations/")
    print(f"Recorded in data/metadata.csv.")
    print(f"\nNext steps to verify pipeline:")
    print(f"  1. python scripts/validate_dataset.py")
    print(f"  2. python scripts/create_dataset.py")
    print(f"  3. python scripts/split_dataset.py")


if __name__ == "__main__":
    main()
