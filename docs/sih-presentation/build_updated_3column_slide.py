import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_updated_3column_deck(output_path="ILRDVS_Updated_Tech_Approach_Slide.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette matching the user's SIH slide
    C_BG = RGBColor(255, 255, 255)
    C_CONTAINER_BG = RGBColor(248, 250, 252) # Very light slate #F8FAFC
    C_CONTAINER_BORDER = RGBColor(51, 65, 85) # Slate 700 border
    C_CARD_BG = RGBColor(255, 255, 255)
    C_CARD_BORDER = RGBColor(203, 213, 225)  # Slate 300
    C_TITLE_DARK = RGBColor(15, 23, 42)      # Slate 900
    C_TEXT_DARK = RGBColor(30, 41, 59)       # Slate 800
    C_TEXT_MUTED = RGBColor(71, 85, 105)     # Slate 600
    C_PRIMARY_BLUE = RGBColor(30, 58, 138)   # Blue 900
    C_ARROW_COLOR = RGBColor(51, 65, 85)
    C_WHITE = RGBColor(255, 255, 255)

    slide = prs.slides.add_slide(blank_layout)

    # 1. Slide Title Header (Clean SIH Style)
    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.25), Inches(12.133), Inches(0.65))
    tf_top = title_box.text_frame
    tf_top.vertical_anchor = MSO_ANCHOR.TOP
    p_t = tf_top.paragraphs[0]
    p_t.text = "TECHNICAL APPROACH"
    p_t.font.name = "Trebuchet MS"
    p_t.font.size = Pt(22)
    p_t.font.bold = True
    p_t.font.color.rgb = C_TITLE_DARK

    p_sub = tf_top.add_paragraph()
    p_sub.text = "ILRDVS • Intelligent Land Record Digitization, Cadastral Validation & Dual-Factor Verification Architecture"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = C_TEXT_MUTED

    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 1: SYSTEM ARCHITECTURE (Left Container, w = 3.65 in)
    # ─────────────────────────────────────────────────────────────────────────
    col1_x = 0.6
    col_w = 3.85
    col_h = 6.25
    y_start = 0.98

    # Outer Container 1
    c1_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col1_x), Inches(y_start), Inches(col_w), Inches(col_h))
    c1_box.fill.solid()
    c1_box.fill.fore_color.rgb = C_CONTAINER_BG
    c1_box.line.color.rgb = C_CONTAINER_BORDER
    c1_box.line.width = Pt(1.2)

    # Column 1 Header Title
    c1_header = slide.shapes.add_textbox(Inches(col1_x + 0.1), Inches(y_start + 0.08), Inches(col_w - 0.2), Inches(0.35))
    c1_htf = c1_header.text_frame
    c1_hp = c1_htf.paragraphs[0]
    c1_hp.alignment = PP_ALIGN.CENTER
    c1_hp.text = "SYSTEM ARCHITECTURE"
    c1_hp.font.name = "Trebuchet MS"
    c1_hp.font.bold = True
    c1_hp.font.size = Pt(12.5)
    c1_hp.font.color.rgb = C_TITLE_DARK

    # 4 Stacked Tier Cards inside Column 1
    tiers_c1 = [
        ("TIER 1: PRESENTATION & CLIENT LAYER", [
            "• Next.js 14 App Router (Citizen & Officer Portals)",
            "• Inspector Dual-Pane Workstation (Confidence Gauges)",
            "• Role-Based Portals (Admin, Officer, Verifier, Citizen)",
            "• Public QR Verification Portal & GIGW Screen-Reader"
        ]),
        ("TIER 2: API GATEWAY & SECURITY LAYER", [
            "• Node.js + Express TypeScript API (High-Throughput)",
            "• TRAI DLT MSG91 SMS + Zero-Plaintext HMAC Email OTP",
            "• Strict RBAC & JWT in HTTP-Only Cookies (BCrypt)",
            "• Zod Schema Validation & Multer Vault (SHA-256 Hashes)"
        ]),
        ("TIER 3: AI & COMPUTER VISION MICROSERVICE", [
            "• OpenCV Adaptive Vision (CLAHE 3.5, Deskew, Rotate)",
            "• Multilingual OCR (EasyOCR + Tesseract: Marathi & En)",
            "• Cadastral NER Pipeline (Owner, Gat#, Area, Khata, Village)",
            "• Self-Diagnosis Loop & Adaptive Multi-Pass Consensus"
        ]),
        ("TIER 4: CADASTRAL DATA & COMPLIANCE STORE", [
            "• MongoDB 8 Persistence (Compound-Indexed on ULPIN)",
            "• Unified 8-Layer Land Stack (DILRMP 3.0 Guidelines)",
            "• Cadastral Sanity Engine (Unit: Guntha/Are ➔ Hectare)",
            "• Dual-Factor Physical QR Sticker (Secret PIN) & AuditLog"
        ])
    ]

    tier_y = y_start + 0.45
    tier_h = 1.34
    tier_gap = 0.09
    for idx, (t_title, bullets) in enumerate(tiers_c1):
        cy = tier_y + idx * (tier_h + tier_gap)
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col1_x + 0.14), Inches(cy), Inches(col_w - 0.28), Inches(tier_h))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_CONTAINER_BORDER
        card.line.width = Pt(0.9)

        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.06)
        ctf.margin_left = Inches(0.12)
        ctf.margin_right = Inches(0.1)
        ctf.margin_bottom = Inches(0.04)

        tp = ctf.paragraphs[0]
        tp.text = t_title
        tp.font.name = "Trebuchet MS"
        tp.font.bold = True
        tp.font.size = Pt(8.5)
        tp.font.color.rgb = C_TITLE_DARK
        tp.space_after = Pt(2)

        for b in bullets:
            bp = ctf.add_paragraph()
            bp.text = b
            bp.font.name = "Arial"
            bp.font.size = Pt(7.0)
            bp.font.color.rgb = C_TEXT_DARK
            bp.space_after = Pt(1)

    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 2: PROCESS FLOWCHART (Center Container, w = 4.1 in)
    # ─────────────────────────────────────────────────────────────────────────
    col2_x = 4.7
    col2_w = 4.05

    # Outer Container 2
    c2_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col2_x), Inches(y_start), Inches(col2_w), Inches(col_h))
    c2_box.fill.solid()
    c2_box.fill.fore_color.rgb = C_CONTAINER_BG
    c2_box.line.color.rgb = C_CONTAINER_BORDER
    c2_box.line.width = Pt(1.2)

    # Column 2 Header Title
    c2_header = slide.shapes.add_textbox(Inches(col2_x + 0.1), Inches(y_start + 0.08), Inches(col2_w - 0.2), Inches(0.35))
    c2_htf = c2_header.text_frame
    c2_hp = c2_htf.paragraphs[0]
    c2_hp.alignment = PP_ALIGN.CENTER
    c2_hp.text = "PROCESS FLOWCHART"
    c2_hp.font.name = "Trebuchet MS"
    c2_hp.font.bold = True
    c2_hp.font.size = Pt(12.5)
    c2_hp.font.color.rgb = C_TITLE_DARK

    # 8 Flow Steps with Number, Title, and Subtitle
    steps_data = [
        ("1", "Document Upload & Intake", "Citizen/Officer uploads 7/12, 8A, Ferfar; SHA-256 hash computed"),
        ("2", "Adaptive OpenCV Vision", "Hough deskew (±15°), CLAHE 3.5 contrast boost for faded blue ink"),
        ("3", "Classification & Layout Parsing", "Rule-based identification: 7/12 Satbara, Form 8A, Ferfar, Sale Deed"),
        ("4", "Multilingual OCR Engine", "EasyOCR + Tesseract extracts Marathi Devanagari & English tokens"),
        ("5", "Cadastral Entity NER", "Extracts Owner Name, Survey/Gat #, Area, Khata; flags missing fields"),
        ("6", "8-Layer Stack & Sanity Check", "Unit conversion (Guntha->Ha), Mahabhulekh RoR, CERSAI & Court stays"),
        ("7", "Statutory HITL Verification", "Split-screen review: Verifier DSC-VER sign, Officer DSC-OFF approval"),
        ("8", "Output Delivery & QR Seal", "Certified record + 80mm physical sticker QR with Secret PIN")
    ]

    step_y = y_start + 0.44
    step_h = 0.58
    step_gap = 0.145

    for s_idx, (num_str, s_title, s_sub) in enumerate(steps_data):
        sy = step_y + s_idx * (step_h + step_gap)

        # Step Box
        s_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col2_x + 0.14), Inches(sy), Inches(col2_w - 0.28), Inches(step_h))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = C_CARD_BG
        s_box.line.color.rgb = C_CARD_BORDER
        s_box.line.width = Pt(0.8)

        stf = s_box.text_frame
        stf.word_wrap = True
        stf.margin_top = Inches(0.04)
        stf.margin_left = Inches(0.08)
        stf.margin_right = Inches(0.08)
        stf.margin_bottom = Inches(0.02)

        p1 = stf.paragraphs[0]
        run_num = p1.add_run()
        run_num.text = f"[{num_str}] "
        run_num.font.bold = True
        run_num.font.size = Pt(8.0)
        run_num.font.color.rgb = C_PRIMARY_BLUE

        run_title = p1.add_run()
        run_title.text = s_title
        run_title.font.bold = True
        run_title.font.size = Pt(8.0)
        run_title.font.color.rgb = C_TITLE_DARK

        p2 = stf.add_paragraph()
        p2.text = s_sub
        p2.font.name = "Arial"
        p2.font.size = Pt(6.8)
        p2.font.color.rgb = C_TEXT_MUTED

        # Down Arrow between steps
        if s_idx < len(steps_data) - 1:
            arr_y = sy + step_h + 0.015
            arr = slide.shapes.add_shape(
                MSO_SHAPE.DOWN_ARROW,
                Inches(col2_x + col2_w/2.0 - 0.1), Inches(arr_y),
                Inches(0.2), Inches(0.11)
            )
            arr.fill.solid()
            arr.fill.fore_color.rgb = C_ARROW_COLOR
            arr.line.fill.background()

    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 3: TECH STACK USED (Right Container, w = 3.65 in)
    # ─────────────────────────────────────────────────────────────────────────
    col3_x = 8.98
    col3_w = 3.75

    # Outer Container 3
    c3_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col3_x), Inches(y_start), Inches(col3_w), Inches(col_h))
    c3_box.fill.solid()
    c3_box.fill.fore_color.rgb = C_CONTAINER_BG
    c3_box.line.color.rgb = C_CONTAINER_BORDER
    c3_box.line.width = Pt(1.2)

    # Column 3 Header Title
    c3_header = slide.shapes.add_textbox(Inches(col3_x + 0.1), Inches(y_start + 0.08), Inches(col3_w - 0.2), Inches(0.35))
    c3_htf = c3_header.text_frame
    c3_hp = c3_htf.paragraphs[0]
    c3_hp.alignment = PP_ALIGN.CENTER
    c3_hp.text = "TECH STACK USED"
    c3_hp.font.name = "Trebuchet MS"
    c3_hp.font.bold = True
    c3_hp.font.size = Pt(12.5)
    c3_hp.font.color.rgb = C_TITLE_DARK

    # 4 Tech Stack Categories inside Column 3
    stack_c3 = [
        ("1. Frontend Client", [
            "• Next.js 14 (App Router, Server Components)",
            "• React 18 + TypeScript (Strict Mode)",
            "• Tailwind CSS (Government Enterprise Palette)",
            "• TanStack Query v5 (Client Server-State Cache)",
            "• Recharts Analytics & Lucide Icons",
            "• GIGW / WCAG 2.1 Accessible Screen Reader"
        ]),
        ("2. Backend & Security Gateway", [
            "• Node.js + Express.js TS (High-Throughput)",
            "• TRAI DLT MSG91 SMS (DLT-Approved Template)",
            "• Zero-Plaintext HMAC-SHA256 Email OTP",
            "• JWT in HTTP-Only Cookies (BCrypt Salted)",
            "• Zod Request Validation (Body, Query, Params)",
            "• Multer Upload Engine & Morgan Logger"
        ]),
        ("3. AI, Vision & OCR Pipeline", [
            "• Python FastAPI Asynchronous Microservice",
            "• OpenCV (CLAHE 3.5, Hough Deskew, Denoise)",
            "• EasyOCR + Tesseract Multilingual (Marathi/Eng)",
            "• Cadastral Entity NER Pipeline (BIO-Tagging)",
            "• Self-Diagnosis & Confidence Consensus Merger",
            "• Continuous Feedback Service (Active Learning)"
        ]),
        ("4. Cadastral DB & Compliance", [
            "• MongoDB 8 + Mongoose (Compound ULPIN Index)",
            "• Unified 8-Layer Land Stack (DILRMP 3.0 Standard)",
            "• Maharashtra LRC Unit Converter (Guntha/Are/Ha)",
            "• Dual Digital Signatures (DSC-VER & DSC-OFF)",
            "• Dual-Factor Physical QR Protocol (Secret PIN)",
            "• Immutable RTI-Compliant AuditLog Vault"
        ])
    ]

    stack_y = y_start + 0.45
    stack_h = 1.34
    stack_gap = 0.09
    for idx, (s_title, s_bullets) in enumerate(stack_c3):
        sy = stack_y + idx * (stack_h + stack_gap)
        scard = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col3_x + 0.14), Inches(sy), Inches(col3_w - 0.28), Inches(stack_h))
        scard.fill.solid()
        scard.fill.fore_color.rgb = C_CARD_BG
        scard.line.color.rgb = C_CONTAINER_BORDER
        scard.line.width = Pt(0.9)

        stf = scard.text_frame
        stf.word_wrap = True
        stf.margin_top = Inches(0.06)
        stf.margin_left = Inches(0.12)
        stf.margin_right = Inches(0.1)
        stf.margin_bottom = Inches(0.04)

        sp = stf.paragraphs[0]
        sp.text = s_title
        sp.font.name = "Trebuchet MS"
        sp.font.bold = True
        sp.font.size = Pt(8.5)
        sp.font.color.rgb = C_TITLE_DARK
        sp.space_after = Pt(2)

        for sb in s_bullets:
            sbp = stf.add_paragraph()
            sbp.text = sb
            sbp.font.name = "Arial"
            sbp.font.size = Pt(6.8)
            sbp.font.color.rgb = C_TEXT_DARK
            sbp.space_after = Pt(1)

    # Save
    prs.save(output_path)
    print(f"Updated 3-Column Technical Approach presentation created: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_updated_3column_deck()
