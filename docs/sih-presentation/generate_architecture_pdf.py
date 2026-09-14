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
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Running Header on pages after first page
        if self._pageNumber > 1:
            self.drawString(44, A4[1] - 34, "ILRDVS — System Architecture, Process Flowcharts & Technology Stack")
            self.drawRightString(A4[0] - 44, A4[1] - 34, "DILRMP 3.0 Technical Documentation")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(44, A4[1] - 40, A4[0] - 44, A4[1] - 40)

        # Running Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(44, 42, A4[0] - 44, 42)

        footer_left = "Intelligent Land Record Digitization & Validation System • Government of Maharashtra / DoLR"
        self.drawString(44, 30, footer_left)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 44, 30, page_str)
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=48,
        bottomMargin=48,
    )

    styles = getSampleStyleSheet()

    c_primary = colors.HexColor("#0f172a")      # Slate 900
    c_secondary = colors.HexColor("#1e3a8a")    # Blue 900
    c_accent = colors.HexColor("#0284c7")       # Sky 600
    c_emerald = colors.HexColor("#065f46")      # Emerald 800
    c_dark = colors.HexColor("#1e293b")         # Slate 800

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceAfter=3,
    )

    subtitle_style = ParagraphStyle(
        'MainSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#475569"),
        spaceAfter=10,
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=5,
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_dark,
        spaceBefore=6,
        spaceAfter=3,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=5,
    )

    code_block_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor("#0f172a"),
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor("#1e3a8a"),
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
    )

    td_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#1e293b"),
    )

    td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#0f172a"),
    )

    story = []

    # ─────────────────────────────────────────────────────────────
    # TITLE BLOCK & METADATA BADGES
    # ─────────────────────────────────────────────────────────────
    badge_data = [
        [
            Paragraph("<b>GOVERNMENT OF MAHARASHTRA</b> • Revenue & Forest Department", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=7.5, textColor=c_emerald)),
            Paragraph("<b>DILRMP 3.0 Standard:</b> 2026–2031 Specification", ParagraphStyle('B2', fontName='Helvetica-Bold', fontSize=7.5, textColor=c_secondary, alignment=2))
        ]
    ]
    t_badge = Table(badge_data, colWidths=[315, 200])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_badge)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Intelligent Land Record Digitization and Validation System (ILRDVS)", title_style))
    story.append(Paragraph("Complete Technical System Architecture, End-to-End Operational Process Flowcharts, and Comprehensive Technology Stack Specification", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f172a"), spaceBefore=0, spaceAfter=8))

    # ─────────────────────────────────────────────────────────────
    # SECTION 1: SYSTEM DESIGN PRINCIPLES & GOALS
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("1. System Design Principles & Core Objectives", h1_style))
    p1 = (
        "The <b>Intelligent Land Record Digitization and Validation System (ILRDVS)</b> is an enterprise digital "
        "governance platform designed in compliance with the <b>Digital India Land Records Modernization Programme (DILRMP 3.0)</b> "
        "and the <b>Information Technology Act, 2000</b>. Historical land records across Indian states face acute challenges: "
        "physical parchment deterioration, unindexed handwritten Modi/Devanagari scripts, disjointed revenue registries, "
        "and fraudulent multiple mortgages. ILRDVS addresses these systemic bottlenecks through four foundational architectural pillars:"
    )
    story.append(Paragraph(p1, body_style))

    principles_data = [
        [
            Paragraph(
                "• <b>Human-in-the-Loop 4-Eye Dual Verification:</b> Artificial intelligence assists rather than unilaterally decides. "
                "Every automated extraction requires two-tiered human consensus: Verifier boundary inspection followed by Tehsildar / "
                "Officer cryptographic digital sign-off.<br/>"
                "• <b>Deterministic 14-Digit Bhu-Aadhaar (ULPIN):</b> Geospatial spatial indexing derived from parcel centroid "
                "WGS-84 coordinates, eliminating ambiguity across legacy survey/gat numbering systems.<br/>"
                "• <b>Multi-Registry Encumbrance Interlocking:</b> Dynamic integration across the 8 layers of land data, locking parcels "
                "instantly upon active revenue court stay orders (RCCMS) or institutional bank hypothecations (RBI ULI).<br/>"
                "• <b>Statutory Transparency & Zero Discretion:</b> Algorithmic calculation of Annual Statement of Rates (ASR Ready "
                "Reckoner circle rates) to eliminate corruption in stamp duty assessments.",
                callout_style
            )
        ]
    ]
    t_prin = Table(principles_data, colWidths=[515])
    t_prin.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#93c5fd")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_prin)
    story.append(Spacer(1, 8))

    # ─────────────────────────────────────────────────────────────
    # SECTION 2: MULTI-TIER SYSTEM ARCHITECTURE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("2. Multi-Tier System Architecture", h1_style))
    p2 = (
        "ILRDVS employs a highly decoupled, service-oriented multi-tier architecture that guarantees horizontal "
        "scalability, deterministic failover, and strict separation between client presentation, business rules, "
        "computer vision extraction, and persistent storage."
    )
    story.append(Paragraph(p2, body_style))

    arch_diagram_text = (
        "┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐\n"
        "│                                1. CLIENT PRESENTATION TIER (Next.js 14)                                 │\n"
        "│  Citizen Public Portal  │  Officer Verification Station  │  Admin Analytics Dashboard  │  SVG Cadastral │\n"
        "│  (/portal/upload)       │  (/verification/[id])          │  (/dashboard, /users)       │  Multi-Layer   │\n"
        "└────────────────────────────────────────────────────┬────────────────────────────────────────────────────┘\n"
        "                                                     │ HTTPS / JSON REST (Axios Interceptors, JWT Bearer)\n"
        "┌────────────────────────────────────────────────────▼────────────────────────────────────────────────────┐\n"
        "│                           2. API GATEWAY, ROUTING & SECURITY TIER (Express.js)                          │\n"
        "│  CORS Dynamic Whitelist │ JWT Auth & Cookie Parser │ Zod Request Validator │ Role-Based Access Control  │\n"
        "│  Rate Limiting Engine   │ Audit Trail Dispatcher   │ Error Handling Pipes  │ Health & Latency Monitor   │\n"
        "└────────────────────────────────────────────────────┬────────────────────────────────────────────────────┘\n"
        "                                                     │ Synchronous Service Invocations\n"
        "┌────────────────────────────────────────────────────▼────────────────────────────────────────────────────┐\n"
        "│                             3. CORE ENTERPRISE BUSINESS SERVICES (Node.js)                              │\n"
        "│  • Land Record Registry Engine (/api/land-records)      • 8-Layer Land Stack Aggregator Engine          │\n"
        "│  • Document OCR & Vision Pipeline (Hybrid Gemini+Easy)  • Digital Signature & Cert Engine (SHA-256)     │\n"
        "│  • Bhu-Aadhaar 14-Digit ULPIN Generator (WGS-84)        • EmailJS / Resend Multi-Channel OTP Dispatcher │\n"
        "└──────────────────────────┬──────────────────────────────────────────────────┬───────────────────────────┘\n"
        "                           │                                                  │\n"
        "       Async Vision RPC    ▼                              Prisma ORM (v6.4)   ▼ SQL Queries\n"
        "┌──────────────────────────────────────┐       ┌──────────────────────────────────────────────────────────┐\n"
        "│ 4. HYBRID AI & VISION PIPELINE       │       │ 5. DATA PERSISTENCE & STORAGE TIER                       │\n"
        "│ • Cloud: Google Gemini 1.5 Flash API │       │ • Managed PostgreSQL DB (Neon Serverless / Render Cloud) │\n"
        "│ • Local: OpenCV Deskew + EasyOCR     │       │ • Multi-Table Indexed Relational Schema (User, Land, Doc)│\n"
        "│ • Confidence & Entity Normalizer     │       │ • Encrypted Static Archival Store (/uploads, /assets)    │\n"
        "└──────────────────────────────────────┘       └──────────────────────────────────────────────────────────┘"
    )

    t_diag = Table([[Paragraph(f"<pre>{arch_diagram_text}</pre>", code_block_style)]], colWidths=[515])
    t_diag.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 8))

    # Tier Descriptions
    story.append(Paragraph("<b>Detailed Tier Specifications:</b>", h2_style))
    tier_desc = (
        "<b>1. Client Presentation Tier:</b> Built with Next.js 14 utilizing the App Router architecture. Features "
        "specialized interfaces: Citizen Self-Service Portal (application tracking and document submission), Officer "
        "Dual-Pane Verification Workstation (high-resolution zoomable PDF/image preview alongside extracted editable fields), "
        "and the 8-Layer Multi-Layer SVG Cadastral Viewer rendering interactive WGS-84 parcel vertices, active dispute "
        "red hatching, and mortgage badges.<br/>"
        "<b>2. API Gateway & Security Tier:</b> Express.js middleware suite enforcing JSON Web Token (JWT) verification, "
        "strict Zod schema validation on request payloads, dynamic CORS whitelisting supporting cloud subdomains, "
        "and tamper-evident immutable audit logging.<br/>"
        "<b>3. Business Logic Tier:</b> Encapsulates statutory revenue rules including 14-character alphanumeric ULPIN "
        "generation (e.g. <code>81LVQLD9407JH0</code>), automated mutation state progression, and Section 5 IT Act "
        "compliant digital signature synthesis with SHA-256 integrity hashing.<br/>"
        "<b>4. AI Vision Pipeline:</b> A hybrid fallback architecture. Primary extraction utilizes Google Gemini 1.5 Flash "
        "Multimodal Vision API for sub-second table and Devanagari handwriting parsing. If cloud connectivity is disrupted, "
        "the system automatically cascades to on-device OpenCV preprocessing and EasyOCR without service downtime.<br/>"
        "<b>5. Data Persistence Tier:</b> PostgreSQL orchestrated via Prisma ORM v6.4, providing type-safe relational "
        "transactions, connection pooling, and sub-millisecond query indexing."
    )
    story.append(Paragraph(tier_desc, body_style))
    story.append(Spacer(1, 8))

    # ─────────────────────────────────────────────────────────────
    # SECTION 3: END-TO-END PROCESS FLOWCHARTS
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("3. End-to-End Operational Process Flowcharts", h1_style))
    story.append(Paragraph(
        "ILRDVS enforces strict deterministic workflows for document ingestion, AI parsing, dual-control verification, "
        "and dispute prevention across revenue databases.", body_style
    ))

    flow_1_text = (
        "═══════════════════════════════════════════════════════════════════════════════════════════════════════════\n"
        "PROCESS FLOW 1: DOCUMENT INGESTION & HYBRID AI VISION EXTRACTION PIPELINE\n"
        "═══════════════════════════════════════════════════════════════════════════════════════════════════════════\n"
        " [Citizen / Verifier] ──> Uploads Scanned Record (Satbara 7/12, Sale Deed, Ferfar) in PDF / PNG / JPEG\n"
        "                                │\n"
        "                                ▼\n"
        " [Multer Engine] ───────> Validates File Size (≤20MB), MIME Type, and assigns unique Document ID\n"
        "                                │\n"
        "                                ▼\n"
        " [AI Router] ───────────> Is GEMINI_API_KEY Available & Online?\n"
        "                                ├── YES ──> [Gemini 1.5 Flash Vision API] (Fast Multimodal Extraction)\n"
        "                                └── NO  ──> [OpenCV Preprocessing] ──> [On-Device EasyOCR Engine]\n"
        "                                │\n"
        "                                ▼\n"
        " [Entity Normalizer] ───> Extracts Survey #, Plot Area, Owner Names, Cultivation, and Market Valuation\n"
        "                                │\n"
        "                                ▼\n"
        " [Confidence Scoring] ──> Is Overall OCR Confidence Score ≥ 85%?\n"
        "                                ├── YES ──> Status: 'PROCESSED' ────> Queued for Verification Workstation\n"
        "                                └── NO  ──> Status: 'NEEDS_REVIEW' ─> Highlighted for Manual OCR Correction"
    )

    flow_2_text = (
        "═══════════════════════════════════════════════════════════════════════════════════════════════════════════\n"
        "PROCESS FLOW 2: 4-EYE PRINCIPLE VERIFICATION & DIGITAL SIGNATURE WORKFLOW\n"
        "═══════════════════════════════════════════════════════════════════════════════════════════════════════════\n"
        " [Verifier Inspector] ──> Opens Dual-Pane Workstation: Compares Original Scan vs AI Extracted Data\n"
        "                                │\n"
        "                                ▼\n"
        " [8-Layer Land Stack] ──> Live Cross-Registry Verification Query:\n"
        "                                • RCCMS Check: Active Court Stay Injunction? ──> [YES] ──> BLOCKED: Freeze Mutation\n"
        "                                • RBI ULI Check: Undischarged Bank Charge?   ──> [YES] ──> ALERT: Lien Notification\n"
        "                                │ (All Clear)\n"
        "                                ▼\n"
        " [Verifier Step] ───────> Inspects Boundary Pins ──> Applies Verifier Digital Seal ──> Status: 'VERIFIED'\n"
        "                                │\n"
        "                                ▼\n"
        " [Tehsildar / Officer] ─> Receives Docket in Final Approval Queue\n"
        "                                │\n"
        "                                ▼\n"
        " [Cryptographic Engine] ─> Applies IT Act Compliant Digital Signature (SHA-256 Hash + RSA Key)\n"
        "                                │\n"
        "                                ▼\n"
        " [Certificate Engine] ──> Synthesizes Tamper-Evident Digitized Extract with Cryptographic Verification QR\n"
        "                                │\n"
        "                                ▼\n"
        " [Citizen Portal] ──────> Instant SMS / Email Notification ──> Download Authorized Digilocker-Ready Extract"
    )

    t_flow1 = Table([[Paragraph(f"<pre>{flow_1_text}</pre>", code_block_style)]], colWidths=[515])
    t_flow1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_flow1)
    story.append(Spacer(1, 6))

    t_flow2 = Table([[Paragraph(f"<pre>{flow_2_text}</pre>", code_block_style)]], colWidths=[515])
    t_flow2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor("#0f172a")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_flow2)
    story.append(Spacer(1, 8))

    # ─────────────────────────────────────────────────────────────
    # SECTION 4: COMPREHENSIVE TECHNOLOGY STACK MATRIX
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("4. Comprehensive Technology Stack Matrix", h1_style))
    story.append(Paragraph(
        "The following matrix outlines every tier, dependency, runtime version, and architectural rationale:",
        body_style
    ))

    stack_table_data = [
        [
            Paragraph("<b>Tier / Layer</b>", th_style),
            Paragraph("<b>Technology</b>", th_style),
            Paragraph("<b>Version</b>", th_style),
            Paragraph("<b>Architectural Justification & Role</b>", th_style),
        ],
        [
            Paragraph("Frontend Core", td_bold),
            Paragraph("Next.js App Router", td_style),
            Paragraph("14.2.35", td_style),
            Paragraph("Server-Side Rendering (SSR), static export readiness, route caching, and zero client hydration overhead.", td_style),
        ],
        [
            Paragraph("Frontend UI", td_bold),
            Paragraph("React + Tailwind CSS", td_style),
            Paragraph("18.3 / 3.4", td_style),
            Paragraph("Custom Government of India design tokens, responsive typography, glassmorphic inspection panels.", td_style),
        ],
        [
            Paragraph("State / Sync", td_bold),
            Paragraph("TanStack React Query", td_style),
            Paragraph("5.62", td_style),
            Paragraph("Automatic background re-fetching, cache invalidation on mutation, and optimistic UI updates.", td_style),
        ],
        [
            Paragraph("Backend API", td_bold),
            Paragraph("Node.js + Express", td_style),
            Paragraph("Node 22 / Exp 4.21", td_style),
            Paragraph("High-concurrency asynchronous event loop handling document streaming, PDF parse, and verification queues.", td_style),
        ],
        [
            Paragraph("Type Safety", td_bold),
            Paragraph("TypeScript", td_style),
            Paragraph("5.7.3", td_style),
            Paragraph("Strict typing across client, server schemas, API contracts, and database query results.", td_style),
        ],
        [
            Paragraph("Database", td_bold),
            Paragraph("PostgreSQL", td_style),
            Paragraph("16.x / Neon / Render", td_style),
            Paragraph("ACID compliance, relational integrity, spatial polygon indexing, and high-performance concurrency.", td_style),
        ],
        [
            Paragraph("ORM Layer", td_bold),
            Paragraph("Prisma ORM", td_style),
            Paragraph("6.4.1", td_style),
            Paragraph("Automated migration management, type-safe query generation, connection pooling, and relation traversal.", td_style),
        ],
        [
            Paragraph("AI Vision (Cloud)", td_bold),
            Paragraph("Google Gemini 1.5 Flash", td_style),
            Paragraph("v1beta / Multimodal", td_style),
            Paragraph("Sub-2-second multilingual visual extraction on complex Marathi handwritten records and tabular Satbara sheets.", td_style),
        ],
        [
            Paragraph("AI Vision (Local)", td_bold),
            Paragraph("OpenCV + EasyOCR", td_style),
            Paragraph("Python / On-Device", td_style),
            Paragraph("Offline edge fallback: deskewing, binarization, and local character recognition without internet dependency.", td_style),
        ],
        [
            Paragraph("Authentication", td_bold),
            Paragraph("JWT + bcryptjs", td_style),
            Paragraph("JWT 9.0 / bcrypt 3.0", td_style),
            Paragraph("Stateless cryptographic session tokens with HTTP-only cookies, salted password hashing (rounds: 10).", td_style),
        ],
        [
            Paragraph("OTP Notification", td_bold),
            Paragraph("EmailJS / Resend Engine", td_style),
            Paragraph("REST Multi-Provider", td_style),
            Paragraph("Direct browser and backend email dispatch for official OTP verification, citizen welcome, and audit alerts.", td_style),
        ],
        [
            Paragraph("File Handling", td_bold),
            Paragraph("Multer + Sharp", td_style),
            Paragraph("1.4 / 0.33", td_style),
            Paragraph("Streaming multipart file upload, MIME inspection, resolution optimization, and static file serving.", td_style),
        ],
        [
            Paragraph("Schema Validate", td_bold),
            Paragraph("Zod", td_style),
            Paragraph("3.24.1", td_style),
            Paragraph("Zero-dependency runtime schema validation on all incoming query params, request bodies, and mutation inputs.", td_style),
        ],
        [
            Paragraph("Cloud Deploy", td_bold),
            Paragraph("Render Cloud Infrastructure", td_style),
            Paragraph("Node Web + Static", td_style),
            Paragraph("Declarative Infrastructure as Code (render.yaml), automated zero-downtime Git branch deployments.", td_style),
        ],
    ]

    t_stack = Table(stack_table_data, colWidths=[65, 88, 70, 292])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 8))

    # ─────────────────────────────────────────────────────────────
    # SECTION 5: SECURITY, AUDIT TRAIL & IT ACT COMPLIANCE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("5. Security Architecture, Audit Trail & Regulatory Compliance", h1_style))
    sec_text = (
        "• <b>Information Technology Act, 2000 (Section 5 & 65B):</b> Electronic records digitally signed using asymmetric "
        "cryptographic key pairs carry equivalent legal validity to handwritten physical signatures in revenue proceedings.<br/>"
        "• <b>Immutable Cryptographic Audit Logs:</b> Every administrative action (login, document viewing, OCR correction, digital "
        "sign-off, bank lien entry) generates an append-only audit record capturing timestamp, actor ID, client IP address, and resource payload.<br/>"
        "• <b>Masked Aadhaar Seeding:</b> In strict adherence to UIDAI regulations, citizen Aadhaar numbers are stored exclusively in "
        "masked format (<code>XXXX-XXXX-9124</code>), preventing identity theft while maintaining verified citizen ownership links.<br/>"
        "• <b>Zero-Trust Boundary Validation:</b> Verification records verify polygon topology ensuring no vertex overlaps with neighboring "
        "cadastral parcels, permanently safeguarding against physical boundary encroachment."
    )
    story.append(Paragraph(sec_text, body_style))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated Architecture & Tech Stack PDF: {filename}")


if __name__ == '__main__':
    out_dir = r"c:\Users\SaadAli\Desktop\SIH"
    out_file = os.path.join(out_dir, "ILRDVS_System_Architecture_and_Tech_Stack.pdf")
    build_pdf(out_file)
