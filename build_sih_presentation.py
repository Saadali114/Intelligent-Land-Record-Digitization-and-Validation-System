import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="ILRDVS_SIH_2026_Idea_Submission.pptx"):
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Theme Colors
    C_NAVY_DARK = RGBColor(15, 23, 42)      # #0F172A
    C_NAVY_BLUE = RGBColor(30, 58, 138)     # #1E3A8A
    C_AMBER = RGBColor(217, 119, 6)         # #D97706 (Saffron/Gold)
    C_EMERALD = RGBColor(4, 120, 87)        # #047857
    C_SKY = RGBColor(2, 132, 199)           # #0284C7
    C_SLATE_GRAY = RGBColor(71, 85, 105)    # #475569
    C_DARK_TEXT = RGBColor(30, 41, 59)      # #1E293B
    C_WHITE = RGBColor(255, 255, 255)
    C_CARD_BG = RGBColor(248, 250, 252)     # #F8FAFC
    C_CARD_BORDER = RGBColor(203, 213, 225) # #CBD5E1
    C_BLUE_BG = RGBColor(239, 246, 255)     # #EFF6FF
    C_BLUE_BORDER = RGBColor(147, 197, 253) # #93C5FD
    C_GREEN_BG = RGBColor(240, 253, 244)    # #F0FDF4
    C_GREEN_BORDER = RGBColor(134, 239, 172) # #86EFAC

    def add_top_bar(slide, title_text, category_badge="SMART INDIA HACKATHON 2026"):
        # Top banner background
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.9))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = C_NAVY_DARK
        top_bar.line.color.rgb = C_NAVY_DARK

        # SIH Badge / text left
        tf = top_bar.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"  {title_text.upper()}"
        p.font.name = "Trebuchet MS"
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        # Sub-badge right
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.8), Inches(0.18), Inches(3.2), Inches(0.52))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_AMBER
        badge.line.fill.background()
        btf = badge.text_frame
        btf.vertical_anchor = MSO_ANCHOR.MIDDLE
        bp = btf.paragraphs[0]
        bp.text = category_badge
        bp.alignment = PP_ALIGN.CENTER
        bp.font.name = "Arial"
        bp.font.size = Pt(11)
        bp.font.bold = True
        bp.font.color.rgb = C_WHITE

        # Bottom thin accent stripe
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0.9), Inches(13.333), Inches(0.06))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = C_AMBER
        stripe.line.fill.background()

    def add_footer(slide, current_page=1, total_pages=7):
        # Footer line
        f_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(7.05), Inches(12.133), Inches(0.02))
        f_line.fill.solid()
        f_line.fill.fore_color.rgb = C_CARD_BORDER
        f_line.line.fill.background()

        # Footer text left
        txBox = slide.shapes.add_textbox(Inches(0.6), Inches(7.08), Inches(8.0), Inches(0.35))
        tf = txBox.text_frame
        p = tf.paragraphs[0]
        p.text = "ILRDVS • AI-Powered Intelligent Land Record Digitization & Validation System • DILRMP 3.0"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = C_SLATE_GRAY

        # Footer text right
        txBox_r = slide.shapes.add_textbox(Inches(9.5), Inches(7.08), Inches(3.233), Inches(0.35))
        tf_r = txBox_r.text_frame
        p_r = tf_r.paragraphs[0]
        p_r.alignment = PP_ALIGN.RIGHT
        p_r.text = f"Slide {current_page} of {total_pages} | SIH Idea Submission"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(9)
        p_r.font.bold = True
        p_r.font.color.rgb = C_NAVY_BLUE

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 1: TITLE PAGE
    # ═════════════════════════════════════════════════════════════════════
    s1 = prs.slides.add_slide(blank_slide_layout)
    # Background full
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_CARD_BG
    bg1.line.fill.background()

    # Top Brand Header Box
    h_box = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.2))
    h_box.fill.solid()
    h_box.fill.fore_color.rgb = C_NAVY_DARK
    h_box.line.fill.background()
    htf = h_box.text_frame
    htf.vertical_anchor = MSO_ANCHOR.MIDDLE
    hp1 = htf.paragraphs[0]
    hp1.text = "   SMART INDIA HACKATHON 2026"
    hp1.font.name = "Trebuchet MS"
    hp1.font.size = Pt(28)
    hp1.font.bold = True
    hp1.font.color.rgb = C_WHITE
    hp2 = htf.add_paragraph()
    hp2.text = "     National Innovation & Digital Governance Initiative • Idea Submission"
    hp2.font.name = "Arial"
    hp2.font.size = Pt(12)
    hp2.font.color.rgb = RGBColor(226, 232, 240)

    # Accent divider
    div1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.2), Inches(13.333), Inches(0.08))
    div1.fill.solid()
    div1.fill.fore_color.rgb = C_AMBER
    div1.line.fill.background()

    # Left Container: Metadata Card
    card_meta = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(6.8), Inches(5.1))
    card_meta.fill.solid()
    card_meta.fill.fore_color.rgb = C_WHITE
    card_meta.line.color.rgb = C_CARD_BORDER
    card_meta.line.width = Pt(1)

    mtf = card_meta.text_frame
    mtf.word_wrap = True
    mtf.margin_left = Inches(0.35)
    mtf.margin_right = Inches(0.35)
    mtf.margin_top = Inches(0.35)

    def add_meta_row(tf, label, value, is_first=False):
        p = tf.paragraphs[0] if is_first else tf.add_paragraph()
        p.space_after = Pt(8)
        run_l = p.add_run()
        run_l.text = f"• {label}: "
        run_l.font.bold = True
        run_l.font.name = "Trebuchet MS"
        run_l.font.size = Pt(13)
        run_l.font.color.rgb = C_NAVY_DARK

        run_v = p.add_run()
        run_v.text = value
        run_v.font.bold = False
        run_v.font.name = "Arial"
        run_v.font.size = Pt(13)
        run_v.font.color.rgb = C_DARK_TEXT

    add_meta_row(mtf, "Problem Statement ID", "SIH26-GOV-LAND-042", is_first=True)
    add_meta_row(mtf, "Problem Statement Title", "AI-Driven Digitization, Cadastral Extraction & Multi-Layer Validation of Historical Land Records")
    add_meta_row(mtf, "Theme", "Smart Governance / Digital Public Infrastructure (DPI)")
    add_meta_row(mtf, "PS Category", "Software / Enterprise Digital Governance")
    add_meta_row(mtf, "Team ID", "TEAM-ILRDVS-2026")
    add_meta_row(mtf, "Team Name", "GeoTrust Innovators (ILRDVS)")

    # Right Container: Project Brand Showcase
    card_proj = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.9), Inches(1.6), Inches(4.7), Inches(5.1))
    card_proj.fill.solid()
    card_proj.fill.fore_color.rgb = C_NAVY_DARK
    card_proj.line.color.rgb = C_NAVY_BLUE
    card_proj.line.width = Pt(1.5)

    ptf = card_proj.text_frame
    ptf.word_wrap = True
    ptf.margin_left = Inches(0.35)
    ptf.margin_right = Inches(0.35)
    ptf.margin_top = Inches(0.4)

    pp0 = ptf.paragraphs[0]
    pp0.alignment = PP_ALIGN.CENTER
    pp0.text = "PROJECT ILRDVS"
    pp0.font.name = "Trebuchet MS"
    pp0.font.bold = True
    pp0.font.size = Pt(26)
    pp0.font.color.rgb = C_AMBER

    pp1 = ptf.add_paragraph()
    pp1.alignment = PP_ALIGN.CENTER
    pp1.text = "Intelligent Land Record Digitization & Validation System"
    pp1.font.name = "Arial"
    pp1.font.size = Pt(12)
    pp1.font.bold = True
    pp1.font.color.rgb = C_WHITE
    pp1.space_after = Pt(18)

    p_badge = ptf.add_paragraph()
    p_badge.alignment = PP_ALIGN.CENTER
    p_badge.text = "🏛️ DILRMP 3.0 Standard • 14-Digit Bhu-Aadhaar (ULPIN)"
    p_badge.font.name = "Arial"
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = RGBColor(52, 211, 153)
    p_badge.space_after = Pt(16)

    bullets = [
        "Multi-Pass Self-Correcting OCR (CLAHE + Rotation)",
        "Specialized Cadastral Named Entity Recognition (NER)",
        "Dual-Factor Physical Sticker PIN & 2D QR Verification",
        "Statutory Dual-Signature HITL Workstation (DSC-OFF)",
        "Unified 8-Layer Land Stack (GIS + RoR + Courts + Banks)"
    ]
    for b in bullets:
        bp = ptf.add_paragraph()
        bp.space_after = Pt(6)
        bp.text = f"✓  {b}"
        bp.font.name = "Arial"
        bp.font.size = Pt(10.5)
        bp.font.color.rgb = RGBColor(241, 245, 249)

    add_footer(s1, 1, 7)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 2: PROBLEM STATEMENT & PROPOSED SOLUTION
    # ═════════════════════════════════════════════════════════════════════
    s2 = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s2, "Problem Statement & Proposed Solution", "INNOVATION & VALUE")

    # Column 1: The Problem (Left)
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.2), Inches(3.8), Inches(5.6))
    c1.fill.solid()
    c1.fill.fore_color.rgb = C_WHITE
    c1.line.color.rgb = RGBColor(254, 202, 202)
    c1.line.width = Pt(1.5)
    c1_tf = c1.text_frame
    c1_tf.word_wrap = True
    c1_tf.margin_left = Inches(0.25)
    c1_tf.margin_right = Inches(0.25)
    c1_tf.margin_top = Inches(0.25)

    p = c1_tf.paragraphs[0]
    p.text = "⚠️ THE LAND-RECORD CRISIS"
    p.font.name = "Trebuchet MS"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = RGBColor(185, 28, 28)
    p.space_after = Pt(12)

    prob_items = [
        ("Archival Degradation", "Millions of 50+ year-old paper records (7/12 Satbara, Ferfar, Sale Deeds) suffer from faded Devanagari script, bleeding blue ink, and physical decay."),
        ("Institutional Silos", "Revenue offices, Sub-Registrars (SRO), Land Surveyors, Banks, and Courts operate independently—creating duplicate title claims and lending fraud."),
        ("Physical-Digital Verification Gap", "Digital portals cannot stop fraudsters from presenting forged paper photocopies to local tehsils and banks."),
        ("Manual Backlogs & Bribery", "Citizens face delays of 30-90 days for basic mutation (Ferfar) and ownership title clearances.")
    ]
    for title, desc in prob_items:
        pt = c1_tf.add_paragraph()
        pt.text = f"• {title}"
        pt.font.name = "Trebuchet MS"
        pt.font.bold = True
        pt.font.size = Pt(11)
        pt.font.color.rgb = C_NAVY_DARK
        pd = c1_tf.add_paragraph()
        pd.text = desc
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_SLATE_GRAY
        pd.space_after = Pt(8)

    # Column 2: Our Solution (Center)
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.6), Inches(1.2), Inches(4.3), Inches(5.6))
    c2.fill.solid()
    c2.fill.fore_color.rgb = C_BLUE_BG
    c2.line.color.rgb = C_BLUE_BORDER
    c2.line.width = Pt(1.5)
    c2_tf = c2.text_frame
    c2_tf.word_wrap = True
    c2_tf.margin_left = Inches(0.25)
    c2_tf.margin_right = Inches(0.25)
    c2_tf.margin_top = Inches(0.25)

    p = c2_tf.paragraphs[0]
    p.text = "💡 OUR UNIFIED SOLUTION"
    p.font.name = "Trebuchet MS"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_NAVY_BLUE
    p.space_after = Pt(10)

    sol_steps = [
        ("1. Multi-Pass Adaptive OCR", "OpenCV CLAHE contrast boosting + EasyOCR recovers faint stamps and folded paper."),
        ("2. Cadastral Entity NER", "Custom multilingual NER extracts Owner Name, Survey/Gat #, Area (Ha/Acre), Village, and Khata."),
        ("3. Human-in-the-Loop Workstation", "Dual-pane review with confidence gauges and Verifier/Officer digital signatures (DSC-OFF)."),
        ("4. The 8-Layer Land Stack", "Unifies GIS vector parcels, RoR ownership, bank mortgages (CERSAI), and court dispute stays under 14-digit ULPIN."),
        ("5. Dual-Factor QR Authentication", "Physical adhesive sticker PIN (SEC-XXXX-YYYY) cryptographically linked to cloud scan SHA-256 hash.")
    ]
    for step, desc in sol_steps:
        st = c2_tf.add_paragraph()
        st.text = f"▶ {step}"
        st.font.name = "Trebuchet MS"
        st.font.bold = True
        st.font.size = Pt(11)
        st.font.color.rgb = C_NAVY_DARK
        sd = c2_tf.add_paragraph()
        sd.text = desc
        sd.font.name = "Arial"
        sd.font.size = Pt(9.5)
        sd.font.color.rgb = C_DARK_TEXT
        sd.space_after = Pt(6)

    # Column 3: Why Different / Novelty (Right)
    c3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.2), Inches(3.6), Inches(5.6))
    c3.fill.solid()
    c3.fill.fore_color.rgb = C_GREEN_BG
    c3.line.color.rgb = C_GREEN_BORDER
    c3.line.width = Pt(1.5)
    c3_tf = c3.text_frame
    c3_tf.word_wrap = True
    c3_tf.margin_left = Inches(0.25)
    c3_tf.margin_right = Inches(0.25)
    c3_tf.margin_top = Inches(0.25)

    p = c3_tf.paragraphs[0]
    p.text = "⭐ KEY NOVELTY & EDGE"
    p.font.name = "Trebuchet MS"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(10)

    novelties = [
        ("DILRMP 3.0 Operational Alignment", "First system mapping 8 distinct governmental layers to the 14-digit Bhu-Aadhaar (ULPIN)."),
        ("Active Self-Correcting Feedback", "Continuous learning loop: corrections made in workstation dynamically train synonym dictionaries in real-time."),
        ("Tamper-Proof Physical Seal", "Solves the 'offline fake paper' loophole via physical secret security PINs."),
        ("Real DLT SMS & HMAC Email OTP", "Zero-plaintext cryptographic authentication with explicit legal distinction (Phone ≠ Title)."),
        ("Vernacular & GIGW Accessible", "Full Marathi/Hindi support + WCAG 2.1 screen-reader mode for rural inclusivity.")
    ]
    for nov, desc in novelties:
        nt = c3_tf.add_paragraph()
        nt.text = f"★ {nov}"
        nt.font.name = "Trebuchet MS"
        nt.font.bold = True
        nt.font.size = Pt(10.5)
        nt.font.color.rgb = C_EMERALD
        nd = c3_tf.add_paragraph()
        nd.text = desc
        nd.font.name = "Arial"
        nd.font.size = Pt(9)
        nd.font.color.rgb = C_DARK_TEXT
        nd.space_after = Pt(6)

    add_footer(s2, 2, 7)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 3A: TECHNICAL APPROACH — 7-LAYER SYSTEM ARCHITECTURE
    # ═════════════════════════════════════════════════════════════════════
    s3a = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s3a, "Technical Approach: 7-Layer System Architecture", "GOVERNANCE ARCHITECTURE")

    # Embed Diagram 1
    d1_path = "diagram1_system_architecture.png"
    if os.path.exists(d1_path):
        s3a.shapes.add_picture(d1_path, Inches(0.5), Inches(1.08), width=Inches(12.333), height=Inches(5.82))

    add_footer(s3a, 3, 8)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 3B: PROCESS FLOWCHART — END-TO-END DOCUMENT LIFECYCLE
    # ═════════════════════════════════════════════════════════════════════
    s3b = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s3b, "Technical Approach: End-to-End Process Flowchart", "DECISION LIFECYCLE")

    # Embed Diagram 2
    d2_path = "diagram2_process_flowchart.png"
    if os.path.exists(d2_path):
        s3b.shapes.add_picture(d2_path, Inches(0.5), Inches(1.08), width=Inches(12.333), height=Inches(5.82))

    add_footer(s3b, 4, 8)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 4: FEASIBILITY, VIABILITY & RISK MITIGATION
    # ═════════════════════════════════════════════════════════════════════
    s4 = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s4, "Feasibility, Viability & Risk Mitigation", "OPERATIONAL READINESS")

    # Left Container: Feasibility & Resource Model
    f_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.2), Inches(4.5), Inches(5.6))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = C_WHITE
    f_box.line.color.rgb = C_CARD_BORDER
    f_box.line.width = Pt(1)

    ftf = f_box.text_frame
    ftf.word_wrap = True
    ftf.margin_left = Inches(0.25)
    ftf.margin_right = Inches(0.25)
    ftf.margin_top = Inches(0.2)

    p = ftf.paragraphs[0]
    p.text = "⚙️ TECHNICAL & ECONOMIC FEASIBILITY"
    p.font.name = "Trebuchet MS"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(10)

    feas_points = [
        ("Zero High-End GPU Barrier", "Preprocessing and OCR pipeline is optimized for multi-core CPUs with OpenCV and lightweight quantized OCR, ensuring straightforward deployment on existing State Data Centre (SDC) servers without massive cloud expenses."),
        ("Incremental Modular Adoption", "Designed as an API-first microservice. Can integrate into existing state portals (e.g., Mahabhulekh, Bhulekh, Jamabandi) without replacing current infrastructure."),
        ("Economic Cost Savings", "Automates 70% of manual transcription effort, saving crores of rupees in third-party data entry contracts and reducing mutation cycle time from weeks to hours."),
        ("Statutory Legal Viability", "Fully compliant with the Indian Information Technology Act (2000) and Revenue Department regulations through dual digital signatures (DSC-VER & DSC-OFF).")
    ]
    for title, desc in feas_points:
        pt = ftf.add_paragraph()
        pt.text = f"• {title}"
        pt.font.name = "Trebuchet MS"
        pt.font.bold = True
        pt.font.size = Pt(10.5)
        pt.font.color.rgb = C_NAVY_BLUE
        pd = ftf.add_paragraph()
        pd.text = desc
        pd.font.name = "Arial"
        pd.font.size = Pt(8.5)
        pd.font.color.rgb = C_DARK_TEXT
        pd.space_after = Pt(6)

    # Right Container: Risk Assessment & Mitigation Table
    r_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.3), Inches(1.2), Inches(7.4), Inches(5.6))
    r_box.fill.solid()
    r_box.fill.fore_color.rgb = C_CARD_BG
    r_box.line.color.rgb = C_CARD_BORDER
    r_box.line.width = Pt(1)

    rtf = r_box.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.25)
    rtf.margin_right = Inches(0.25)
    rtf.margin_top = Inches(0.2)

    p = rtf.paragraphs[0]
    p.text = "🛡️ RISK ASSESSMENT & ENGINEERING MITIGATION MATRIX"
    p.font.name = "Trebuchet MS"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(10)

    risks = [
        ("Severely Faded Inks & Historical Stamps",
         "Adaptive multi-pass pipeline automatically activates CLAHE 3.5 contrast boosting, unsharp masking, and morphological dilation upon detecting low character yield."),
        
        ("AI Hallucinations on Legal Titles",
         "Human-in-the-Loop Workstation: AI provides confidence scores and highlight overlays; only authorized Revenue Officers can grant statutory approval via DSC-OFF digital signature."),

        ("Paper Deed Forgery & Fake Photocopies",
         "Dual-Factor Physical-to-Digital Verification: Physical 80mm sticker QR + secret security PIN (SEC-XXXX-YYYY) cryptographically linked to cloud scan SHA-256 hash."),

        ("Citizen Identity Spoofing / Account Takeover",
         "Salted HMAC-SHA256 OTP verification with zero plaintext database storage, automatic 5-min TTL pruning, and TRAI DLT-compliant SMS templates."),

        ("Dialectal & Orthographic Variations",
         "Multilingual cadastral lexicon mapping regional terminology (Gat, Khasra, Khata, Bhogwatdar, Ferfar) with continuous feedback learning from verifier corrections.")
    ]
    for risk, mit in risks:
        p_risk = rtf.add_paragraph()
        p_risk.text = f"⚠️ Risk: {risk}"
        p_risk.font.name = "Trebuchet MS"
        p_risk.font.bold = True
        p_risk.font.size = Pt(10)
        p_risk.font.color.rgb = RGBColor(185, 28, 28)
        
        p_mit = rtf.add_paragraph()
        p_mit.text = f"✅ Mitigation: {mit}"
        p_mit.font.name = "Arial"
        p_mit.font.size = Pt(8.5)
        p_mit.font.color.rgb = C_DARK_TEXT
        p_mit.space_after = Pt(6)

    add_footer(s4, 5, 8)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 5: IMPACT AND BENEFITS
    # ═════════════════════════════════════════════
    s5 = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s5, "Impact and Measurable Governance Benefits", "NATIONAL RELEVANCE")

    # Banner Quote
    q_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.15), Inches(12.133), Inches(0.65))
    q_box.fill.solid()
    q_box.fill.fore_color.rgb = C_BLUE_BG
    q_box.line.color.rgb = C_BLUE_BORDER
    q_box.line.width = Pt(1)
    qtf = q_box.text_frame
    qtf.vertical_anchor = MSO_ANCHOR.MIDDLE
    qp = qtf.paragraphs[0]
    qp.alignment = PP_ALIGN.CENTER
    qp.text = "“Transforming Millions of Vulnerable Paper Deeds into an Indisputable, Transparent Economic Asset”"
    qp.font.name = "Trebuchet MS"
    qp.font.bold = True
    qp.font.size = Pt(13)
    qp.font.color.rgb = C_NAVY_BLUE

    # 4 Quadrant Cards
    quads = [
        ("🏛️ GOVERNANCE & LEGAL IMPACT", C_NAVY_DARK, Inches(0.6), Inches(1.95), [
            ("Land Litigation Reduction", "Addresses the root cause of land disputes which currently constitute ~66% of all civil cases in Indian courts."),
            ("Instant Court Stay Enforcement", "Layer 7 NJDG/RCCMS sync automatically flags disputed parcels, freezing illicit sales during pending litigation."),
            ("Immutable Audit Trail", "RTI-compliant audit logs track every document view, edit, zoom, remark, and approval.")
        ]),
        ("💰 ECONOMIC & LENDING VELOCITY", C_EMERALD, Inches(6.8), Inches(1.95), [
            ("Eliminates Double-Financing", "Layer 6 CERSAI/ULI integration locks parcels in real-time when mortgaged, preventing fraudulent multi-bank loans."),
            ("Instant Kisan Credit Card (KCC)", "Farmers obtain verified land title certificates in minutes instead of paying middlemen for physical extracts."),
            ("Automated Circle Rate Valuation", "Layer 5 algorithmically prevents stamp duty evasion and manual undervaluation.")
        ]),
        ("👥 CITIZEN EMPOWERMENT & EQUITY", C_AMBER, Inches(0.6), Inches(4.5), [
            ("Transparent Citizen Self-Service", "Dedicated /citizen portal allows tracking mutation applications and downloading certified extracts without red tape."),
            ("Instant Fraud SMS Alerts", "Masked Aadhaar (XXXX-XXXX-9124) linkage automatically dispatches alerts when transactions are initiated on personal land."),
            ("Eradication of Broker Exploitation", "Direct digital verification removes dependency on predatory local document writers.")
        ]),
        ("♿ ACCESSIBILITY & VERNACULAR REACH", C_SKY, Inches(6.8), Inches(4.5), [
            ("GIGW & WCAG 2.1 Compliant", "Dedicated /screen-reader mode with high-contrast UI and keyboard accessibility for visually impaired citizens."),
            ("Native Vernacular Interface", "Full localized support for Marathi (Devanagari) and Hindi ensuring rural common service centre (CSC) usability."),
            ("Offline-Ready QR Verification", "Inspectors and banks can verify paper authenticity in rural tehsils using any smartphone camera.")
        ])
    ]

    for title, color, left, top, items in quads:
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.9), Inches(2.45))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_CARD_BORDER
        card.line.width = Pt(1)

        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.15)

        tp = ctf.paragraphs[0]
        tp.text = title
        tp.font.name = "Trebuchet MS"
        tp.font.bold = True
        tp.font.size = Pt(11)
        tp.font.color.rgb = color
        tp.space_after = Pt(4)

        for heading, body in items:
            p_item = ctf.add_paragraph()
            p_item.text = f"• {heading}: "
            p_item.font.name = "Arial"
            p_item.font.bold = True
            p_item.font.size = Pt(8.5)
            p_item.font.color.rgb = C_NAVY_DARK

            run = p_item.add_run()
            run.text = body
            run.font.bold = False
            run.font.size = Pt(8)
            run.font.color.rgb = C_SLATE_GRAY
            p_item.space_after = Pt(2)

    add_footer(s5, 6, 8)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 6: WORKING PROTOTYPE & LIVE DEMO
    # ═════════════════════════════════════════════
    s6 = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s6, "Working Prototype & Live System Demonstration", "PRODUCTION READY")

    # 3 Feature Showcase Cards
    demo_cards = [
        ("1. DUAL-PANE HITL WORKSTATION", Inches(0.6), C_NAVY_BLUE, [
            "• Side-by-side archival scan viewer + extracted metadata",
            "• Field-level confidence scores & anomaly warning flags",
            "• Verifier Digital Signature (DSC-VER) forwarding queue",
            "• Revenue Officer statutory approval & rejection portal",
            "• Audit log viewer tracking every click & edit"
        ]),
        ("2. 3-TIER QR VERIFICATION ENGINE", Inches(4.7), C_EMERALD, [
            "• Public portal: /verify-document with live camera scan",
            "• Tier 1 (Digital Only): Cloud archive validation",
            "• Tier 2 (Dual-Factor Match): Validates physical sticker PIN",
            "• Tier 3 (Counterfeit Alert): Detects altered paper deeds",
            "• Instant PDF export of certified cadastral extracts"
        ]),
        ("3. 8-LAYER LAND STACK VIEWER", Inches(8.8), C_AMBER, [
            "• Interactive cadastral parcel visualizer with ULPIN",
            "• Real-time RoR (7/12 & 8A) ownership registry lookup",
            "• Bank mortgage status check (CERSAI & ULI sync)",
            "• Automated Circle Rate Ready Reckoner tax calculator",
            "• Revenue court active injunction / stay order monitor"
        ])
    ]

    for title, left, color, bullet_list in demo_cards:
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.2), Inches(3.9), Inches(4.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_CARD_BORDER
        card.line.width = Pt(1)

        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.2)

        tp = ctf.paragraphs[0]
        tp.text = title
        tp.font.name = "Trebuchet MS"
        tp.font.bold = True
        tp.font.size = Pt(11)
        tp.font.color.rgb = color
        tp.space_after = Pt(10)

        for b in bullet_list:
            bp = ctf.add_paragraph()
            bp.text = b
            bp.font.name = "Arial"
            bp.font.size = Pt(9)
            bp.font.color.rgb = C_DARK_TEXT
            bp.space_after = Pt(6)

    # Bottom Live Credentials & Access Bar
    cred_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(5.55), Inches(12.133), Inches(1.3))
    cred_box.fill.solid()
    cred_box.fill.fore_color.rgb = C_NAVY_DARK
    cred_box.line.fill.background()

    crtf = cred_box.text_frame
    crtf.word_wrap = True
    crtf.margin_left = Inches(0.3)
    crtf.margin_right = Inches(0.3)
    crtf.margin_top = Inches(0.15)

    cp0 = crtf.paragraphs[0]
    cp0.text = "🚀 LIVE DEPLOYMENT & JURY EVALUATION ACCESS"
    cp0.font.name = "Trebuchet MS"
    cp0.font.bold = True
    cp0.font.size = Pt(12)
    cp0.font.color.rgb = C_AMBER
    cp0.space_after = Pt(4)

    cp1 = crtf.add_paragraph()
    cp1.text = "• Web Application: http://localhost:3000 (Next.js 14)  |  Backend API: http://localhost:5000 (Node.js/Express)  |  AI Service: http://localhost:8000"
    cp1.font.name = "Arial"
    cp1.font.size = Pt(9)
    cp1.font.color.rgb = C_WHITE

    cp2 = crtf.add_paragraph()
    cp2.text = "• Pre-Seeded One-Click Roles (Password: Password123!): Admin (admin@landrecord.gov.in) | Officer (officer1@landrecord.gov.in) | Verifier (verifier1@landrecord.gov.in)"
    cp2.font.name = "Arial"
    cp2.font.size = Pt(9)
    cp2.font.color.rgb = RGBColor(147, 197, 253)

    add_footer(s6, 7, 8)

    # ═════════════════════════════════════════════════════════════════════
    # SLIDE 7: RESEARCH, REFERENCES & POLICY ALIGNMENT
    # ═════════════════════════════════════════════
    s7 = prs.slides.add_slide(blank_slide_layout)
    add_top_bar(s7, "Research, References & Policy Alignment", "AUTHORITATIVE BACKING")

    # 4 Quadrant Reference Cards
    ref_quads = [
        ("GOVERNMENT POLICY & STANDARDS", C_NAVY_DARK, Inches(0.6), Inches(1.2), [
            ("DILRMP 3.0 Operational Guidelines (2026–2031)", "Department of Land Resources (DoLR), Ministry of Rural Development, Government of India."),
            ("Bhu-Aadhaar (ULPIN) Technical Standard", "Survey of India standard for 14-digit deterministic cadastral parcel identification."),
            ("TRAI DLT Commercial SMS Regulations", "DLT Principal Entity registration & approved header framework for public notifications.")
        ]),
        ("ACADEMIC PAPERS & ALGORITHMS", C_NAVY_BLUE, Inches(6.8), Inches(1.2), [
            ("Adaptive Contrast for Low-Quality Manuscripts", "Contrast Limited Adaptive Histogram Equalization (CLAHE) applied to historical document OCR."),
            ("Named Entity Recognition in Vernacular Scripts", "Hybrid regex and transformer models for multilingual cadastral extraction in Devanagari."),
            ("Active Continuous Learning in Document Processing", "Human-in-the-loop correction feedback loop for real-time synonym and entity adaptation.")
        ]),
        ("CADASTRAL DATASETS & TAXONOMY", C_EMERALD, Inches(0.6), Inches(4.1), [
            ("Maharashtra Mahabhulekh Schema", "Standardized Form 7/12 (Satbara), Form 8A (Holding ledger), and Form 6 (Ferfar mutation register)."),
            ("National Land Records Modernization Corpus", "Archival deeds spanning Pune, Nashik, Nagpur, Satara, and Thane revenue jurisdictions."),
            ("CERSAI & NGDRS Open Standards", "Conveyance registry protocols and central mortgage encumbrance data exchange formats.")
        ]),
        ("CRYPTOGRAPHIC & TECHNICAL DOCUMENTATION", C_AMBER, Inches(6.8), Inches(4.1), [
            ("SHA-256 Document Provenance Standard", "NIST FIPS 180-4 secure hashing for original archival document scan immutability."),
            ("HMAC-SHA256 Zero-Plaintext Security", "RFC 2104 cryptographic authentication for one-time verification tokens."),
            ("GIGW 3.0 & WCAG 2.1 AA Accessibility", "Ministry of Electronics and Information Technology (MeitY) guidelines for accessible portals.")
        ])
    ]

    for title, color, left, top, items in ref_quads:
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.9), Inches(2.75))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_CARD_BORDER
        card.line.width = Pt(1)

        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.18)

        tp = ctf.paragraphs[0]
        tp.text = f"📚 {title}"
        tp.font.name = "Trebuchet MS"
        tp.font.bold = True
        tp.font.size = Pt(10.5)
        tp.font.color.rgb = color
        tp.space_after = Pt(6)

        for heading, desc in items:
            p_item = ctf.add_paragraph()
            p_item.text = f"• {heading}: "
            p_item.font.name = "Arial"
            p_item.font.bold = True
            p_item.font.size = Pt(8.5)
            p_item.font.color.rgb = C_NAVY_DARK

            run = p_item.add_run()
            run.text = desc
            run.font.bold = False
            run.font.size = Pt(8)
            run.font.color.rgb = C_SLATE_GRAY
            p_item.space_after = Pt(4)

    add_footer(s7, 8, 8)

    # Save presentation
    try:
        prs.save(output_path)
        print(f"Presentation saved successfully to: {os.path.abspath(output_path)}")
    except PermissionError:
        fallback_path = "ILRDVS_SIH_2026_Idea_Submission_Master.pptx"
        prs.save(fallback_path)
        print(f"Original file was open in PowerPoint. Saved updated version to: {os.path.abspath(fallback_path)}")

if __name__ == "__main__":
    create_deck()
