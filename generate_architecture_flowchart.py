import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image

def build_architecture_flowchart(output_path="system_architecture_flowchart.png"):
    # 16:9 Widescreen aspect ratio (16x9 inches @ 200 DPI = 3200x1800 px)
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    fig.patch.set_facecolor("#0B1120") # Deep Midnight Slate
    ax.set_facecolor("#0B1120")

    # Title Banner
    ax.text(8.0, 8.6, "ILRDVS — COMPLETE SYSTEM ARCHITECTURE & DATA FLOW", 
            ha="center", va="center", fontsize=18, fontweight="bold", color="#F8FAFC", family="sans-serif")
    ax.text(8.0, 8.25, "AI-Powered Digitization • Human-in-the-Loop Approval • 8-Layer Land Stack (DILRMP 3.0) • Dual-Factor QR", 
            ha="center", va="center", fontsize=11, color="#38BDF8", family="sans-serif")

    # Helper function to draw rounded container cards
    def draw_card(x, y, w, h, bg_color, border_color, title, title_color="#FFFFFF", border_width=1.5):
        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.08,rounding_size=0.15",
            facecolor=bg_color, edgecolor=border_color,
            linewidth=border_width, zorder=1
        )
        ax.add_patch(rect)
        if title:
            ax.text(x + w/2.0, y + h - 0.22, title, 
                    ha="center", va="center", fontsize=10.5, fontweight="bold", 
                    color=title_color, family="sans-serif", zorder=3)

    # Helper function for mini inner modules
    def draw_box(x, y, w, h, bg_color, border_color, main_text, sub_text=None, text_color="#FFFFFF", font_size=8.5):
        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.04,rounding_size=0.08",
            facecolor=bg_color, edgecolor=border_color,
            linewidth=1.0, zorder=2
        )
        ax.add_patch(rect)
        if sub_text:
            ax.text(x + w/2.0, y + h/2.0 + 0.08, main_text, 
                    ha="center", va="center", fontsize=font_size, fontweight="bold", 
                    color=text_color, family="sans-serif", zorder=3)
            ax.text(x + w/2.0, y + h/2.0 - 0.1, sub_text, 
                    ha="center", va="center", fontsize=font_size - 1.5, 
                    color="#94A3B8", family="sans-serif", zorder=3)
        else:
            ax.text(x + w/2.0, y + h/2.0, main_text, 
                    ha="center", va="center", fontsize=font_size, fontweight="bold", 
                    color=text_color, family="sans-serif", zorder=3)

    def draw_arrow(x1, y1, x2, y2, color="#38BDF8", text=None, text_offset=(0, 0.12)):
        ax.annotate(
            "", xy=(x2, y2), xytext=(x1, y1),
            arrowprops=dict(
                arrowstyle="-|>", color=color, lw=1.8,
                shrinkA=3, shrinkB=3, mutation_scale=14
            ), zorder=4
        )
        if text:
            mid_x = (x1 + x2) / 2.0 + text_offset[0]
            mid_y = (y1 + y2) / 2.0 + text_offset[1]
            ax.text(mid_x, mid_y, text, ha="center", va="center", fontsize=7.5, 
                    fontweight="bold", color=color, zorder=5,
                    bbox=dict(boxstyle="round,pad=0.2", facecolor="#0F172A", edgecolor="none", alpha=0.9))

    # =========================================================================
    # ROW 1 (TOP): CLIENT TIER (Left) -> API GATEWAY TIER (Right)
    # =========================================================================
    
    # Tier 1: Client Interfaces
    draw_card(0.6, 5.2, 4.4, 2.7, "#1E293B", "#3B82F6", "1. CLIENT PORTALS (Next.js 14)", "#93C5FD")
    draw_box(0.8, 6.9, 1.9, 0.55, "#0F172A", "#475569", "Citizen Portal", "/citizen • Self-Service")
    draw_box(2.9, 6.9, 1.9, 0.55, "#0F172A", "#475569", "Verifier Workstation", "/verification • Dual-Pane")
    draw_box(0.8, 6.15, 1.9, 0.55, "#0F172A", "#475569", "Officer Portal", "/officer • Legal Sanction")
    draw_box(2.9, 6.15, 1.9, 0.55, "#0F172A", "#475569", "Public QR Verifier", "/verify-document")
    draw_box(0.8, 5.4, 4.0, 0.55, "#0F172A", "#475569", "GIGW Screen-Reader Mode (/screen-reader)", "Multilingual: Marathi • Hindi • English")

    # Arrow Tier 1 -> Tier 2
    draw_arrow(5.0, 6.55, 5.8, 6.55, "#38BDF8", "REST / JWT")

    # Tier 2: API Gateway & Security
    draw_card(5.8, 5.2, 4.4, 2.7, "#1E293B", "#10B981", "2. API GATEWAY & SECURITY (Node.js)", "#6EE7B7")
    draw_box(6.0, 6.9, 4.0, 0.55, "#0F172A", "#334155", "Auth & RBAC Middleware", "JWT in HTTP-Only Cookies • Role Guard")
    draw_box(6.0, 6.15, 4.0, 0.55, "#0F172A", "#334155", "Multi-Factor OTP Verification", "TRAI DLT MSG91 SMS + HMAC-SHA256 Email")
    draw_box(6.0, 5.4, 1.9, 0.55, "#0F172A", "#334155", "Zod Validation", "Schema Type Guard")
    draw_box(8.1, 5.4, 1.9, 0.55, "#0F172A", "#334155", "Multer Ingestion", "MIME & Checksum")

    # Arrow Tier 2 -> Database (Direct Down/Right)
    draw_arrow(10.2, 6.55, 11.0, 6.55, "#F59E0B", "Persist")

    # Tier 4: Enterprise Storage (Right Top)
    draw_card(11.0, 5.2, 4.4, 2.7, "#1E293B", "#F59E0B", "3. PERSISTENCE (MongoDB 8)", "#FCD34D")
    draw_box(11.2, 6.9, 4.0, 0.55, "#0F172A", "#78350F", "LandRecords Collection", "Compound Indexed on ULPIN & Survey #")
    draw_box(11.2, 6.15, 4.0, 0.55, "#0F172A", "#78350F", "Immutable AuditLog", "Every Inspection, Remark & Signature")
    draw_box(11.2, 5.4, 1.9, 0.55, "#0F172A", "#78350F", "Document Vault", "SHA-256 Checksums")
    draw_box(13.3, 5.4, 1.9, 0.55, "#0F172A", "#78350F", "OTP Store", "TTL Auto-Pruning")

    # =========================================================================
    # ROW 2 (MIDDLE): ADAPTIVE AI PIPELINE
    # =========================================================================
    
    # Vertical Arrow from Ingestion to AI
    draw_arrow(8.0, 5.2, 8.0, 4.5, "#10B981", "Raw Deeds")

    draw_card(0.6, 2.7, 14.8, 1.8, "#0F172A", "#10B981", "4. ADAPTIVE SELF-CORRECTING AI PIPELINE (Python FastAPI + EasyOCR + OpenCV)", "#34D399")
    
    # Step 1: Preprocessing
    draw_box(0.9, 2.9, 2.6, 1.05, "#1E293B", "#065F46", "OpenCV Preprocessing", "• Deskewing & Binarization\n• CLAHE 3.5 Contrast Boost\n• 90°/180° Orientation Fix")
    draw_arrow(3.5, 3.42, 4.0, 3.42, "#34D399")

    # Step 2: Multilingual OCR
    draw_box(4.0, 2.9, 2.4, 1.05, "#1E293B", "#065F46", "Multilingual OCR", "• EasyOCR + Tesseract\n• Devanagari (Marathi/Hindi)\n• Latin (English Deeds)")
    draw_arrow(6.4, 3.42, 6.9, 3.42, "#34D399")

    # Step 3: Cadastral NER
    draw_box(6.9, 2.9, 2.6, 1.05, "#1E293B", "#065F46", "Cadastral Entity NER", "• Owner Name & Khata #\n• Survey / Gat Number\n• Area (Hectares / Acres)")
    draw_arrow(9.5, 3.42, 10.0, 3.42, "#34D399")

    # Step 4: Self-Diagnosis & Adaptive Shifts
    draw_box(10.0, 2.9, 2.6, 1.05, "#1E293B", "#065F46", "Self-Diagnosis Loop", "• Flags Missing Core Entities\n• Multi-Pass Consensus Merge\n• Table Grid Parser")
    draw_arrow(12.6, 3.42, 13.1, 3.42, "#34D399")

    # Step 5: Active Feedback
    draw_box(13.1, 2.9, 2.0, 1.05, "#1E293B", "#065F46", "Active Learning", "• Human Correction Sync\n• Live Synonym Lexicon\n• Zero Retrain Delay")

    # Feedback loop arrow backwards
    ax.annotate(
        "", xy=(7.0, 3.95), xytext=(14.1, 3.95),
        arrowprops=dict(arrowstyle="-|>", color="#F59E0B", lw=1.2, ls="--", shrinkA=2, shrinkB=2, mutation_scale=10),
        zorder=4
    )
    ax.text(10.5, 4.05, "Dynamic Feedback Loop: Human Corrections Update NER Synonym Registry", 
            ha="center", va="center", fontsize=7, color="#FCD34D", zorder=5)

    # =========================================================================
    # ROW 3 (BOTTOM): 8-LAYER LAND STACK (Left) -> DUAL-FACTOR QR VERIFICATION (Right)
    # =========================================================================
    
    # Arrow AI -> 8-Layer Land Stack
    draw_arrow(4.0, 2.7, 4.0, 2.1, "#8B5CF6", "Approved Metadata")

    # 8-Layer Land Stack Card
    draw_card(0.6, 0.3, 8.8, 1.8, "#1E1B4B", "#8B5CF6", "5. UNIFIED 8-LAYER LAND STACK (DILRMP 3.0 • Bhu-Aadhaar ULPIN)", "#C4B5FD")
    
    layer_data = [
        ("L1: Cadastral Map", "WGS-84 Polygons"),
        ("L2: RoR (7/12 & 8A)", "Ownership Titles"),
        ("L3: Conveyance", "NGDRS e-Deeds"),
        ("L4: Master Zoning", "Residential/Agri"),
        ("L5: Circle Rate", "Auto Tax Valuation"),
        ("L6: Mortgages", "CERSAI / Bank Sync"),
        ("L7: Court Injunctions", "NJDG Dispute Freeze"),
        ("L8: Dynamic Mutation", "Ferfar Chain")
    ]
    for i, (l_name, l_sub) in enumerate(layer_data):
        col = i % 4
        row = i // 4
        bx = 0.85 + col * 2.1
        by = 1.15 - row * 0.55
        draw_box(bx, by, 1.95, 0.48, "#0F172A", "#4338CA", l_name, l_sub, "#E0E7FF", font_size=7.5)

    # Arrow Stack -> Dual Factor Verification
    draw_arrow(9.4, 1.2, 10.1, 1.2, "#EC4899", "Tamper Lock")

    # Dual-Factor QR Verification
    draw_card(10.1, 0.3, 5.3, 1.8, "#3B0764", "#EC4899", "6. DUAL-FACTOR QR VERIFICATION ENGINE", "#F472B6")
    draw_box(10.3, 1.15, 2.35, 0.5, "#0F172A", "#9D174D", "Factor 1: Digital Anchor", "Unique Doc ID + SHA-256 Hash", "#FCE7F3", 7.5)
    draw_box(12.8, 1.15, 2.4, 0.5, "#0F172A", "#9D174D", "Factor 2: Physical Seal", "QR + Secret PIN (SEC-XXXX-YYYY)", "#FCE7F3", 7.5)

    draw_box(10.3, 0.5, 4.9, 0.55, "#0F172A", "#831843", "3-Tier Verification Result (/verify-document)", "[PASS] Tier 2: Authenticated Match  |  [WARN] Tier 1: Digital Only  |  [ALERT] Tier 3: Tamper", "#FBCFE8", 7.5)

    # Set axes limits and clean up
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close()
    print(f"Flowchart generated successfully: {output_path}")

if __name__ == "__main__":
    build_architecture_flowchart()
