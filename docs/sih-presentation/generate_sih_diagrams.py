import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import numpy as np
import os

# ==============================================================================
# COLOR PALETTE: PROFESSIONAL GOVERNMENT-TECH / ENTERPRISE (SIH STYLE)
# ==============================================================================
C_BG = "#F8FAFC"          # Clean slate/off-white background
C_PANEL_BG = "#FFFFFF"    # Crisp white card background
C_TEXT_DARK = "#0F172A"   # Slate 900
C_TEXT_MUTED = "#475569"  # Slate 600
C_LINE = "#334155"        # Slate 700 for connector lines

# Accent colors for the 7 architectural tiers
C_NAVY = "#1E3A8A"        # Blue 900
C_BLUE = "#0284C7"        # Sky 600
C_EMERALD = "#059669"     # Emerald 600
C_AMBER = "#D97706"       # Amber 600
C_PURPLE = "#7C3AED"      # Violet 600
C_ROSE = "#E11D48"        # Rose 600
C_INDIGO = "#4338CA"      # Indigo 700

# ==============================================================================
# DIAGRAM 1: 7-LAYER SYSTEM ARCHITECTURE
# ==============================================================================
def create_diagram_1(output_path="diagram1_system_architecture.png"):
    # 16:9 Widescreen aspect ratio (18 x 10.125 inches @ 220 DPI = 3960 x 2228 px)
    fig, ax = plt.subplots(figsize=(18, 10.125), dpi=220)
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)

    # 1. Header Banner
    ax.text(9.0, 9.65, "ILRDVS — 7-LAYER SYSTEM ARCHITECTURE",
            ha="center", va="center", fontsize=18, fontweight="bold", color=C_TEXT_DARK, family="sans-serif")
    ax.text(9.0, 9.35, "Intelligent Land Record Digitization & Validation System • End-to-End Governance Architecture",
            ha="center", va="center", fontsize=11, color=C_TEXT_MUTED, family="sans-serif")

    # Helper: draw layered container
    def draw_layer(y, h, title, sub_title, border_color, fill_color="#FFFFFF"):
        # Outer Card
        card = patches.FancyBboxPatch(
            (0.8, y), 16.4, h,
            boxstyle="round,pad=0.06,rounding_size=0.12",
            facecolor=fill_color, edgecolor=border_color,
            linewidth=1.4, zorder=1
        )
        ax.add_patch(card)

        # Left Header Ribbon
        ribbon_w = 3.6
        ribbon = patches.FancyBboxPatch(
            (0.8, y), ribbon_w, h,
            boxstyle="round,pad=0.06,rounding_size=0.12",
            facecolor=border_color, edgecolor=border_color,
            linewidth=1.0, zorder=2
        )
        ax.add_patch(ribbon)

        # Fix square seam on right side of ribbon
        rect_cover = patches.Rectangle((0.8 + ribbon_w - 0.2, y), 0.2, h, facecolor=border_color, edgecolor="none", zorder=2)
        ax.add_patch(rect_cover)

        # Layer Title Text
        ax.text(0.8 + ribbon_w/2.0, y + h/2.0 + 0.12, title,
                ha="center", va="center", fontsize=10.5, fontweight="bold", color="#FFFFFF", family="sans-serif", zorder=3)
        ax.text(0.8 + ribbon_w/2.0, y + h/2.0 - 0.14, sub_title,
                ha="center", va="center", fontsize=8.0, color="#E2E8F0", family="sans-serif", zorder=3)

    # Helper: draw inner block
    def draw_block(x, y, w, h, main_text, sub_text=None, border_color="#CBD5E1", fill_color="#F8FAFC", highlight=False):
        f_col = "#EFF6FF" if highlight else fill_color
        b_col = "#3B82F6" if highlight else border_color
        box = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.03,rounding_size=0.06",
            facecolor=f_col, edgecolor=b_col,
            linewidth=1.0, zorder=4
        )
        ax.add_patch(box)
        if sub_text:
            ax.text(x + w/2.0, y + h/2.0 + 0.08, main_text, ha="center", va="center",
                    fontsize=8.2, fontweight="bold", color=C_TEXT_DARK, family="sans-serif", zorder=5)
            ax.text(x + w/2.0, y + h/2.0 - 0.10, sub_text, ha="center", va="center",
                    fontsize=7.0, color=C_TEXT_MUTED, family="sans-serif", zorder=5)
        else:
            ax.text(x + w/2.0, y + h/2.0, main_text, ha="center", va="center",
                    fontsize=8.2, fontweight="bold", color=C_TEXT_DARK, family="sans-serif", zorder=5)

    def draw_connecting_arrow(x, y_start, y_end, label=None):
        ax.annotate(
            "", xy=(x, y_end), xytext=(x, y_start),
            arrowprops=dict(arrowstyle="-|>", color=C_LINE, lw=1.5, shrinkA=2, shrinkB=2, mutation_scale=11),
            zorder=6
        )
        if label:
            ax.text(x + 0.15, (y_start + y_end)/2.0, label, ha="left", va="center",
                    fontsize=7.2, fontweight="bold", color=C_LINE, family="sans-serif", zorder=7)

    # -------------------------------------------------------------------------
    # LAYER 1: USER / CLIENT LAYER (Top)
    # -------------------------------------------------------------------------
    y1 = 8.1
    h1 = 1.05
    draw_layer(y1, h1, "1. USER / CLIENT LAYER", "Next.js 14 Web & Mobile Frontends", C_NAVY)
    # Blocks
    draw_block(4.7, y1 + 0.15, 2.1, 0.75, "Citizen Portal", "Self-Service & Applications", highlight=True)
    draw_block(7.0, y1 + 0.15, 2.1, 0.75, "Officer Portal", "Statutory Review Console")
    draw_block(9.3, y1 + 0.15, 2.2, 0.75, "Verifier Workspace", "Dual-Pane Review & Sign")
    draw_block(11.7, y1 + 0.15, 2.5, 0.75, "Public QR Verification", "3-Tier Authenticity Engine", highlight=True)
    draw_block(14.4, y1 + 0.15, 2.5, 0.75, "Multilingual Interface", "Marathi • Hindi • English")

    draw_connecting_arrow(7.5, y1, y1 - 0.25, "HTTPS / REST API")
    draw_connecting_arrow(12.5, y1, y1 - 0.25, "Secure Auth & Submissions")

    # -------------------------------------------------------------------------
    # LAYER 2: BACKEND & SECURITY LAYER
    # -------------------------------------------------------------------------
    y2 = 6.8
    h2 = 1.05
    draw_layer(y2, h2, "2. BACKEND & SECURITY", "Node.js + Express (TypeScript)", C_BLUE)
    # Blocks
    draw_block(4.7, y2 + 0.15, 2.1, 0.75, "REST APIs & Router", "Modular Endpoint Gateway")
    draw_block(7.0, y2 + 0.15, 2.3, 0.75, "JWT Auth & RBAC", "Citizen | Officer | Verifier | Admin")
    draw_block(9.5, y2 + 0.15, 2.3, 0.75, "OTP Verification", "DLT SMS + HMAC Email")
    draw_block(12.0, y2 + 0.15, 2.4, 0.75, "Zod Request Validation", "Type-Safe Body & Query Guards")
    draw_block(14.6, y2 + 0.15, 2.3, 0.75, "Upload & Audit Engine", "Multer Ingest + Audit Logging")

    draw_connecting_arrow(6.5, y2, y2 - 0.25, "Raw Scans & Deeds")
    draw_connecting_arrow(14.5, y2, y2 - 0.25, "Audit & User State")

    # -------------------------------------------------------------------------
    # LAYER 3: AI DOCUMENT PROCESSING LAYER
    # -------------------------------------------------------------------------
    y3 = 5.5
    h3 = 1.05
    draw_layer(y3, h3, "3. AI DOCUMENT PROCESSING", "Python FastAPI + OpenCV + OCR + NER", C_EMERALD)
    # Pipeline stages connected horizontally
    draw_block(4.7, y3 + 0.15, 1.8, 0.75, "1. Preprocessing", "OpenCV CLAHE & Deskew")
    draw_block(6.7, y3 + 0.15, 1.8, 0.75, "2. OCR Engine", "EasyOCR / Tesseract")
    draw_block(8.7, y3 + 0.15, 2.2, 0.75, "3. Cadastral NER", "Owner, Survey/Gat, Khata, Area")
    draw_block(11.1, y3 + 0.15, 2.5, 0.75, "4. Entity Extraction", "Village, Taluka, District, Land Type")
    draw_block(13.8, y3 + 0.15, 3.1, 0.75, "5. Validation & Error Check", "Anomaly Detection & Missing Fields")

    # Connect pipeline steps with small right arrows
    for arr_x in [6.52, 8.52, 10.92, 13.62]:
        ax.annotate("", xy=(arr_x + 0.15, y3 + 0.52), xytext=(arr_x - 0.05, y3 + 0.52),
                    arrowprops=dict(arrowstyle="-|>", color=C_EMERALD, lw=1.2, mutation_scale=8), zorder=5)

    draw_connecting_arrow(8.0, y3, y3 - 0.25, "Extracted Land Entities")
    draw_connecting_arrow(14.0, y3, y3 - 0.25, "Persist AI Metadata")

    # -------------------------------------------------------------------------
    # LAYER 4: DATABASE & STORAGE LAYER
    # -------------------------------------------------------------------------
    y4 = 4.2
    h4 = 1.05
    draw_layer(y4, h4, "4. DATABASE & STORAGE", "MongoDB 8 & Document Vault", C_AMBER)
    # Blocks
    draw_block(4.7, y4 + 0.15, 2.1, 0.75, "User Records", "Auth Credentials & Profiles")
    draw_block(7.0, y4 + 0.15, 2.4, 0.75, "Land Records Store", "Indexed by Survey & ULPIN")
    draw_block(9.6, y4 + 0.15, 2.3, 0.75, "Extracted Data", "Structured JSON Schema")
    draw_block(12.1, y4 + 0.15, 2.3, 0.75, "Verification & Audit", "Immutable Logs & Decisions")
    draw_block(14.6, y4 + 0.15, 2.3, 0.75, "Document Vault", "Document ID + SHA-256 Hash", highlight=True)

    draw_connecting_arrow(7.5, y4, y4 - 0.25, "AI Data vs Baseline")
    draw_connecting_arrow(13.0, y4, y4 - 0.25, "Reference Matching")

    # -------------------------------------------------------------------------
    # LAYER 5: VALIDATION & VERIFICATION LAYER
    # -------------------------------------------------------------------------
    y5 = 2.9
    h5 = 1.05
    draw_layer(y5, h5, "5. VALIDATION & CROSS-CHECK", "Algorithmic Integrity Comparison Engine", C_PURPLE)
    # Blocks
    draw_block(4.7, y5 + 0.15, 2.5, 0.75, "AI Extracted Data", "Real-Time Scan Entities")
    draw_block(7.4, y5 + 0.25, 0.5, 0.55, "⟷", "Match", fill_color="#F3E8FF", border_color=C_PURPLE)
    draw_block(8.1, y5 + 0.15, 2.8, 0.75, "Reference Land Records", "Government Cadastral Baseline")
    draw_block(11.1, y5 + 0.15, 2.8, 0.75, "Entity Comparison", "Owner • Survey # • Area • Khata")
    draw_block(14.1, y5 + 0.15, 2.8, 0.75, "Integrity Assessment", "Match | Mismatch | Tamper Flag", highlight=True)

    draw_connecting_arrow(9.5, y5, y5 - 0.25, "Validation Dossier")
    draw_connecting_arrow(15.0, y5, y5 - 0.25, "Discrepancy Alerts")

    # -------------------------------------------------------------------------
    # LAYER 6: HUMAN-IN-THE-LOOP LAYER
    # -------------------------------------------------------------------------
    y6 = 1.6
    h6 = 1.05
    draw_layer(y6, h6, "6. HUMAN-IN-THE-LOOP (HITL)", "Statutory Officer Adjudication", C_ROSE)
    # Blocks
    draw_block(4.7, y6 + 0.15, 2.5, 0.75, "Officer / Verifier Console", "Split-Screen Workstation", highlight=True)
    draw_block(7.4, y6 + 0.15, 2.8, 0.75, "Side-by-Side Comparison", "Original Scan vs Extracted Fields")
    draw_block(10.4, y6 + 0.15, 2.4, 0.75, "Inspector Corrections", "Manual Adjustments & Remarks")
    draw_block(13.0, y6 + 0.15, 1.8, 0.75, "Approve / Reject", "Statutory Powers")
    draw_block(15.0, y6 + 0.15, 1.9, 0.75, "Digital Certification", "DSC-OFF Legal Sanction", highlight=True)

    draw_connecting_arrow(12.0, y6, y6 - 0.25, "Certified Statutory Record")

    # -------------------------------------------------------------------------
    # LAYER 7: SECURE DOCUMENT VERIFICATION LAYER (Bottom)
    # -------------------------------------------------------------------------
    y7 = 0.3
    h7 = 1.05
    draw_layer(y7, h7, "7. SECURE VERIFICATION", "Cryptographic Dual-Factor Tamper Proofing", C_INDIGO)
    # Blocks
    draw_block(4.7, y7 + 0.15, 2.3, 0.75, "Document ID", "DOC-MH-2026-XXXX")
    ax.text(7.15, y7 + 0.52, "+", ha="center", va="center", fontsize=12, fontweight="bold", color=C_INDIGO)
    draw_block(7.35, y7 + 0.15, 2.3, 0.75, "SHA-256 Hash", "Cloud Checksum Fingerprint")
    ax.text(9.8, y7 + 0.52, "+", ha="center", va="center", fontsize=12, fontweight="bold", color=C_INDIGO)
    draw_block(10.0, y7 + 0.15, 2.2, 0.75, "High-Density QR Code", "Affixed Physical Sticker PIN")
    ax.annotate("", xy=(12.5, y7 + 0.52), xytext=(12.25, y7 + 0.52),
                arrowprops=dict(arrowstyle="-|>", color=C_INDIGO, lw=1.2, mutation_scale=9))
    draw_block(12.55, y7 + 0.15, 4.35, 0.75, "Public Verification Portal Result", 
               "✓ Valid Document  |  ⚠ Warning Flag  |  ✗ Tampered / Mismatch", highlight=True)

    # Set boundaries
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.125)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor=C_BG, edgecolor="none")
    plt.close()
    print(f"Diagram 1 saved successfully to: {output_path}")

# ==============================================================================
# DIAGRAM 2: END-TO-END PROCESS FLOWCHART
# ==============================================================================
def create_diagram_2(output_path="diagram2_process_flowchart.png"):
    # 16:9 Widescreen aspect ratio (18 x 10.125 inches @ 220 DPI)
    fig, ax = plt.subplots(figsize=(18, 10.125), dpi=220)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")

    # Header Banner
    ax.text(9.0, 9.7, "ILRDVS — END-TO-END DOCUMENT LIFECYCLE FLOWCHART",
            ha="center", va="center", fontsize=18, fontweight="bold", color=C_TEXT_DARK, family="sans-serif")
    ax.text(9.0, 9.4, "Complete Journey from Citizen Submission to AI Extraction, Human Verification, and Cryptographic Certification",
            ha="center", va="center", fontsize=11, color=C_TEXT_MUTED, family="sans-serif")

    # Flowchart Shape Helpers
    def draw_terminal(x, y, w, h, text, bg_color="#1E293B", text_color="#FFFFFF"):
        # Rounded capsule for START / END
        capsule = patches.FancyBboxPatch(
            (x - w/2.0, y - h/2.0), w, h,
            boxstyle="round,pad=0.04,rounding_size=0.25",
            facecolor=bg_color, edgecolor="#0F172A",
            linewidth=1.2, zorder=5
        )
        ax.add_patch(capsule)
        ax.text(x, y, text, ha="center", va="center",
                fontsize=9.0, fontweight="bold", color=text_color, family="sans-serif", zorder=6)

    def draw_process(x, y, w, h, title, subtitle=None, bg_color="#FFFFFF", border_color="#3B82F6"):
        # Standard rectangle for process
        rect = patches.FancyBboxPatch(
            (x - w/2.0, y - h/2.0), w, h,
            boxstyle="round,pad=0.03,rounding_size=0.08",
            facecolor=bg_color, edgecolor=border_color,
            linewidth=1.1, zorder=4
        )
        ax.add_patch(rect)
        if subtitle:
            ax.text(x, y + 0.08, title, ha="center", va="center",
                    fontsize=8.0, fontweight="bold", color=C_TEXT_DARK, family="sans-serif", zorder=5)
            ax.text(x, y - 0.10, subtitle, ha="center", va="center",
                    fontsize=6.8, color=C_TEXT_MUTED, family="sans-serif", zorder=5)
        else:
            ax.text(x, y, title, ha="center", va="center",
                    fontsize=8.0, fontweight="bold", color=C_TEXT_DARK, family="sans-serif", zorder=5)

    def draw_decision(x, y, w, h, text):
        # Diamond shape for decision
        pts = np.array([
            [x, y + h/2.0],
            [x + w/2.0, y],
            [x, y - h/2.0],
            [x - w/2.0, y]
        ])
        poly = patches.Polygon(pts, closed=True, facecolor="#FEF3C7", edgecolor="#D97706", linewidth=1.2, zorder=4)
        ax.add_patch(poly)
        ax.text(x, y, text, ha="center", va="center",
                fontsize=7.5, fontweight="bold", color="#78350F", family="sans-serif", zorder=5)

    def draw_flow_arrow(p1, p2, label=None, label_color="#0F172A", label_side="right"):
        ax.annotate(
            "", xy=p2, xytext=p1,
            arrowprops=dict(arrowstyle="-|>", color=C_LINE, lw=1.3, shrinkA=2, shrinkB=2, mutation_scale=10),
            zorder=6
        )
        if label:
            mx = (p1[0] + p2[0]) / 2.0
            my = (p1[1] + p2[1]) / 2.0
            ox = 0.18 if label_side == "right" else -0.18
            oy = 0.14 if label_side == "top" else 0.0
            ha = "left" if label_side == "right" else ("right" if label_side == "left" else "center")
            ax.text(mx + ox, my + oy, label, ha=ha, va="center",
                    fontsize=7.8, fontweight="bold", color=label_color, family="sans-serif", zorder=7,
                    bbox=dict(boxstyle="round,pad=0.15", facecolor="#FFFFFF", edgecolor="none", alpha=0.9))

    # Helper: draw orthogonal polyline arrow
    def draw_elbow_arrow(pts, label=None, label_color="#0F172A", label_pos=None):
        xs, ys = zip(*pts)
        ax.plot(xs, ys, color=C_LINE, linewidth=1.3, solid_capstyle="round", zorder=6)
        # Arrow tip on last segment
        p_penult = pts[-2]
        p_last = pts[-1]
        ax.annotate(
            "", xy=p_last, xytext=p_penult,
            arrowprops=dict(arrowstyle="-|>", color=C_LINE, lw=1.3, shrinkA=1, shrinkB=1, mutation_scale=10),
            zorder=6
        )
        if label and label_pos:
            ax.text(label_pos[0], label_pos[1], label, ha="center", va="center",
                    fontsize=7.8, fontweight="bold", color=label_color, family="sans-serif", zorder=7,
                    bbox=dict(boxstyle="round,pad=0.15", facecolor="#FFFFFF", edgecolor="none", alpha=0.9))

    # -------------------------------------------------------------------------
    # LAYOUT: 3 HORIZONTAL ZONES / COLUMNS FOR A BEAUTIFUL LEFT-TO-RIGHT / SERPENTINE FLOW
    # Column 1 (Left): Ingestion & AI Processing
    # Column 2 (Middle): Reference Comparison & HITL Review
    # Column 3 (Right): Certification, Verification & Termination
    # -------------------------------------------------------------------------

    col1_x = 2.8
    col2_x = 9.0
    col3_x = 15.2

    # Column 1 Container Box
    ax.add_patch(patches.FancyBboxPatch((0.8, 0.4), 4.2, 8.6, boxstyle="round,pad=0.04,rounding_size=0.1",
                                       facecolor="#F8FAFC", edgecolor="#E2E8F0", lw=1.0, zorder=1))
    ax.text(col1_x, 8.8, "STAGE 1: INGESTION & AI EXTRACTION", ha="center", va="center",
            fontsize=9.0, fontweight="bold", color="#1E3A8A", family="sans-serif")

    # Column 2 Container Box
    ax.add_patch(patches.FancyBboxPatch((6.8, 0.4), 4.4, 8.6, boxstyle="round,pad=0.04,rounding_size=0.1",
                                       facecolor="#F8FAFC", edgecolor="#E2E8F0", lw=1.0, zorder=1))
    ax.text(col2_x, 8.8, "STAGE 2: CROSS-CHECK & HUMAN REVIEW", ha="center", va="center",
            fontsize=9.0, fontweight="bold", color="#059669", family="sans-serif")

    # Column 3 Container Box
    ax.add_patch(patches.FancyBboxPatch((13.0, 0.4), 4.2, 8.6, boxstyle="round,pad=0.04,rounding_size=0.1",
                                       facecolor="#F8FAFC", edgecolor="#E2E8F0", lw=1.0, zorder=1))
    ax.text(col3_x, 8.8, "STAGE 3: CERTIFICATION & VERIFICATION", ha="center", va="center",
            fontsize=9.0, fontweight="bold", color="#4338CA", family="sans-serif")

    # =========================================================================
    # COLUMN 1: INGESTION & AI EXTRACTION
    # =========================================================================
    # 1. START
    draw_terminal(col1_x, 8.2, 1.4, 0.45, "START", bg_color="#0F172A")
    
    # 2. Citizen uploads old land document
    draw_process(col1_x, 7.3, 3.2, 0.6, "Citizen Uploads Land Document", "7/12 Satbara, Ferfar, Sale Deed", border_color="#3B82F6")
    draw_flow_arrow((col1_x, 7.97), (col1_x, 7.6))

    # 3. Document received by backend & validated
    draw_process(col1_x, 6.4, 3.2, 0.6, "Document Received by Backend", "File Type, Size & MIME Validation", border_color="#3B82F6")
    draw_flow_arrow((col1_x, 7.0), (col1_x, 6.7))

    # 4. Image preprocessing
    draw_process(col1_x, 5.5, 3.2, 0.6, "Image Preprocessing", "OpenCV Deskew, Denoise, CLAHE Boost", border_color="#10B981")
    draw_flow_arrow((col1_x, 6.1), (col1_x, 5.8))

    # 5. Multilingual OCR
    draw_process(col1_x, 4.6, 3.2, 0.6, "Multilingual OCR Engine", "EasyOCR / Tesseract (Devanagari + Eng)", border_color="#10B981")
    draw_flow_arrow((col1_x, 5.2), (col1_x, 4.9))

    # 6. Extract Land Information
    draw_process(col1_x, 3.7, 3.2, 0.6, "Extract Land Information", "NLP / Regex NER (Owner, Survey, Area)", border_color="#10B981")
    draw_flow_arrow((col1_x, 4.3), (col1_x, 4.0))

    # 7. Validate extracted fields
    draw_process(col1_x, 2.8, 3.2, 0.6, "Validate Extracted Fields", "Completeness & Character Density Check", border_color="#10B981")
    draw_flow_arrow((col1_x, 3.4), (col1_x, 3.1))

    # 8. DECISION 1: Required fields detected?
    dec1_y = 1.6
    draw_decision(col1_x, dec1_y, 2.8, 1.0, "Are all required\nfields detected?")
    draw_flow_arrow((col1_x, 2.5), (col1_x, dec1_y + 0.5))

    # Loopback for NO: Re-process / Improve OCR
    draw_elbow_arrow([
        (col1_x - 1.4, dec1_y),       # Left of decision
        (col1_x - 1.7, dec1_y),
        (col1_x - 1.7, 5.05),
        (col1_x - 1.6, 5.05)
    ], label="NO (Re-process OCR)", label_color="#B91C1C", label_pos=(col1_x - 1.7, 3.3))
    
    # Process box for Re-OCR shift
    draw_process(col1_x - 0.7, 5.05, 1.8, 0.35, "Adaptive Shift", "Contrast/Rotate", bg_color="#FEF2F2", border_color="#EF4444")

    # YES Arrow: Transition to Column 2 (Comparison)
    draw_elbow_arrow([
        (col1_x + 1.4, dec1_y),
        (col2_x - 1.8, dec1_y),
        (col2_x - 1.8, 8.2),
        (col2_x - 1.6, 8.2)
    ], label="YES", label_color="#047857", label_pos=(col1_x + 2.0, dec1_y + 0.18))

    # =========================================================================
    # COLUMN 2: REFERENCE COMPARISON & HITL REVIEW
    # =========================================================================
    # 9. Compare with reference records
    draw_process(col2_x, 8.2, 3.2, 0.65, "Cross-Reference Comparison", "Compare with Reference Land Records", border_color="#8B5CF6")

    # 10. DECISION 2: Is information matching?
    dec2_y = 7.0
    draw_decision(col2_x, dec2_y, 2.8, 1.0, "Is the information\nmatching?")
    draw_flow_arrow((col2_x, 7.87), (col2_x, dec2_y + 0.5))

    # NO branch: Flag mismatch / anomaly
    draw_process(col2_x + 1.55, 5.8, 1.6, 0.65, "Flag Mismatch", "Highlight Anomaly", bg_color="#FEF2F2", border_color="#EF4444")
    draw_elbow_arrow([
        (col2_x + 1.4, dec2_y),
        (col2_x + 1.55, dec2_y),
        (col2_x + 1.55, 6.12)
    ], label="NO", label_color="#B91C1C", label_pos=(col2_x + 1.75, dec2_y))

    # Officer reviews flagged information
    draw_elbow_arrow([
        (col2_x + 1.55, 5.47),
        (col2_x + 1.55, 4.8),
        (col2_x + 1.1, 4.8)
    ], label="Officer Reviews", label_color="#B91C1C", label_pos=(col2_x + 1.55, 5.1))

    # YES branch: Continue directly to Human Verification
    draw_flow_arrow((col2_x, dec2_y - 0.5), (col2_x, 5.1), label="YES", label_color="#047857", label_side="left")

    # 11. Human Verification Review
    draw_process(col2_x, 4.6, 3.2, 0.8, "Human Verification Review", "Officer checks: Original Scan, OCR,\nReference Data & Mismatches", border_color="#F59E0B")

    # 12. DECISION 3: Is document valid?
    dec3_y = 3.1
    draw_decision(col2_x, dec3_y, 2.8, 1.0, "Is the document\nvalid?")
    draw_flow_arrow((col2_x, 4.2), (col2_x, dec3_y + 0.5))

    # NO branch for Decision 3: Reject & Investigate
    draw_process(col2_x, 1.6, 3.2, 0.6, "Reject / Flag for Investigation", "Store Verification Rejection Result", bg_color="#FEF2F2", border_color="#EF4444")
    draw_flow_arrow((col2_x, dec3_y - 0.5), (col2_x, 1.9), label="NO", label_color="#B91C1C", label_side="right")

    # Rejection END
    draw_terminal(col2_x, 0.8, 1.4, 0.45, "END", bg_color="#991B1B")
    draw_flow_arrow((col2_x, 1.3), (col2_x, 1.02))

    # YES branch for Decision 3: Transition to Column 3 (Certification)
    draw_elbow_arrow([
        (col2_x + 1.4, dec3_y),
        (col3_x - 1.8, dec3_y),
        (col3_x - 1.8, 8.2),
        (col3_x - 1.6, 8.2)
    ], label="YES (Approve)", label_color="#047857", label_pos=(col2_x + 2.2, dec3_y + 0.18))

    # =========================================================================
    # COLUMN 3: CERTIFICATION & VERIFICATION
    # =========================================================================
    # 13. Approve & Certify
    draw_process(col3_x, 8.2, 3.2, 0.6, "Approve & Certify", "Digital Signature Applied (DSC-OFF)", border_color="#059669")

    # 14. Generate Document ID & Hash
    draw_process(col3_x, 7.2, 3.2, 0.6, "Generate Unique Document ID", "Assign DOC-MH-2026-XXXX", border_color="#0284C7")
    draw_flow_arrow((col3_x, 7.9), (col3_x, 7.5))

    # 15. Generate SHA-256 Hash
    draw_process(col3_x, 6.2, 3.2, 0.6, "Generate SHA-256 Hash", "Cryptographic Provenance Checksum", border_color="#0284C7")
    draw_flow_arrow((col3_x, 6.9), (col3_x, 6.5))

    # 16. Generate QR Code
    draw_process(col3_x, 5.2, 3.2, 0.6, "Generate Secure QR Code", "Embedded Document ID + Secret PIN", border_color="#0284C7")
    draw_flow_arrow((col3_x, 5.9), (col3_x, 5.5))

    # 17. Store Certified Record in MongoDB
    draw_process(col3_x, 4.1, 3.2, 0.7, "Store Certified Record", "Saved in MongoDB 8 + Immutable AuditLog", border_color="#4338CA")
    draw_flow_arrow((col3_x, 4.9), (col3_x, 4.45))

    # 18. Document Available for Secure Verification
    draw_process(col3_x, 2.8, 3.2, 0.8, "Available for Public Verification", "Accessible via /verify-document\n(Valid | Warning | Tampered)", border_color="#059669", bg_color="#F0FDF4")
    draw_flow_arrow((col3_x, 3.75), (col3_x, 3.2))

    # 19. Certified END
    draw_terminal(col3_x, 1.5, 1.4, 0.45, "END", bg_color="#047857")
    draw_flow_arrow((col3_x, 2.4), (col3_x, 1.72))

    # Set boundaries
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.125)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor="#FFFFFF", edgecolor="none")
    plt.close()
    print(f"Diagram 2 saved successfully to: {output_path}")

if __name__ == "__main__":
    create_diagram_1()
    create_diagram_2()
