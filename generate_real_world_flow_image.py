import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

def build_real_world_flowchart(output_path="real_world_process_flow_story.png"):
    # 16:9 Widescreen aspect ratio (18 x 10.125 inches @ 220 DPI = 3960 x 2228 px)
    fig, ax = plt.subplots(figsize=(18, 10.125), dpi=220)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")

    font_main = "sans-serif"

    # Color Palette: Drawing / Blueprint / Editorial Hand-crafted style
    C_CARD_BG = "#FAFAFA"
    C_CARD_BORDER = "#334155" # Dark pencil slate border
    C_TEXT_MAIN = "#0F172A"
    C_TEXT_MUTED = "#475569"
    C_ACCENT_BLUE = "#0284C7"
    C_ACCENT_GREEN = "#059669"
    C_ACCENT_AMBER = "#D97706"
    C_ACCENT_ROSE = "#E11D48"
    C_ACCENT_PURPLE = "#7C3AED"

    # 1. Title Banner with Highlighter Tag
    hl_patch = patches.FancyBboxPatch(
        (0.8, 9.35), 7.8, 0.55,
        boxstyle="round,pad=0.06,rounding_size=0.12",
        facecolor="#FEF08A", edgecolor="none", alpha=0.9, zorder=2
    )
    ax.add_patch(hl_patch)
    ax.text(1.0, 9.62, "REAL-WORLD PROCESS FLOW: THE JOURNEY OF A LAND RECORD", 
            ha="left", va="center", fontsize=16, fontweight="bold", color="#0F172A", family=font_main, zorder=3)
    ax.text(9.0, 9.62, "• Case Study: Historical 7/12 Satbara Extract (Pune District)", 
            ha="left", va="center", fontsize=11, fontweight="bold", color="#475569", family=font_main, zorder=3)

    # Subtitle Case Context Ribbon
    ctx_box = patches.FancyBboxPatch(
        (0.8, 8.65), 16.4, 0.55,
        boxstyle="round,pad=0.04,rounding_size=0.08",
        facecolor="#F1F5F9", edgecolor="#CBD5E1", lw=1.0, zorder=2
    )
    ax.add_patch(ctx_box)
    ax.text(1.0, 8.92, "CITIZEN PROFILE:", fontsize=8.5, fontweight="bold", color="#1E3A8A", family=font_main, zorder=3)
    ax.text(2.6, 8.92, "Ramesh Narayan Patil", fontsize=8.5, color="#0F172A", family=font_main, zorder=3)
    ax.text(4.7, 8.92, "PARCEL DETAILS:", fontsize=8.5, fontweight="bold", color="#1E3A8A", family=font_main, zorder=3)
    ax.text(6.2, 8.92, "Gat No. 104/4B, Village Hinjawadi, Taluka Mulshi, Dist. Pune", fontsize=8.5, color="#0F172A", family=font_main, zorder=3)
    ax.text(11.8, 8.92, "HISTORIC DEED:", fontsize=8.5, fontweight="bold", color="#1E3A8A", family=font_main, zorder=3)
    ax.text(13.2, 8.92, "1978 Faded 7/12 Extract (0.84 Hectares)", fontsize=8.5, color="#0F172A", family=font_main, zorder=3)

    # Helper: Draw Sketch-style Process Card
    def draw_step_card(x, y, w, h, step_num, step_title, step_tag, tag_bg, tag_color, content_lines, sub_note=None):
        # Card body
        card = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.06,rounding_size=0.14",
            facecolor="#FFFFFF", edgecolor="#334155",
            linewidth=1.2, zorder=3
        )
        ax.add_patch(card)

        # Subtle card shadow
        shadow = patches.FancyBboxPatch(
            (x + 0.08, y - 0.08), w, h,
            boxstyle="round,pad=0.06,rounding_size=0.14",
            facecolor="#E2E8F0", edgecolor="none", zorder=2
        )
        ax.add_patch(shadow)

        # Step Number Badge (Circle)
        circle = patches.Circle((x + 0.35, y + h - 0.32), 0.22, facecolor="#0F172A", edgecolor="none", zorder=4)
        ax.add_patch(circle)
        ax.text(x + 0.35, y + h - 0.32, str(step_num), ha="center", va="center",
                fontsize=9.0, fontweight="bold", color="#FFFFFF", family=font_main, zorder=5)

        # Step Title
        ax.text(x + 0.68, y + h - 0.32, step_title, ha="left", va="center",
                fontsize=9.5, fontweight="bold", color="#0F172A", family=font_main, zorder=4)

        # Top-Right Pill Tag
        pill_w = len(step_tag) * 0.085 + 0.25
        pill = patches.FancyBboxPatch(
            (x + w - pill_w - 0.2, y + h - 0.45), pill_w, 0.26,
            boxstyle="round,pad=0.02,rounding_size=0.06",
            facecolor=tag_bg, edgecolor="none", zorder=4
        )
        ax.add_patch(pill)
        ax.text(x + w - pill_w/2.0 - 0.2, y + h - 0.32, step_tag, ha="center", va="center",
                fontsize=6.5, fontweight="bold", color=tag_color, family=font_main, zorder=5)

        # Divider line
        ax.plot([x + 0.2, x + w - 0.2], [y + h - 0.62, y + h - 0.62], color="#E2E8F0", lw=0.9, zorder=4)

        # Content lines
        curr_y = y + h - 0.88
        for label, val in content_lines:
            ax.text(x + 0.25, curr_y, label, ha="left", va="center",
                    fontsize=7.8, fontweight="bold", color="#1E293B", family=font_main, zorder=4)
            ax.text(x + 0.25, curr_y - 0.22, val, ha="left", va="center",
                    fontsize=7.2, color="#475569", family=font_main, zorder=4)
            curr_y -= 0.48

        # Bottom Sub-note
        if sub_note:
            sub_box = patches.FancyBboxPatch(
                (x + 0.2, y + 0.15), w - 0.4, 0.42,
                boxstyle="round,pad=0.02,rounding_size=0.04",
                facecolor="#F8FAFC", edgecolor="#CBD5E1", lw=0.8, zorder=4
            )
            ax.add_patch(sub_box)
            ax.text(x + w/2.0, y + 0.36, sub_note, ha="center", va="center",
                    fontsize=6.8, fontweight="bold", color="#0369A1", family=font_main, zorder=5)

    def draw_connecting_path(p1, p2, label=None, label_color="#0F172A"):
        ax.annotate(
            "", xy=p2, xytext=p1,
            arrowprops=dict(arrowstyle="-|>", color="#1E293B", lw=1.8, shrinkA=3, shrinkB=3, mutation_scale=12),
            zorder=6
        )
        if label:
            mx = (p1[0] + p2[0]) / 2.0
            my = (p1[1] + p2[1]) / 2.0
            ax.text(mx, my + 0.15, label, ha="center", va="center",
                    fontsize=7.2, fontweight="bold", color=label_color, family=font_main, zorder=7,
                    bbox=dict(boxstyle="round,pad=0.2", facecolor="#FFFFFF", edgecolor="#CBD5E1", lw=0.8))

    # =========================================================================
    # ROW 1 (TOP): STEPS 1 TO 3 (Left to Right)
    # =========================================================================
    card_w = 4.8
    card_h = 3.6
    y_row1 = 4.75

    # -------------------------------------------------------------------------
    # STEP 1: CITIZEN UPLOAD & INGESTION
    # -------------------------------------------------------------------------
    draw_step_card(
        0.8, y_row1, card_w, card_h,
        1, "Citizen Ingestion", "CITIZEN PORTAL",
        "#E0F2FE", "#0369A1",
        [
            ("1. Citizen Access:", "Ramesh logs into /citizen using MSG91 SMS OTP."),
            ("2. Archival Document Upload:", "Uploads scan of 1978 7/12 extract (faint ink & stamp)."),
            ("3. Gateway Ingestion:", "Node.js Multer validates file MIME & stores raw scan."),
            ("4. Checksum Fingerprint:", "SHA-256 hash computed: e3b0c44298fc1c149afb...")
        ],
        sub_note="* Zero Plaintext Passwords • DLT OTP Verified"
    )

    # Arrow Step 1 -> Step 2
    draw_connecting_path((5.6, y_row1 + card_h/2.0), (6.6, y_row1 + card_h/2.0), "Deed Image")

    # -------------------------------------------------------------------------
    # STEP 2: AI VISION & PREPROCESSING
    # -------------------------------------------------------------------------
    draw_step_card(
        6.6, y_row1, card_w, card_h,
        2, "AI Preprocessing & OCR", "FASTAPI MICROSERVICE",
        "#DCFCE7", "#15803D",
        [
            ("1. OpenCV Deskewing:", "Corrects 2.4° physical scanner angle distortion."),
            ("2. CLAHE 3.5 Contrast Boost:", "Stretches faded blue Devanagari ink & old stamps."),
            ("3. Multilingual EasyOCR:", "Extracts raw text stream in Marathi Devanagari + Eng."),
            ("4. Character Density Audit:", "Confirms yield: 248 characters (> 80 baseline).")
        ],
        sub_note="* Rescues 40-Year-Old Faded Government Ink"
    )

    # Arrow Step 2 -> Step 3
    draw_connecting_path((11.4, y_row1 + card_h/2.0), (12.4, y_row1 + card_h/2.0), "Extracted Text")

    # -------------------------------------------------------------------------
    # STEP 3: CADASTRAL NER & VALIDATION
    # -------------------------------------------------------------------------
    draw_step_card(
        12.4, y_row1, card_w, card_h,
        3, "Cadastral NER & Checks", "DOMAIN ENTITY MODEL",
        "#F3E8FF", "#7E22CE",
        [
            ("1. Named Entity Extractor:", "Owner: 'Ramesh Narayan Patil' | Gat: '104/4B'"),
            ("2. Area & Tenure Parser:", "Plot Area: '0.84 Hectares' | Bhogwatdar Class 1"),
            ("3. Self-Diagnosis Loop:", "All 5 core cadastral fields detected with 94.2% conf."),
            ("4. Reference Cross-Check:", "Matches Mahabhulekh RoR database Gat 104 record.")
        ],
        sub_note="[MATCH] 0 Discrepancies • Ready for Inspection"
    )

    # Arrow Row 1 Step 3 -> Row 2 Step 4 (Elbow down)
    ax.annotate(
        "", xy=(14.8, 4.3), xytext=(14.8, 4.75),
        arrowprops=dict(arrowstyle="-|>", color="#1E293B", lw=1.8, shrinkA=2, shrinkB=2, mutation_scale=12),
        zorder=6
    )
    ax.text(14.8, 4.52, "Validation Dossier", ha="center", va="center",
            fontsize=7.2, fontweight="bold", color="#7C3AED", family=font_main, zorder=7,
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#FFFFFF", edgecolor="#CBD5E1", lw=0.8))

    # =========================================================================
    # ROW 2 (BOTTOM): STEPS 4 TO 6 (Right to Left Serpentine Flow)
    # =========================================================================
    y_row2 = 0.6

    # -------------------------------------------------------------------------
    # STEP 6: SECURE VERIFICATION (Bottom-Left)
    # -------------------------------------------------------------------------
    draw_step_card(
        0.8, y_row2, card_w, card_h,
        6, "Secure Public Verification", "CITIZEN / BANK ACCESS",
        "#DCFCE7", "#15803D",
        [
            ("1. Mobile QR Scan:", "Bank loan officer scans sticker at /verify-document."),
            ("2. Enter Physical PIN:", "User types SEC-89A4-2C71 found on physical sticker."),
            ("3. Cryptographic Proof:", "Verifies cloud SHA-256 hash matches paper deed."),
            ("4. Outcome Result:", "[PASS] TIER 2 AUTHENTICATED: Bank loan cleared in 24h!")
        ],
        sub_note="* Completely Eliminates Offline Photocopy Fraud"
    )

    # Arrow Step 5 -> Step 6 (Right to Left)
    draw_connecting_path((6.6, y_row2 + card_h/2.0), (5.6, y_row2 + card_h/2.0), "Certified Deed")

    # -------------------------------------------------------------------------
    # STEP 5: QR GENERATION & LOCK (Bottom-Center)
    # -------------------------------------------------------------------------
    draw_step_card(
        6.6, y_row2, card_w, card_h,
        5, "Digital Seal & QR Lock", "SECURITY ENCLAVE",
        "#FFE4E6", "#BE123C",
        [
            ("1. Assign Unique ID:", "DOC-MH-2026-1042 generated & mapped to ULPIN."),
            ("2. Secret Security PIN:", "Cryptographic token generated: SEC-89A4-2C71."),
            ("3. High-Density 2D QR:", "Encodes public verify URL + digital signature token."),
            ("4. Physical Sticker Seal:", "Affixed directly onto Ramesh's original paper 7/12.")
        ],
        sub_note="* Dual-Factor Physical-to-Digital Tamper Proof"
    )

    # Arrow Step 4 -> Step 5 (Right to Left)
    draw_connecting_path((12.4, y_row2 + card_h/2.0), (11.4, y_row2 + card_h/2.0), "Approved Title")

    # -------------------------------------------------------------------------
    # STEP 4: STATUTORY HITL WORKSTATION (Bottom-Right)
    # -------------------------------------------------------------------------
    draw_step_card(
        12.4, y_row2, card_w, card_h,
        4, "Statutory HITL Review", "OFFICER WORKSTATION",
        "#FEF3C7", "#92400E",
        [
            ("1. Split-Screen Review:", "Revenue Inspector examines scan vs extracted table."),
            ("2. Anomaly Checklist:", "Confirmed zero encumbrance & no active court stay."),
            ("3. Verifier Sign:", "Inspector signs with digital signature (DSC-VER)."),
            ("4. Tehsildar Approval:", "Revenue Officer grants legal approval (DSC-OFF).")
        ],
        sub_note="* Statutory Separation of Powers Maintained"
    )

    # Set boundaries
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.125)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor="#FFFFFF", edgecolor="none")
    plt.close()
    print(f"Real-world process flowchart saved to: {output_path}")

if __name__ == "__main__":
    build_real_world_flowchart()
