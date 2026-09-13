import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

def create_simplified_image(output_path="simplified_system_architecture.png"):
    # 16:9 Widescreen aspect ratio (16 x 9 inches @ 220 DPI = 3520 x 1980 px)
    fig, ax = plt.subplots(figsize=(16, 9), dpi=220)
    fig.patch.set_facecolor("#F8FAFC")
    ax.set_facecolor("#F8FAFC")

    font_main = "sans-serif"

    # Top Title
    ax.text(8.0, 8.55, "ILRDVS — SIMPLIFIED SYSTEM ARCHITECTURE", 
            ha="center", va="center", fontsize=17, fontweight="bold", color="#0F172A", family=font_main)
    ax.text(8.0, 8.25, "Clear 5-Tier Pipeline: Citizen Ingestion ➔ AI Extraction ➔ Officer Sanction ➔ Secure QR", 
            ha="center", va="center", fontsize=10.5, color="#475569", family=font_main)

    TIER_COLORS = [
        {"ribbon": "#1E3A8A", "border": "#3B82F6", "bg": "#EFF6FF", "arrow": "#3B82F6", "text_title": "#1E3A8A"},
        {"ribbon": "#0284C7", "border": "#0EA5E9", "bg": "#F0F9FF", "arrow": "#0EA5E9", "text_title": "#0284C7"},
        {"ribbon": "#047857", "border": "#10B981", "bg": "#ECFDF5", "arrow": "#10B981", "text_title": "#047857"},
        {"ribbon": "#D97706", "border": "#F59E0B", "bg": "#FFFBEB", "arrow": "#F59E0B", "text_title": "#D97706"},
        {"ribbon": "#7C3AED", "border": "#A855F7", "bg": "#FAF5FF", "arrow": "#A855F7", "text_title": "#7C3AED"},
    ]

    tiers_data = [
        {
            "num": "1", "name": "USER / CLIENT", "tech": "Next.js 14",
            "cards": [
                ("Citizen Portal (/citizen)", "Mobile OTP Login • Deed Upload • Tracking"),
                ("Officer Console (/officer)", "Verification Queue • Statutory Inspection"),
                ("Public QR Verify (/verify)", "Instant 3-Tier Document Authenticity Check")
            ]
        },
        {
            "num": "2", "name": "API & SECURITY", "tech": "Node.js + Express",
            "cards": [
                ("REST APIs & Router", "Modular Endpoints • Centralized Request Gateway"),
                ("RBAC & Multi-Factor Auth", "JWT Cookies • DLT SMS (MSG91) • HMAC Email OTP"),
                ("Zod Guards & Multer Ingest", "Strict Schema Validation • Scanned File Vault")
            ]
        },
        {
            "num": "3", "name": "AI PIPELINE", "tech": "Python FastAPI",
            "cards": [
                ("OpenCV Vision", "CLAHE 3.5 Contrast Boost • Faint Ink Rescue"),
                ("Multilingual OCR", "EasyOCR + Tesseract (Marathi Devanagari + Eng)"),
                ("Cadastral NER Extractor", "Extracts Owner, Survey/Gat #, Khata, Area")
            ]
        },
        {
            "num": "4", "name": "REVIEW & STORE", "tech": "HITL + MongoDB 8",
            "cards": [
                ("Split-Screen Workstation", "Original Scan vs AI Extracted Entities Review"),
                ("Statutory Officer Sign", "Dual Digital Signatures (DSC-VER & DSC-OFF)"),
                ("MongoDB 8 Persistence", "LandRecords (ULPIN-Indexed) + AuditLog")
            ]
        },
        {
            "num": "5", "name": "SECURE SEAL", "tech": "QR + Cryptography",
            "cards": [
                ("Digital Cloud Anchor", "Unique Doc ID (DOC-MH-2026-XXXX) + SHA-256 Hash"),
                ("+ Physical Sticker Seal", "80mm Tamper-Evident Adhesive Sticker + Secret PIN"),
                ("-> 3-Tier Outcome", "[PASS] Valid Match | [WARN] Digital | [ALERT] Tamper")
            ]
        }
    ]

    start_y = 6.95
    tier_height = 1.05
    gap_y = 0.32
    tier_width = 14.4
    ribbon_width = 2.8

    for i, tdata in enumerate(tiers_data):
        y_pos = start_y - i * (tier_height + gap_y)
        cfg = TIER_COLORS[i]

        # 1. Outer Card
        outer_card = patches.FancyBboxPatch(
            (0.8, y_pos), tier_width, tier_height,
            boxstyle="round,pad=0.04,rounding_size=0.12",
            facecolor=cfg["bg"], edgecolor=cfg["border"],
            linewidth=1.3, zorder=2
        )
        ax.add_patch(outer_card)

        # 2. Left Ribbon Header
        ribbon = patches.FancyBboxPatch(
            (0.8, y_pos), ribbon_width, tier_height,
            boxstyle="round,pad=0.04,rounding_size=0.12",
            facecolor=cfg["ribbon"], edgecolor="none", zorder=3
        )
        ax.add_patch(ribbon)
        # Flatten right edge of ribbon
        rect_edge = patches.Rectangle((0.8 + ribbon_width - 0.2, y_pos), 0.2, tier_height, facecolor=cfg["ribbon"], edgecolor="none", zorder=3)
        ax.add_patch(rect_edge)

        ax.text(0.8 + ribbon_width/2.0, y_pos + tier_height/2.0 + 0.12, f"{tdata['num']}. {tdata['name']}",
                ha="center", va="center", fontsize=10.5, fontweight="bold", color="#FFFFFF", family=font_main, zorder=4)
        ax.text(0.8 + ribbon_width/2.0, y_pos + tier_height/2.0 - 0.14, tdata["tech"],
                ha="center", va="center", fontsize=8.2, color="#E2E8F0", family=font_main, zorder=4)

        # 3. Three Clean Inner Cards
        pill_start_x = 3.9
        pill_gap = 0.22
        pill_width = 3.55
        pill_height = 0.78
        pill_y = y_pos + 0.135

        for c_idx, (card_title, card_sub) in enumerate(tdata["cards"]):
            cx = pill_start_x + c_idx * (pill_width + pill_gap)
            pill = patches.FancyBboxPatch(
                (cx, pill_y), pill_width, pill_height,
                boxstyle="round,pad=0.03,rounding_size=0.08",
                facecolor="#FFFFFF", edgecolor=cfg["border"],
                linewidth=1.0, zorder=4
            )
            ax.add_patch(pill)

            ax.text(cx + pill_width/2.0, pill_y + pill_height/2.0 + 0.10, card_title,
                    ha="center", va="center", fontsize=9.2, fontweight="bold", color=cfg["text_title"], family=font_main, zorder=5)
            ax.text(cx + pill_width/2.0, pill_y + pill_height/2.0 - 0.12, card_sub,
                    ha="center", va="center", fontsize=7.2, color="#475569", family=font_main, zorder=5)

        # 4. Downward Connecting Arrow
        if i < len(tiers_data) - 1:
            arr_y = y_pos - 0.05
            ax.annotate(
                "", xy=(8.0, arr_y - gap_y + 0.08), xytext=(8.0, arr_y),
                arrowprops=dict(arrowstyle="-|>", color=cfg["arrow"], lw=2.0, shrinkA=1, shrinkB=1, mutation_scale=11),
                zorder=6
            )

    # Clean borders
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=220, bbox_inches="tight", facecolor="#F8FAFC", edgecolor="none")
    plt.close()
    print(f"Simplified architecture image saved to: {output_path}")

if __name__ == "__main__":
    create_simplified_image()
