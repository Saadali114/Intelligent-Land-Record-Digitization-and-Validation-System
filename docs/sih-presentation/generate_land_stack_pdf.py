import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header line & text on pages after cover
        if self._pageNumber > 1:
            self.drawString(54, A4[1] - 36, "Digital India Land Records Modernization Programme (DILRMP 3.0)")
            self.drawRightString(A4[0] - 54, A4[1] - 36, "Operational Guidelines (2026–2031)")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, A4[1] - 42, A4[0] - 54, A4[1] - 42)

        # Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, A4[0] - 54, 45)
        
        footer_text = "Government of India • Ministry of Rural Development • Department of Land Resources (DoLR)"
        self.drawString(54, 32, footer_text)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 54, 32, page_str)
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=44,
        rightMargin=44,
        topMargin=52,
        bottomMargin=52,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    c_primary = colors.HexColor("#0f172a")    # Slate 900
    c_secondary = colors.HexColor("#1e3a8a")  # Blue 900
    c_emerald = colors.HexColor("#065f46")    # Emerald 800
    c_gold = colors.HexColor("#b45309")       # Amber 700

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12,
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_secondary,
        spaceBefore=12,
        spaceAfter=6,
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=6,
        spaceAfter=3,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#1e3a8a"),
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
    )

    table_cell_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a"),
    )

    story = []

    # ─────────────────────────────────────────────────────────────
    # TITLE BLOCK & METADATA BADGE
    # ─────────────────────────────────────────────────────────────
    badge_data = [
        [
            Paragraph("<b>GOVERNMENT OF INDIA</b> • Ministry of Rural Development", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#065f46"))),
            Paragraph("<b>DoLR Standard:</b> DILRMP 3.0 (2026–2031)", ParagraphStyle('B2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#1e3a8a"), alignment=2))
        ]
    ]
    t_badge = Table(badge_data, colWidths=[310, 195])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_badge)
    story.append(Spacer(1, 8))

    story.append(Paragraph("The 8-Layer Land Stack Architecture", title_style))
    story.append(Paragraph("Technical Specification & Implementation Guide for 14-Digit Bhu-Aadhaar (ULPIN) Integration", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f172a"), spaceBefore=0, spaceAfter=10))

    # ─────────────────────────────────────────────────────────────
    # SECTION 1: EXECUTIVE SUMMARY
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("1. Executive Summary", h1_style))
    
    exec_summary_text = (
        "Under the <b>Digital India Land Records Modernization Programme (DILRMP) 3.0 Operational Guidelines "
        "(2026–2031)</b>, the Department of Land Resources (DoLR) establishes the <b>8-Layer Land Stack</b> as India's "
        "unified digital geospatial and institutional standard for land administration. Historically, land data was "
        "fragmented across isolated silos: Revenue Departments maintained Record of Rights (7/12 & 8A extracts), "
        "Survey offices held cadastral maps, Sub-Registrar Offices (SROs) registered conveyance deeds, commercial "
        "banks independently sanctioned crop/mortgage loans, and Revenue Courts litigated boundary disputes without "
        "mutual visibility."
    )
    story.append(Paragraph(exec_summary_text, body_style))

    exec_summary_text_2 = (
        "The 8-Layer Land Stack unifies these divergent registries into a single cohesive, multi-tier geospatial model "
        "anchored by a <b>14-character alphanumeric Bhu-Aadhaar (Unique Land Parcel Identification Number - ULPIN)</b>, "
        "such as <code>81LVQLD9407JH0</code>. Every parcel of land in India is assigned a deterministic spatial identifier "
        "derived from its regional grid code, centroid latitude/longitude, and survey boundaries. By stacking spatial, "
        "legal, financial, and planning dimensions together, the framework guarantees <b>tamper-evident title verification, "
        "instantaneous mutation, complete prevention of multiple-mortgage fraud, and automated circle rate valuation</b>."
    )
    story.append(Paragraph(exec_summary_text_2, body_style))

    # Highlights Callout Box
    callout_data = [
        [
            Paragraph(
                "<b>Key Transformational Mandates of DILRMP 3.0:</b><br/>"
                "• <b>14-Digit Bhu-Aadhaar (ULPIN):</b> Standardized alphanumeric anchor linking all 8 governmental registries.<br/>"
                "• <b>Unified Lending Interface (ULI):</b> Real-time digital bank charge registration preventing double-financing.<br/>"
                "• <b>RCCMS Active Injunction Flags:</b> Revenue Court stay orders automatically freeze mutation transfers.<br/>"
                "• <b>Automated Statutory Valuation:</b> Elimination of manual bribery through algorithmic Circle Rate assessment.<br/>"
                "• <b>NAKSHA Urban Property Card:</b> Extension of clear cadastral titles to urban built-up plots and Abadi land.",
                callout_style
            )
        ]
    ]
    t_callout = Table(callout_data, colWidths=[505])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93c5fd")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_callout)
    story.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # SECTION 2: THE 8 LAYERS DETAILED SPECIFICATION
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("2. Detailed Architectural Specification of the 8 Layers", h1_style))

    layers_info = [
        (
            "Layer 1: Cadastral Parcel Map & Geospatial Vector Boundary",
            "Survey of India • State Settlement Commissioner & Land Records",
            "The physical baseline of the Land Stack. Provides geo-referenced polygon boundaries with exact WGS-84 coordinates, corner vertex pins, and survey/gat demarcation lines. Standardized scale (1:1000 or 1:2000) generated via high-resolution drone imagery and Electronic Total Station (ETS) surveys. Eliminates physical boundary encroachment and measurement discrepancies."
        ),
        (
            "Layer 2: Record of Rights (RoR / 7/12 & 8A Extract)",
            "State Revenue Department (Mahabhulekh, Bhulekh, Jamabandi)",
            "The legal ownership baseline. Captures titleholder identities (single, joint, trust), Khata (ledger account) and Khasra numbers, tenure classification (Occupant Class 1 Freehold vs Class 2 Restricted), total plot area, and cultivation patterns. Supports consent-based masked Aadhaar seeding (XXXX-XXXX-9124) for automated SMS fraud notifications."
        ),
        (
            "Layer 3: Land Registration & Conveyance (NGDRS / e-Registration)",
            "Inspector General of Registration & Stamps (IGR) • Sub-Registrar Offices (SRO)",
            "Maintains statutory transaction histories, registered deeds (Sale, Gift, Partition, Lease), consideration values, market values, and e-Challan stamp duty payments. Direct integration with the National Generic Document Registration System (NGDRS) enables instantaneous paperless deed recording and automated mutation triggering."
        ),
        (
            "Layer 4: Land Use & Master Plan Statutory Zoning",
            "Town & Country Planning Directorate • Urban Development Authorities",
            "Defines permissible activities and legal zoning restrictions. Classifies land into Agricultural (Jirayat/Bagayat), Non-Agricultural (NA), Residential (R-Zone), Commercial, or Industrial. Flags critical environmental buffers including Coastal Regulation Zones (CRZ), eco-sensitive wildlife corridors, and forest demarcations."
        ),
        (
            "Layer 5: NAKSHA Urban Property Register (UrPro)",
            "Urban Local Bodies (ULBs) • Municipal Corporations • SVAMITVA Scheme",
            "Extends cadastral title certainty to urban properties, apartments, commercial shops, and rural inhabited Abadi zones. Contains City Survey (CTS) / Milkat Patra numbers, drone-verified 3D building footprints, carpet/built-up area, municipal ward, and permissible Floor Area Ratio (FAR / FSI) with height ceilings."
        ),
        (
            "Layer 6: Bank Mortgage & Encumbrance Registry (Unified Lending Interface)",
            "Reserve Bank of India (RBI) • Unified Lending Interface (ULI) • Commercial Banks",
            "Real-time financial lien registry. Records institutional charges, agricultural hypothecations (e.g. Kisan Credit Card loans), loan amounts, and lending bank branch. Prevents multi-bank fraudulent hypothecations by locking the digital title parcel instantly upon loan registration."
        ),
        (
            "Layer 7: Revenue Court Case Management System (RCCMS)",
            "Revenue Courts (Court of Tehsildar, Sub-Divisional Officer, District Collector)",
            "Live litigation tracking for revenue disputes, boundary demarcation contests, and partition suits under Section 247 of the Land Revenue Code. Crucially flags statutory injunctions (Stay Order: TRUE), preventing fraudulent sale deed registrations or illegal mutation approvals while title is contested in court."
        ),
        (
            "Layer 8: Circle Rate Guidance & Algorithmic Statutory Valuation",
            "Directorate of Valuation • Annual Statement of Rates (ASR / Ready Reckoner)",
            "Automated fair-market valuation engine. Calculates baseline parcel value algorithmically as Circle Rate (₹/sq.m) × Plot Area. Guarantees transparent stamp duty assessment, prevents tax undervaluation, and eliminates arbitrary discretion in property pricing."
        ),
    ]

    for idx, (title, auth, desc) in enumerate(layers_info, 1):
        story.append(Paragraph(f"<b>2.{idx} {title}</b>", h2_style))
        story.append(Paragraph(f"<i>Custodial Authority:</i> <b>{auth}</b>", ParagraphStyle('Auth', fontName='Helvetica', fontSize=7.5, textColor=colors.HexColor("#4338ca"), spaceAfter=2)))
        story.append(Paragraph(desc, body_style))
        if idx % 4 == 0 and idx != 8:
            story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 3: SUMMARY COMPARISON MATRIX TABLE
    # ─────────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(Paragraph("3. Summary Comparative Matrix", h1_style))

    table_data = [
        [
            Paragraph("<b>Layer</b>", table_header_style),
            Paragraph("<b>Layer Name</b>", table_header_style),
            Paragraph("<b>Custodial Authority</b>", table_header_style),
            Paragraph("<b>Update Cycle</b>", table_header_style),
            Paragraph("<b>Primary Governance Impact</b>", table_header_style),
        ],
        [
            Paragraph("<b>L1</b>", table_cell_bold),
            Paragraph("Cadastral Map", table_cell_style),
            Paragraph("Survey of India / Settlement", table_cell_style),
            Paragraph("Periodic / Re-survey", table_cell_style),
            Paragraph("Exact boundaries; zero encroachment", table_cell_style),
        ],
        [
            Paragraph("<b>L2</b>", table_cell_bold),
            Paragraph("Record of Rights", table_cell_style),
            Paragraph("Revenue Department (DoLR)", table_cell_style),
            Paragraph("Continuous (Mutation)", table_cell_style),
            Paragraph("Authoritative legal title & tenure", table_cell_style),
        ],
        [
            Paragraph("<b>L3</b>", table_cell_bold),
            Paragraph("Land Registration", table_cell_style),
            Paragraph("IGR / NGDRS (SRO)", table_cell_style),
            Paragraph("Event-based (Deed)", table_cell_style),
            Paragraph("Paperless conveyancing & stamp duty", table_cell_style),
        ],
        [
            Paragraph("<b>L4</b>", table_cell_bold),
            Paragraph("Land Use & Zoning", table_cell_style),
            Paragraph("Town & Country Planning", table_cell_style),
            Paragraph("Master Plan (5-10 yr)", table_cell_style),
            Paragraph("Prevents illegal plotting & CRZ breach", table_cell_style),
        ],
        [
            Paragraph("<b>L5</b>", table_cell_bold),
            Paragraph("Urban NAKSHA", table_cell_style),
            Paragraph("ULBs / Municipal Corp", table_cell_style),
            Paragraph("Continuous / Drone", table_cell_style),
            Paragraph("Clear titles for flats, shops, & Abadi", table_cell_style),
        ],
        [
            Paragraph("<b>L6</b>", table_cell_bold),
            Paragraph("Bank Mortgage (ULI)", table_cell_style),
            Paragraph("RBI / Commercial Banks", table_cell_style),
            Paragraph("Real-Time (API)", table_cell_style),
            Paragraph("Prevents multi-bank collateral fraud", table_cell_style),
        ],
        [
            Paragraph("<b>L7</b>", table_cell_bold),
            Paragraph("RCCMS Court Cases", table_cell_style),
            Paragraph("Revenue Courts (SDO/Tehsil)", table_cell_style),
            Paragraph("Real-Time (Hearings)", table_cell_style),
            Paragraph("Freezes transactions under court stay", table_cell_style),
        ],
        [
            Paragraph("<b>L8</b>", table_cell_bold),
            Paragraph("Statutory Valuation", table_cell_style),
            Paragraph("Directorate of Valuation (ASR)", table_cell_style),
            Paragraph("Annual / Statutory", table_cell_style),
            Paragraph("Eliminates undervaluation & bribery", table_cell_style),
        ],
    ]

    t_matrix = Table(table_data, colWidths=[24, 86, 120, 95, 180])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 10))

    # ─────────────────────────────────────────────────────────────
    # SECTION 4: PLATFORM IMPLEMENTATION ARCHITECTURE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("4. Technical System Integration", h1_style))
    impl_text = (
        "In our Intelligent Land Record Digitization and Validation System, the 8-Layer Land Stack is fully operationalized:<br/>"
        "• <b>Frontend GIS Visualizer (<code>LandStackMultiLayerViewer.tsx</code>):</b> Features an interactive SVG parcel canvas with "
        "dynamic dispute hatching, mortgage lock icons, per-layer visibility toggles, and metadata inspection drawer.<br/>"
        "• <b>Backend Aggregator Service (<code>landStack.service.ts</code>):</b> Real-time endpoint (<code>GET /api/land-records/:id/land-stack</code>) "
        "compiles all 8 layers dynamically with resilient array/map normalizers and fallback layers.<br/>"
        "• <b>Officer Verification Workstation (<code>UserDocumentVerificationWorkstation.tsx</code>):</b> Verifiers and Officers "
        "can open the 8-Layer Land Stack modal before applying Information Technology Act compliant digital signatures, "
        "ensuring zero approvals on contested or mortgaged land."
    )
    story.append(Paragraph(impl_text, body_style))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    out_dir = r"c:\Users\SaadAli\Desktop\SIH"
    out_file = os.path.join(out_dir, "DILRMP_3.0_8_Layer_Land_Stack_Executive_Report.pdf")
    build_pdf(out_file)
