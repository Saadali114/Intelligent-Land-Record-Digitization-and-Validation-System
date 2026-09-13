import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

def render_3column_slide_image(output_path="updated_sih_tech_approach_slide.png"):
    # 16:9 Widescreen aspect ratio (16 x 9 inches @ 220 DPI = 3520 x 1980 px)
    fig, ax = plt.subplots(figsize=(16, 9), dpi=220)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")

    font_main = "sans-serif"

    # Slide Title Header
    ax.text(0.6, 8.45, "TECHNICAL APPROACH", 
            ha="left", va="center", fontsize=19, fontweight="bold", color="#0F172A", family=font_main)
    ax.text(0.6, 8.15, "ILRDVS • Intelligent Land Record Digitization, Cadastral Validation & Dual-Factor Verification Architecture", 
            ha="left", va="center", fontsize=9.5, color="#475569", family=font_main)

    C_CONTAINER_BG = "#F8FAFC"
    C_CONTAINER_BORDER = "#334155" # Slate 700
    C_CARD_BG = "#FFFFFF"
    C_CARD_BORDER = "#94A3B8"
    C_TEXT_DARK = "#0F172A"
    C_TEXT_MUTED = "#334155"
    C_TITLE_BLUE = "#1E3A8A"

    y_start = 0.65
    col_h = 7.2
    
    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 1: SYSTEM ARCHITECTURE (Left, x = 0.6, w = 4.6)
    # ─────────────────────────────────────────────────────────────────────────
    col1_x = 0.6
    col1_w = 4.7
    
    # Outer Container 1
    rect_c1 = patches.FancyBboxPatch(
        (col1_x, y_start), col1_w, col_h,
        boxstyle="round,pad=0.03,rounding_size=0.12",
        facecolor=C_CONTAINER_BG, edgecolor=C_CONTAINER_BORDER, lw=1.2, zorder=1
    )
    ax.add_patch(rect_c1)
    ax.text(col1_x + col1_w/2.0, y_start + col_h - 0.28, "SYSTEM ARCHITECTURE",
            ha="center", va="center", fontsize=11.5, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=2)

    tiers_c1 = [
        ("TIER 1: PRESENTATION & CLIENT LAYER", [
            "• Next.js 14 App Router (Citizen & Officer Portals)",
            "• Inspector Dual-Pane Workstation (with confidence meters)",
            "• Role-Based Dashboards (Admin, Officer, Verifier, Citizen)",
            "• Public QR Verification Portal & GIGW Accessible Mode"
        ]),
        ("TIER 2: API GATEWAY & SECURITY LAYER", [
            "• Node.js + Express.js API (High-throughput TypeScript)",
            "• TRAI DLT MSG91 SMS + Zero-Plaintext HMAC Email OTP",
            "• Strict RBAC & JWT Auth (HTTP-only cookies, BCrypt)",
            "• Zod Request Validation & Multer Vault (SHA-256 Hashes)"
        ]),
        ("TIER 3: AI & COMPUTER VISION MICROSERVICE", [
            "• OpenCV Adaptive Vision (CLAHE 3.5, Deskew, Rotate)",
            "• Multilingual OCR Engine (EasyOCR + Tesseract: Marathi & En)",
            "• Cadastral NER Pipeline (Owner, Gat#, Area, Khata, Village)",
            "• Self-Diagnosis Loop & Adaptive Multi-Pass Consensus"
        ]),
        ("TIER 4: CADASTRAL DATA & COMPLIANCE STORE", [
            "• MongoDB 8 Cadastral Store (Compound-indexed on ULPIN)",
            "• Unified 8-Layer Land Stack (DILRMP 3.0 Guidelines)",
            "• Cadastral Sanity Engine (Unit: Guntha/Are -> Hectare)",
            "• Dual-Factor Physical QR Sticker (Secret PIN) & AuditLog"
        ])
    ]

    tier_h = 1.52
    tier_gap = 0.12
    c1_card_y = y_start + col_h - 0.52 - tier_h

    for idx, (t_title, bullets) in enumerate(tiers_c1):
        cy = c1_card_y - idx * (tier_h + tier_gap)
        card = patches.FancyBboxPatch(
            (col1_x + 0.15, cy), col1_w - 0.3, tier_h,
            boxstyle="round,pad=0.03,rounding_size=0.08",
            facecolor=C_CARD_BG, edgecolor=C_CARD_BORDER, lw=0.9, zorder=2
        )
        ax.add_patch(card)

        ax.text(col1_x + 0.28, cy + tier_h - 0.20, t_title,
                ha="left", va="center", fontsize=8.2, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=3)
        
        line_y = cy + tier_h - 0.44
        for b in bullets:
            ax.text(col1_x + 0.28, line_y, b,
                    ha="left", va="center", fontsize=6.8, color=C_TEXT_MUTED, family=font_main, zorder=3)
            line_y -= 0.26

    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 2: PROCESS FLOWCHART (Center, x = 5.65, w = 4.7)
    # ─────────────────────────────────────────────────────────────────────────
    col2_x = 5.65
    col2_w = 4.7
    
    # Outer Container 2
    rect_c2 = patches.FancyBboxPatch(
        (col2_x, y_start), col2_w, col_h,
        boxstyle="round,pad=0.03,rounding_size=0.12",
        facecolor=C_CONTAINER_BG, edgecolor=C_CONTAINER_BORDER, lw=1.2, zorder=1
    )
    ax.add_patch(rect_c2)
    ax.text(col2_x + col2_w/2.0, y_start + col_h - 0.28, "PROCESS FLOWCHART",
            ha="center", va="center", fontsize=11.5, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=2)

    steps_data = [
        ("1", "Document Upload (Upload & Classify Scan)", "Citizen/officer uploads 7/12, 8A, Ferfar; computes SHA-256 hash"),
        ("2", "Preprocessing (Adaptive OpenCV Clean)", "Hough deskew (±15°), CLAHE 3.5 contrast boost for faded blue ink"),
        ("3", "Classification (Doc Type & Form ID)", "Rule-based identification: 7/12 Satbara, Form 8A, Ferfar, Sale Deed"),
        ("4", "Multilingual OCR (Tokenization Engine)", "EasyOCR + Tesseract extracts Marathi Devanagari & English tokens"),
        ("5", "Entity NER (Cadastral BIO Classification)", "Extracts Owner Name, Survey/Gat #, Area, Khata; flags missing fields"),
        ("6", "Cadastral Rules (8-Layer Sanity Engine)", "Unit conversion (Guntha->Ha), Mahabhulekh RoR, CERSAI & Court stays"),
        ("7", "HITL Verification (Dual-Signature Screen)", "Confidence >=70%: auto-verified. <70%: routed to inspector desk (DSC-OFF)"),
        ("8", "Output Delivery (Dual-Factor QR Seal)", "Citizen receives certified digital record + physical sticker with Secret PIN")
    ]

    step_h = 0.66
    step_gap = 0.16
    c2_step_y = y_start + col_h - 0.52 - step_h

    for s_idx, (num_str, s_title, s_sub) in enumerate(steps_data):
        sy = c2_step_y - s_idx * (step_h + step_gap)

        s_box = patches.FancyBboxPatch(
            (col2_x + 0.15, sy), col2_w - 0.3, step_h,
            boxstyle="round,pad=0.02,rounding_size=0.06",
            facecolor=C_CARD_BG, edgecolor=C_CARD_BORDER, lw=0.8, zorder=2
        )
        ax.add_patch(s_box)

        # Number Badge
        ax.text(col2_x + 0.35, sy + step_h/2.0, num_str,
                ha="center", va="center", fontsize=9.0, fontweight="bold", color=C_TITLE_BLUE, family=font_main, zorder=3)
        
        # Divider line
        ax.plot([col2_x + 0.55, col2_x + 0.55], [sy + 0.08, sy + step_h - 0.08], color="#CBD5E1", lw=0.8, zorder=3)

        # Title & Sub
        ax.text(col2_x + 0.70, sy + step_h/2.0 + 0.12, s_title,
                ha="left", va="center", fontsize=7.2, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=3)
        ax.text(col2_x + 0.70, sy + step_h/2.0 - 0.12, s_sub,
                ha="left", va="center", fontsize=6.2, color=C_TEXT_MUTED, family=font_main, zorder=3)

        # Down Arrow
        if s_idx < len(steps_data) - 1:
            arr_y = sy - 0.02
            ax.annotate(
                "", xy=(col2_x + col2_w/2.0, arr_y - step_gap + 0.05), xytext=(col2_x + col2_w/2.0, arr_y),
                arrowprops=dict(arrowstyle="-|>", color="#334155", lw=1.2, shrinkA=1, shrinkB=1, mutation_scale=8),
                zorder=4
            )

    # ─────────────────────────────────────────────────────────────────────────
    # COLUMN 3: TECH STACK USED (Right, x = 10.7, w = 4.7)
    # ─────────────────────────────────────────────────────────────────────────
    col3_x = 10.7
    col3_w = 4.7
    
    # Outer Container 3
    rect_c3 = patches.FancyBboxPatch(
        (col3_x, y_start), col3_w, col_h,
        boxstyle="round,pad=0.03,rounding_size=0.12",
        facecolor=C_CONTAINER_BG, edgecolor=C_CONTAINER_BORDER, lw=1.2, zorder=1
    )
    ax.add_patch(rect_c3)
    ax.text(col3_x + col3_w/2.0, y_start + col_h - 0.28, "TECH STACK USED",
            ha="center", va="center", fontsize=11.5, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=2)

    stack_c3 = [
        ("1. Frontend Client", [
            "• Next.js 14 (App Router, RSC Architecture)",
            "• React 18 + TypeScript (Strict Mode)",
            "• Tailwind CSS (Government-Tech Palette)",
            "• TanStack Query v5 (Server-State Caching)",
            "• Recharts Analytics & Lucide Icons",
            "• GIGW / WCAG 2.1 Accessible Screen Reader"
        ]),
        ("2. Backend & Gateway", [
            "• Node.js + Express.js TS (High-throughput)",
            "• TRAI DLT MSG91 SMS (DLT-Approved Template)",
            "• Zero-Plaintext HMAC-SHA256 Email OTP",
            "• JWT in HTTP-Only Cookies (BCrypt Salted)",
            "• Zod Request Validation & Multer File Ingest",
            "• Centralized Morgan HTTP Audit Logger"
        ]),
        ("3. AI, Vision & OCR", [
            "• Python FastAPI Asynchronous Microservice",
            "• OpenCV (CLAHE 3.5, Hough Deskew, Denoise)",
            "• EasyOCR + Tesseract Multilingual (Marathi/Eng)",
            "• Cadastral Entity NER Pipeline (BIO-Tagging)",
            "• Self-Diagnosis Loop & Multi-Pass Merger",
            "• Continuous Feedback Service (Active Learning)"
        ]),
        ("4. Cadastral DB & Engine", [
            "• MongoDB 8 + Mongoose (Compound ULPIN Index)",
            "• Unified 8-Layer Land Stack (DILRMP 3.0 Standard)",
            "• Maharashtra LRC Unit Converter (Guntha/Are/Ha)",
            "• Dual Digital Signatures (DSC-VER & DSC-OFF)",
            "• Dual-Factor Physical QR Protocol (Secret PIN)",
            "• Immutable RTI-Compliant AuditLog Vault"
        ])
    ]

    c3_card_y = y_start + col_h - 0.52 - tier_h

    for idx, (s_title, s_bullets) in enumerate(stack_c3):
        cy = c3_card_y - idx * (tier_h + tier_gap)
        scard = patches.FancyBboxPatch(
            (col3_x + 0.15, cy), col3_w - 0.3, tier_h,
            boxstyle="round,pad=0.03,rounding_size=0.08",
            facecolor=C_CARD_BG, edgecolor=C_CARD_BORDER, lw=0.9, zorder=2
        )
        ax.add_patch(scard)

        ax.text(col3_x + 0.28, cy + tier_h - 0.20, s_title,
                ha="left", va="center", fontsize=8.2, fontweight="bold", color=C_TEXT_DARK, family=font_main, zorder=3)
        
        line_y = cy + tier_h - 0.44
        for sb in s_bullets:
            ax.text(col3_x + 0.28, line_y, sb,
                    ha="left", va="center", fontsize=6.8, color=C_TEXT_MUTED, family=font_main, zorder=3)
            line_y -= 0.19

    # Set axes limits
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor="#FFFFFF", edgecolor="none")
    plt.close()
    print(f"Updated 3-column slide image rendered successfully: {output_path}")

if __name__ == "__main__":
    render_3column_slide_image()
