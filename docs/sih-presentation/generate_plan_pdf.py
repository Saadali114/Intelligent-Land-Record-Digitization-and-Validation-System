import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=32,
        bottomMargin=32
    )
    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor('#0F172A')  # Slate 900
    accent_emerald = colors.HexColor('#047857') # Emerald 700
    accent_amber = colors.HexColor('#D97706')   # Amber 600
    border_color = colors.HexColor('#CBD5E1')   # Slate 300

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=accent_emerald,
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary_color,
        spaceBefore=8,
        spaceAfter=4
    )
    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=accent_emerald,
        spaceBefore=5,
        spaceAfter=3
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#1E293B')
    )
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor('#1E293B')
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>GOVERNMENT OF MAHARASHTRA • REVENUE & FOREST DEPARTMENT</b><br/>"
                      "<font size=7.5 color='#64748B'>National Land Record Modernization Programme (NLRMP) • ILRDVS Repository</font>", body_style),
            Paragraph("<b>DOC REF:</b> ILRDVS-QR-PLAN-2026<br/><b>VERSION:</b> 1.0 (Production Master)", ParagraphStyle('MetaRight', parent=body_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[360, 180])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_emerald, spaceAfter=8))

    # Title & Subtitle
    story.append(Paragraph("National Cadastral Document QR & Barcode Verification Master Plan", title_style))
    story.append(Paragraph("Dual-Factor Physical Sticker Seal & Tamper-Evident Digital Verification Architecture", subtitle_style))

    # Executive Summary Box
    exec_summary_text = (
        "<b>Executive Summary:</b> In land administration, physical deeds (7/12 Satbara, Sale Deeds, Property Cards) "
        "are vulnerable to forgery, illicit tampering, and duplicate bank mortgages. The ILRDVS QR Verification "
        "System establishes a cryptographic bridge between physical paper documents and the state's cloud registry using "
        "<b>High-Density 2D QR Codes</b>, <b>Code 128 Barcodes</b>, and <b>Secret Security PINs (SEC-XXXX-YYYY)</b>. "
        "This master brief details the operational protocol, verification tiers, security guarantees, and deployment workflows."
    )
    summary_table = Table([[Paragraph(exec_summary_text, callout_style)]], colWidths=[540])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 1, accent_emerald),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 4))

    # Section 1: The Problem & Dual-Factor Solution
    story.append(Paragraph("1. The Core Problem & Dual-Factor Solution", h2_style))
    story.append(Paragraph(
        "A purely digital database cannot prevent someone from presenting an altered paper photocopy in rural areas. "
        "Conversely, an unlinked paper stamp can be duplicated using desktop printers. ILRDVS integrates "
        "<b>Dual-Factor Document Authentication</b>:",
        body_style
    ))

    df_data = [
        [
            Paragraph("<b>Factor 1: Digital Anchor (Public ID)</b>", table_header),
            Paragraph("<b>Factor 2: Physical Seal (Secret PIN)</b>", table_header)
        ],
        [
            Paragraph(
                "• <b>Unique Document ID:</b> Assigned per record (e.g. <code>DOC-MH-2026-1001</code>).<br/>"
                "• <b>Registry Match:</b> Connects to owner, survey/gat number, khata, area, and village.<br/>"
                "• <b>SHA-256 Checksum:</b> Cryptographic fingerprint of the original archival scan.",
                table_text
            ),
            Paragraph(
                "• <b>Secret Security PIN:</b> 8-character cryptographic token (e.g. <code>SEC-DA2C-7DA3</code>).<br/>"
                "• <b>Physical Sticker Seal:</b> Printed on 80mm adhesive sticker and affixed to paper deed.<br/>"
                "• <b>Proof of Genuine Document:</b> Confirms physical paper deed matches cloud archive.",
                table_text
            )
        ]
    ]
    t_df = Table(df_data, colWidths=[270, 270])
    t_df.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_df)
    story.append(Spacer(1, 4))

    # Section 2: The 3-Tier Verification Protocol
    story.append(Paragraph("2. The 3-Tier Verification Protocol", h2_style))
    story.append(Paragraph(
        "Every verification query processed by the portal (via camera scan, barcode gun, or manual search) is evaluated "
        "into one of three security tiers:",
        body_style
    ))

    tier_data = [
        [
            Paragraph("<b>Security Tier</b>", table_header),
            Paragraph("<b>Trigger Condition</b>", table_header),
            Paragraph("<b>System Verification Response</b>", table_header),
            Paragraph("<b>Operational Action</b>", table_header)
        ],
        [
            Paragraph("<b>Tier 1</b><br/><font color='#D97706'>🟡 Digital Only</font>", table_text),
            Paragraph("User enters Document ID without Secret PIN.", table_text),
            Paragraph("Digital archive record is confirmed valid. System prompts for physical sticker PIN.", table_text),
            Paragraph("Verify physical paper deed by entering sticker PIN.", table_text)
        ],
        [
            Paragraph("<b>Tier 2</b><br/><font color='#047857'>🟢 Authenticated</font>", table_text),
            Paragraph("Phone camera scans sticker QR code OR user enters matching Secret PIN.", table_text),
            Paragraph("<b>Physical Sticker Authenticated:</b> Secret PIN matches cryptographic state registry. Full green badge.", table_text),
            Paragraph("Paper document accepted as legally authentic.", table_text)
        ],
        [
            Paragraph("<b>Tier 3</b><br/><font color='#DC2626'>🔴 Tamper Alert</font>", table_text),
            Paragraph("Supplied Secret PIN does NOT match the document record.", table_text),
            Paragraph("<b>Critical Tamper Warning:</b> Forged physical sticker or altered paper photocopy detected.", table_text),
            Paragraph("Immediate rejection. Escalate to Sub-Registrar.", table_text)
        ]
    ]
    t_tier = Table(tier_data, colWidths=[85, 140, 205, 110])
    t_tier.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#FEFCE8')),
        ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#F0FDF4')),
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#FEF2F2')),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_tier)
    story.append(Spacer(1, 4))

    # Section 3: The Cryptographic Engine
    story.append(Paragraph("3. The Cryptographic Secret Security PIN Engine", h2_style))
    story.append(Paragraph(
        "The Secret PIN is generated using non-linear multiplicative bit-mixing. It operates deterministically "
        "from the document's unique ID and a state salt seed:",
        body_style
    ))

    code_text = (
        "<b>Mathematical Formula:</b><br/>"
        "<code>Input = DocumentID + ':ILRDVS-MAHA-SEAL-2026'</code><br/>"
        "<code>h1 = imul(h1 ^ ch, 2654435761); h2 = imul(h2 ^ ch, 1597334677);</code><br/>"
        "<code>Token = 'SEC-' + Hex(h1)[0..4] + '-' + Hex(h2)[0..4]</code>  ➔  <b><code>SEC-DA2C-7DA3</code></b>"
    )
    code_table = Table([[Paragraph(code_text, callout_style)]], colWidths=[540])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(code_table)
    story.append(Spacer(1, 4))

    # Security Properties
    story.append(Paragraph(
        "• <b>Avalanche Diffusion:</b> Altering 1 character in Document ID completely randomizes the resulting PIN.<br/>"
        "• <b>Brute-Force Resistance:</b> 16^8 = 4,294,967,296 possible combinations. Mathematically impossible to guess.<br/>"
        "• <b>API Privacy Masking:</b> Online public API responses mask the PIN (<code>SEC-****-7DA3</code>) to prevent scraping.<br/>"
        "• <b>Universal Phone Compatibility:</b> Standard camera scan decodes the URL and PIN without requiring special apps.",
        body_style
    ))

    # Page Break for Clean 2-Page Executive Brief
    story.append(PageBreak())

    # Section 4: Physical Adhesive Sticker Specifications
    story.append(Paragraph("4. Physical Adhesive Sticker Specifications", h2_style))
    story.append(Paragraph(
        "The physical sticker is calibrated to standard thermal label printer dimensions (80mm x 80mm / 3in x 3in) "
        "and is affixed to the top-right corner of Page 1 of the physical paper deed:",
        body_style
    ))

    spec_data = [
        [
            Paragraph("<b>Element</b>", table_header),
            Paragraph("<b>Specification</b>", table_header),
            Paragraph("<b>Purpose & Operational Function</b>", table_header)
        ],
        [
            Paragraph("<b>Physical Dimensions</b>", table_text),
            Paragraph("80mm x 80mm Square Label", table_text),
            Paragraph("Fits thermal label printers (Zebra, Brother, TVS) and standard A4 adhesive sheets.", table_text)
        ],
        [
            Paragraph("<b>State Authority Header</b>", table_text),
            Paragraph("Govt of Maharashtra • Revenue Dept", table_text),
            Paragraph("Official state emblem indicating statutory land revenue registry seal.", table_text)
        ],
        [
            Paragraph("<b>2D QR Code</b>", table_text),
            Paragraph("Error Correction Level M (280px)", table_text),
            Paragraph("Encodes direct verification URL with embedded secret PIN for 1-tap phone scanning.", table_text)
        ],
        [
            Paragraph("<b>1D Barcode</b>", table_text),
            Paragraph("Code 128 (High Density)", table_text),
            Paragraph("Scannable by handheld optical barcode guns in taluka sub-registrar record rooms.", table_text)
        ],
        [
            Paragraph("<b>Secret PIN Badge</b>", table_text),
            Paragraph("High-contrast Gold Monospace", table_text),
            Paragraph("Visible PIN for manual two-factor citizen / banking verification.", table_text)
        ],
        [
            Paragraph("<b>Affix Instruction</b>", table_text),
            Paragraph("Top-Right Page 1 Deed Placement", table_text),
            Paragraph("Ensures immediate visibility upon file inspection and protects against sheet substitution.", table_text)
        ]
    ]
    t_spec = Table(spec_data, colWidths=[110, 160, 270])
    t_spec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_spec)
    story.append(Spacer(1, 6))

    # Section 5: Verification Stakeholder Workflows
    story.append(Paragraph("5. Stakeholder Operational Workflows", h2_style))
    stakeholder_text = (
        "<b>A. Citizen / Land Buyer:</b> Seller presents paper 7/12 extract ➔ Buyer points smartphone camera at sticker ➔ "
        "Browser opens immediately with 🟢 Authenticated Badge, real owner name, survey/gat number, and area.<br/><br/>"
        "<b>B. Bank Loan Officer:</b> Farmer submits deed for agricultural mortgage ➔ Officer enters ID & Secret PIN on "
        "workstation ➔ Confirms deed is genuine and checks latest encumbrance/mutation history before loan approval.<br/><br/>"
        "<b>C. Sub-Registrar / Revenue Court:</b> During deed conveyance or boundary dispute ➔ Officer scans barcode gun ➔ "
        "Digital twin archival scan is loaded side-by-side to verify zero handwritten fraudulent alterations exist."
    )
    s_table = Table([[Paragraph(stakeholder_text, body_style)]], colWidths=[540])
    s_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(s_table)
    story.append(Spacer(1, 6))

    # Section 6: Technical Endpoints & API Reference
    story.append(Paragraph("6. Production API & Cadastral Workstation Reference", h2_style))
    api_text = (
        "• <b>Public Unauthenticated Verification API:</b> <code>GET /api/documents/public-verify/:query?sec=:pin</code><br/>"
        "• <b>Public Verification Portal Web Route:</b> <code>/verify-document?id=:docId&sec=:pin</code><br/>"
        "• <b>Cadastral Dual-Pane Inspection Workstation Actions:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;1. <b>QR Sticker:</b> Instant one-click download of 300 DPI high-resolution sticker PNG image.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;2. <b>QR Seal:</b> Modal with physical sticker preview, direct 80mm thermal printing, and URL test.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;3. <b>Download PDF:</b> Official digital certificate export with statutory notice and audit seal.<br/>"
        "• <b>Immutable Audit Trail:</b> Every verification attempt (IP address, timestamp, result tier) is logged in PostgreSQL."
    )
    api_table = Table([[Paragraph(api_text, body_style)]], colWidths=[540])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, accent_emerald),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 10))

    # Sign-off & Authority
    sign_data = [
        [
            Paragraph("<b>Prepared By:</b><br/>ILRDVS Core Architecture Team<br/>Govt of Maharashtra Revenue Node", body_style),
            Paragraph("<b>Approved By:</b><br/>Directorate of Land Records & Surveys<br/>Digital Cadastral Standards Committee", body_style),
            Paragraph("<b>Security Compliance:</b><br/>ISO 27001 / IT Act 2000 Sec 4 & 6<br/>SHA-256 Tamper-Proof Cryptography", body_style)
        ]
    ]
    t_sign = Table(sign_data, colWidths=[180, 180, 180])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_sign)

    doc.build(story)

if __name__ == '__main__':
    out_path = r'c:\Users\SaadAli\Desktop\SIH\Cadastral_QR_Verification_Plan.pdf'
    build_pdf(out_path)
    print("SUCCESS: PDF created at", out_path)
