import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import os

def build_drawio_style_architecture(output_path="ilrdvs_system_architecture_diagram.png"):
    # 16:9 Widescreen aspect ratio (18 x 10.125 inches @ 220 DPI = 3960 x 2228 px)
    fig, ax = plt.subplots(figsize=(18, 10.125), dpi=220)
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")

    # Global font style
    font_main = "sans-serif"

    # Color Palette matching the Draw.io reference image
    COLOR_BG = "#FFFFFF"
    COLOR_NODE_BG = "#FFFFFF"
    COLOR_NODE_BORDER = "#475569" # Slate border for nodes
    COLOR_LINE = "#1E293B"        # Dark slate routing lines
    
    # Cluster border colors (thin, clean pastel tint)
    CLUSTER_COLORS = {
        "REF_DB": {"border": "#F59E0B", "tag_bg": "#FEF3C7", "tag_text": "#92400E"},      # Amber/Orange
        "INPUT": {"border": "#38BDF8", "tag_bg": "#E0F2FE", "tag_text": "#0369A1"},       # Sky Blue
        "PREPROC": {"border": "#3B82F6", "tag_bg": "#DBEAFE", "tag_text": "#1D4ED8"},     # Blue
        "AI_ENGINE": {"border": "#C084FC", "tag_bg": "#F3E8FF", "tag_text": "#7E22CE"},   # Purple/Magenta
        "FEEDBACK": {"border": "#FB7185", "tag_bg": "#FFE4E6", "tag_text": "#BE123C"},    # Rose/Pink
        "INFRA": {"border": "#64748B", "tag_bg": "#F1F5F9", "tag_text": "#334155"},       # Slate Gray
        "WORKFLOW": {"border": "#2DD4BF", "tag_bg": "#CCFBF1", "tag_text": "#0F766E"},    # Teal
        "UI_LAYER": {"border": "#4ADE80", "tag_bg": "#DCFCE7", "tag_text": "#15803D"}     # Emerald Green
    }

    # Helper: Draw cluster bounding box with top-left badge tag
    def draw_cluster(x, y, w, h, cluster_key, title_text):
        cfg = CLUSTER_COLORS[cluster_key]
        # Main rounded bounding box
        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.08,rounding_size=0.18",
            facecolor="none", edgecolor=cfg["border"],
            linewidth=1.2, linestyle="-", zorder=1
        )
        ax.add_patch(rect)

        # Top-left tag badge
        tag_w = len(title_text) * 0.105 + 0.35
        tag_h = 0.28
        tag_rect = patches.FancyBboxPatch(
            (x + 0.12, y + h - tag_h / 2.0), tag_w, tag_h,
            boxstyle="round,pad=0.02,rounding_size=0.06",
            facecolor=cfg["tag_bg"], edgecolor=cfg["border"],
            linewidth=0.8, zorder=3
        )
        ax.add_patch(tag_rect)
        ax.text(x + 0.12 + tag_w / 2.0, y + h, title_text.upper(),
                ha="center", va="center", fontsize=7.2, fontweight="bold",
                color=cfg["tag_text"], family=font_main, zorder=4)

    # Helper: Draw white rounded node box (Draw.io style)
    def draw_node(x, y, w, h, line1, line2=None, icon=None, bg_color="#FFFFFF", border_color="#64748B", is_highlight=False):
        edge_c = "#0284C7" if is_highlight else border_color
        fill_c = "#E0F2FE" if is_highlight else bg_color
        lw = 1.2 if is_highlight else 0.9

        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.04,rounding_size=0.08",
            facecolor=fill_c, edgecolor=edge_c,
            linewidth=lw, zorder=5
        )
        ax.add_patch(rect)

        # Subtle mini icon on top-left of node
        if icon:
            ax.text(x + 0.16, y + h - 0.14, icon, ha="center", va="center", fontsize=7.5, color="#64748B", zorder=6)

        # Text inside node
        if line2:
            ax.text(x + w / 2.0, y + h / 2.0 + 0.08, line1, ha="center", va="center",
                    fontsize=8.0, fontweight="bold", color="#0F172A", family=font_main, zorder=6)
            ax.text(x + w / 2.0, y + h / 2.0 - 0.10, line2, ha="center", va="center",
                    fontsize=6.8, color="#475569", family=font_main, zorder=6)
        else:
            ax.text(x + w / 2.0, y + h / 2.0, line1, ha="center", va="center",
                    fontsize=8.0, fontweight="bold", color="#0F172A", family=font_main, zorder=6)

    # Helper: Draw orthogonal (elbow) connector lines with arrows
    def draw_orthogonal_arrow(points, color="#334155", lw=1.0, has_arrow=True):
        xs, ys = zip(*points)
        ax.plot(xs, ys, color=color, linewidth=lw, solid_capstyle="round", zorder=2)
        if has_arrow and len(points) >= 2:
            # Add small arrow at final segment
            x1, y1 = points[-2]
            x2, y2 = points[-1]
            dx = x2 - x1
            dy = y2 - y1
            ax.annotate(
                "", xy=(x2, y2), xytext=(x1 + dx * 0.4, y1 + dy * 0.4),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, mutation_scale=9),
                zorder=3
            )

    # ─────────────────────────────────────────────────────────────────────────
    # 1. TOP-LEFT: CURATED REFERENCE DATABASES & REGISTRIES (Orange Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(0.6, 6.2, 3.2, 3.4, "REF_DB", "Curated Reference Databases")
    
    draw_node(0.8, 7.8, 1.3, 0.55, "Mahabhulekh", "State 7/12 RoR")
    draw_node(2.3, 7.8, 1.3, 0.55, "DILRMP 3.0", "DoLR Standard")
    draw_node(0.8, 6.9, 1.3, 0.55, "CERSAI Portal", "Bank Mortgages")
    draw_node(2.3, 6.9, 1.3, 0.55, "NJDG / RCCMS", "Court Injunctions")
    draw_node(1.55, 6.35, 1.3, 0.5, "NGDRS e-Deeds", "Conveyance Reg")

    # ─────────────────────────────────────────────────────────────────────────
    # 2. TOP-CENTER: INPUT LAYER (Sky Blue) & PREPROCESSING (Blue Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(4.3, 7.2, 2.2, 2.4, "INPUT", "Input Layer")
    draw_node(4.5, 8.25, 1.8, 0.6, "Raw Archival Scans", "7/12, Ferfar, Deeds", is_highlight=True)
    draw_node(4.5, 7.45, 1.8, 0.55, "Citizen Uploads", "PDF / JPEG / PNG")

    draw_cluster(6.9, 7.2, 4.4, 2.4, "PREPROC", "Preprocessing & Vision Pipeline")
    draw_node(7.1, 8.25, 1.9, 0.6, "OpenCV Preprocessing", "Deskew & Denoise")
    draw_node(9.2, 8.25, 1.9, 0.6, "CLAHE 3.5 Contrast", "Faint Ink & Stamp Boost")
    draw_node(7.1, 7.45, 1.9, 0.55, "Orientation Recovery", "90° / 180° / 270° Auto")
    draw_node(9.2, 7.45, 1.9, 0.55, "Table Grid Parser", "Form Cell Isolation")

    # Connect Input -> Preprocessing
    draw_orthogonal_arrow([(6.3, 8.55), (7.1, 8.55)])
    draw_orthogonal_arrow([(9.0, 8.55), (9.2, 8.55)])
    draw_orthogonal_arrow([(8.05, 8.25), (8.05, 8.0)])
    draw_orthogonal_arrow([(9.0, 7.72), (9.2, 7.72)])

    # ─────────────────────────────────────────────────────────────────────────
    # 3. MIDDLE-LEFT: ENTERPRISE INFRASTRUCTURE (Slate Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(0.6, 2.9, 4.2, 3.0, "INFRA", "Enterprise Core & Security Infrastructure")
    draw_node(0.8, 4.95, 1.8, 0.6, "Node.js Express API", "TypeScript Server")
    draw_node(2.8, 4.95, 1.8, 0.6, "RBAC Middleware", "JWT in HTTP-Only")
    draw_node(0.8, 4.15, 1.8, 0.6, "TRAI DLT MSG91", "DLT SMS Gateway")
    draw_node(2.8, 4.15, 1.8, 0.6, "HMAC-SHA256 Email", "Zero-Plaintext OTP")
    draw_node(0.8, 3.2, 1.8, 0.65, "MongoDB 8 Store", "Compound ULPIN Index")
    draw_node(2.8, 3.2, 1.8, 0.65, "Immutable AuditLog", "Tamper-Evident History")

    # Connect Infra internally
    draw_orthogonal_arrow([(2.6, 5.25), (2.8, 5.25)])
    draw_orthogonal_arrow([(2.6, 4.45), (2.8, 4.45)])
    draw_orthogonal_arrow([(1.7, 4.95), (1.7, 4.75)])
    draw_orthogonal_arrow([(3.7, 4.95), (3.7, 4.75)])

    # ─────────────────────────────────────────────────────────────────────────
    # 4. CENTER: AI ENGINE & MULTI-PASS NER (Purple Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(5.2, 3.3, 6.2, 3.5, "AI_ENGINE", "AI Extraction & Entity Engine")
    draw_node(5.4, 5.3, 1.8, 0.7, "Multilingual OCR", "EasyOCR + Tesseract\nMarathi Devanagari")
    draw_node(7.4, 5.3, 1.9, 0.7, "Cadastral NER", "Owner, Survey/Gat #\nArea Ha/Acre, Khata")
    draw_node(9.5, 5.3, 1.7, 0.7, "Multi-Task Outputs", "Confidence Scoring\nAnomaly Gauges")

    draw_node(5.4, 4.1, 1.8, 0.7, "Self-Diagnosis Loop", "Evaluates Character\nDensity & Yield")
    draw_node(7.4, 4.1, 1.9, 0.7, "Consensus Merger", "Best-Confidence Field\nSelection Across Passes")
    draw_node(9.5, 4.1, 1.7, 0.7, "Duplicate Checker", "Cadastral Overlap\nCollision Detection")

    # Connect AI Engine nodes
    draw_orthogonal_arrow([(7.2, 5.65), (7.4, 5.65)])
    draw_orthogonal_arrow([(9.3, 5.65), (9.5, 5.65)])
    draw_orthogonal_arrow([(10.35, 5.3), (10.35, 4.8)])
    draw_orthogonal_arrow([(9.5, 4.45), (9.3, 4.45)])
    draw_orthogonal_arrow([(7.4, 4.45), (7.2, 4.45)])
    draw_orthogonal_arrow([(6.3, 4.8), (6.3, 5.3)])

    # Connect Preprocessing to AI Engine OCR
    draw_orthogonal_arrow([(8.05, 7.2), (8.05, 6.5), (6.3, 6.5), (6.3, 6.0)])

    # ─────────────────────────────────────────────────────────────────────────
    # 5. BOTTOM-CENTER: ACTIVE CONTINUOUS LEARNING & NOVELTY (Rose Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(5.2, 0.6, 6.2, 2.3, "FEEDBACK", "Active Feedback & Continuous Adaptation")
    draw_node(5.4, 1.6, 1.8, 0.6, "Verifier Corrections", "Captures HITL Edits")
    draw_node(7.4, 1.6, 1.9, 0.6, "Dynamic Synonyms", "Live Lexicon Expander")
    draw_node(9.5, 1.6, 1.7, 0.6, "Rule Adaptation", "Zero-Retrain Update")

    draw_node(6.4, 0.8, 3.8, 0.55, "Closed-Loop Feedback: Syncs Verified Landholder Ontologies")

    draw_orthogonal_arrow([(7.2, 1.9), (7.4, 1.9)])
    draw_orthogonal_arrow([(9.3, 1.9), (9.5, 1.9)])
    draw_orthogonal_arrow([(10.35, 1.6), (10.35, 1.05), (10.2, 1.05)])

    # Connect Feedback back to NER
    draw_orthogonal_arrow([(8.35, 2.2), (8.35, 4.1)], color="#BE123C", lw=1.1)

    # ─────────────────────────────────────────────────────────────────────────
    # 6. RIGHT-CENTER: STATUTORY WORKFLOW & 8-LAYER LAND STACK (Teal Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(11.8, 4.8, 5.6, 4.8, "WORKFLOW", "Statutory Workflow & Unified 8-Layer Land Stack")
    
    draw_node(12.0, 8.5, 2.5, 0.6, "Dual-Pane Workstation", "/verification Review Queue")
    draw_node(14.7, 8.5, 2.5, 0.6, "Verifier Sign (DSC-VER)", "First-Tier Legal Inspection")
    draw_node(13.35, 7.6, 2.5, 0.6, "Officer Sanction (DSC-OFF)", "Final Statutory Approval")

    # Connect Workstation -> Verifier -> Officer
    draw_orthogonal_arrow([(14.5, 8.8), (14.7, 8.8)])
    draw_orthogonal_arrow([(15.95, 8.5), (15.95, 7.9), (15.85, 7.9)])

    # 8-Layer Stack Box inside Workflow
    draw_node(12.0, 5.15, 5.2, 2.1, 
              "Unified 8-Layer Land Stack (DILRMP 3.0 • Bhu-Aadhaar ULPIN)", 
              "L1: Vector Map (WGS-84)  |  L2: RoR 7/12 Ownership  |  L3: NGDRS Conveyance\n"
              "L4: Master Zoning  |  L5: Circle Rate Valuation  |  L6: CERSAI Bank Mortgages\n"
              "L7: Court Injunction Freeze Stays  |  L8: Dynamic Mutation Chain (Ferfar)")

    draw_orthogonal_arrow([(14.6, 7.6), (14.6, 7.25)])

    # Connect AI output to Workstation
    draw_orthogonal_arrow([(11.2, 5.65), (11.6, 5.65), (11.6, 8.8), (12.0, 8.8)])

    # ─────────────────────────────────────────────────────────────────────────
    # 7. BOTTOM-RIGHT: USER INTERFACE & DUAL-FACTOR VERIFICATION (Green Cluster)
    # ─────────────────────────────────────────────────────────────────────────
    draw_cluster(11.8, 0.6, 5.6, 3.8, "UI_LAYER", "User Interface & Dual-Factor Verification Layer")
    
    draw_node(12.0, 3.2, 2.5, 0.65, "Citizen Portal (/citizen)", "Apply & Track Mutation")
    draw_node(14.7, 3.2, 2.5, 0.65, "Accessible Mode (/screen-reader)", "GIGW / WCAG 2.1 Vernacular")
    draw_node(12.0, 2.25, 2.5, 0.65, "Public QR (/verify-document)", "3-Tier Verification Engine")
    draw_node(14.7, 2.25, 2.5, 0.65, "Officer Portal (/officer)", "Statutory Sanction Console")

    # Dual Factor Box
    draw_node(12.0, 0.9, 5.2, 1.05,
              "Dual-Factor Physical-Digital Verification Seal",
              "Factor 1: Digital Anchor (Unique Doc ID + Cloud SHA-256 Checksum)\n"
              "Factor 2: Physical Seal (80mm Sticker QR + Secret Security PIN: SEC-XXXX-YYYY)\n"
              "[PASS] Tier 2: Authenticated Match  |  [WARN] Tier 1: Digital Only  |  [ALERT] Tier 3: Tamper")

    # Connect 8-Layer Land Stack to UI & Verification
    draw_orthogonal_arrow([(14.6, 5.15), (14.6, 3.85)])
    draw_orthogonal_arrow([(14.6, 2.25), (14.6, 1.95)])

    # Connect Ref DB to Preprocessing & Stack
    draw_orthogonal_arrow([(3.8, 8.05), (4.3, 8.05), (4.3, 6.9), (7.1, 6.9)])

    # Connect Workstation corrections down to feedback loop
    draw_orthogonal_arrow([(12.0, 8.5), (11.5, 8.5), (11.5, 1.9), (11.2, 1.9)], color="#BE123C", lw=1.0)

    # ─────────────────────────────────────────────────────────────────────────
    # 8. TITLE WITH YELLOW HIGHLIGHTER MARKER (Signature Draw.io Style)
    # ─────────────────────────────────────────────────────────────────────────
    # Yellow highlighter rectangle behind text
    highlight_x = 1.0
    highlight_y = 9.4
    highlight_w = 4.4
    highlight_h = 0.52
    
    hl_patch = patches.FancyBboxPatch(
        (highlight_x, highlight_y), highlight_w, highlight_h,
        boxstyle="round,pad=0.06,rounding_size=0.1",
        facecolor="#FDE047", edgecolor="none", # Vibrant yellow marker
        alpha=0.9, zorder=7
    )
    ax.add_patch(hl_patch)

    ax.text(highlight_x + highlight_w / 2.0, highlight_y + highlight_h / 2.0, 
            "System Architecture", ha="center", va="center", 
            fontsize=19, fontweight="bold", color="#0F172A", family=font_main, zorder=8)

    # Subtitle
    ax.text(highlight_x + highlight_w + 0.3, highlight_y + highlight_h / 2.0, 
            "— ILRDVS Full-Stack Pipeline & Interoperability Model", ha="left", va="center",
            fontsize=12, fontweight="bold", color="#475569", family=font_main, zorder=8)

    # Clean axes
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10.125)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor="#FFFFFF", edgecolor="none")
    plt.close()
    print(f"Draw.io style architecture diagram successfully built: {output_path}")

if __name__ == "__main__":
    build_drawio_style_architecture()
