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
            self.drawString(40, A4[1] - 32, "ILRDVS — Complete Platform Technology Stack & Architecture Deep-Dive")
            self.drawRightString(A4[0] - 40, A4[1] - 32, "Enterprise Technical Specification")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(40, A4[1] - 38, A4[0] - 40, A4[1] - 38)

        # Running Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 40, A4[0] - 40, 40)

        footer_left = "Intelligent Land Record Digitization & Validation System • Government of Maharashtra / DoLR DILRMP 3.0"
        self.drawString(40, 28, footer_left)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 40, 28, page_str)
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=46,
        bottomMargin=46,
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
        fontSize=17,
        leading=21,
        textColor=c_primary,
        spaceAfter=3,
    )

    subtitle_style = ParagraphStyle(
        'MainSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#475569"),
        spaceAfter=8,
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_secondary,
        spaceBefore=9,
        spaceAfter=4,
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_dark,
        spaceBefore=5,
        spaceAfter=2,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4,
    )

    code_block_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=8.8,
        textColor=colors.HexColor("#0f172a"),
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#1e3a8a"),
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.2,
        textColor=colors.white,
    )

    td_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.8,
        textColor=colors.HexColor("#1e293b"),
    )

    td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=8.8,
        textColor=colors.HexColor("#0f172a"),
    )

    story = []

    # ─────────────────────────────────────────────────────────────
    # TITLE BLOCK & METADATA BADGES
    # ─────────────────────────────────────────────────────────────
    badge_data = [
        [
            Paragraph("<b>GOVERNMENT OF MAHARASHTRA</b> • Department of Revenue & Forest", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=7.5, textColor=c_emerald)),
            Paragraph("<b>DoLR Standard:</b> DILRMP 3.0 Operational Framework (2026–2031)", ParagraphStyle('B2', fontName='Helvetica-Bold', fontSize=7.5, textColor=c_secondary, alignment=2))
        ]
    ]
    t_badge = Table(badge_data, colWidths=[315, 204])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_badge)
    story.append(Spacer(1, 5))

    story.append(Paragraph("ILRDVS: Complete Website Technology Stack & Engineering Reference", title_style))
    story.append(Paragraph("Comprehensive Technical Breakdown of Frontend, Backend API, Database, Multimodal AI Vision, Cryptographic Security, Geospatial Engine & Cloud DevOps", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f172a"), spaceBefore=0, spaceAfter=6))

    # ─────────────────────────────────────────────────────────────
    # SECTION 1: ARCHITECTURAL OVERVIEW
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("1. Architectural Overview & Design Philosophy", h1_style))
    p1 = (
        "The <b>Intelligent Land Record Digitization and Validation System (ILRDVS)</b> is an enterprise digital governance "
        "solution built for the modern revenue ecosystem. The platform bridges the divide between archaic paper records "
        "(7/12 Satbara extracts, Ferfar mutation registers, Sale Deeds, Property Cards) and modern national digital infrastructure. "
        "Engineered with a <b>decoupled full-stack TypeScript architecture</b>, the platform enforces type safety across the entire "
        "pipeline: from client input forms to API transport payloads, database entity models, and vision extraction schemas."
    )
    story.append(Paragraph(p1, body_style))

    # ─────────────────────────────────────────────────────────────
    # SECTION 2: FRONTEND CLIENT TIER DEEP-DIVE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("2. Frontend Presentation Tier Architecture", h1_style))
    fe_overview = (
        "The frontend is constructed using <b>Next.js 14</b> with the <b>React 18 App Router</b>. It provides responsive, "
        "accessible, and lightning-fast portals for three distinct user personas: <b>Citizens</b>, <b>Verifiers (Inspectors)</b>, "
        "and <b>Tehsildars (Revenue Officers / Admins)</b>."
    )
    story.append(Paragraph(fe_overview, body_style))

    fe_components = [
        ("Next.js 14 (v14.2.24) App Router", "Server-Side Rendering (SSR), Static Site Generation (SSG), and incremental static regeneration. Handles nested layout hierarchies (e.g. <code>app/portal/layout.tsx</code>), optimized image caching, and route-level error boundaries."),
        ("React 18 (v18.3.1)", "Concurrent React features including <code>useTransition</code>, <code>Suspense</code>, and automatic state batching. Powers high-responsiveness across complex form wizards and multi-pane inspection stations."),
        ("Tailwind CSS (v3.4.17) + Autoprefixer", "Utility-first design system customized with the official Government of India tricolor branding (Emerald Green <code>#065f46</code>, Deep Ashoka Blue <code>#1e3a8a</code>, Saffron <code>#b45309</code>). Glassmorphic panels with sub-pixel borders."),
        ("TanStack React Query (v5.64.2)", "Declarative server state management. Features automated background refetching, query key invalidation on mutation (e.g. invalidating <code>['verificationQueue']</code> on digital signature), optimistic updates, and offline caching."),
        ("Axios (v1.7.9)", "Centralized HTTP client configured with request interceptors for automatic JWT Bearer header injection and response interceptors standardizing backend error structures and cold-start wake-up notifications."),
        ("React Hook Form (v7.54.2) + @hookform/resolvers", "High-performance uncontrolled form state engine eliminating unnecessary re-renders. Integrates seamlessly with Zod resolvers for real-time validation across multi-step registration and document upload wizards."),
        ("i18next (v26.4.2) + react-i18next (v17.0.13)", "Full trilingual internationalization supporting Marathi (मराठी - primary state language), Hindi (हिंदी), and English. Dynamic language toggle in top bar preserves user language preference across sessions."),
        ("QRCode (v1.5.4) & jsQR (v1.4.0)", "Two-way QR code engine. Generates high-density tamper-evident cryptographic verification QR codes on digital extracts; camera-based client-side scanner allows instant document authenticity audits."),
        ("JsBarcode (v3.12.3)", "Renders standard CODE128 and CODE39 statutory barcodes embedding Archival Serial Identifiers (e.g. <code>ARCH-MH-REG-2026-1001</code>) onto digitized records for physical file room tracking."),
        ("Recharts (v2.15.0)", "Declarative SVG charting library powering executive dashboards: land usage distribution donuts, monthly mutation throughput area charts, and verifier SLA turnaround bars."),
        ("Lucide React (v0.473.0)", "Consistent, lightweight SVG iconography tailored for enterprise governance interfaces."),
    ]

    for comp, desc in fe_components:
        story.append(Paragraph(f"• <b>{comp}:</b> {desc}", body_style))

    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 3: BACKEND API & SERVICE LAYER DEEP-DIVE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("3. Backend API Gateway & Microservices Architecture", h1_style))
    be_overview = (
        "The backend is built as a high-concurrency <b>Node.js (v22 LTS)</b> and <b>Express.js (v4.21.2)</b> RESTful application "
        "compiled via TypeScript 5.7. It encapsulates statutory land governance business logic, document streaming, OCR queues, "
        "and cryptographic signature validation."
    )
    story.append(Paragraph(be_overview, body_style))

    be_components = [
        ("Express.js (v4.21.2)", "Core web application framework. Modular routing structure (<code>routes/auth</code>, <code>routes/land-record</code>, <code>routes/verification</code>, <code>routes/document</code>), centralized error middleware, and sub-second endpoint execution."),
        ("TypeScript (v5.7.3) & tsx (v4.19.2)", "Full TypeScript strict mode enforcing interface contracts across request bodies, database entities, and internal services. <code>tsx</code> provides high-speed zero-config runtime execution for development and database seeding."),
        ("JSON Web Tokens (v9.0.2)", "Stateless, RFC 7519 compliant authentication. Signs user ID, role, and department into cryptographically secured tokens delivered via HttpOnly, SameSite cookies with fallback Bearer header authentication."),
        ("bcryptjs (v3.0.2)", "One-way adaptive cryptographic password hashing utilizing 10 salt rounds to resist rainbow table and brute-force attacks."),
        ("Multer (v1.4.5-lts.1)", "Streaming multipart/form-data middleware for document ingestion. Enforces MIME type verification (PDF, PNG, JPEG, TIFF) and strict 20MB file size quotas."),
        ("Sharp (v0.33.5)", "High-performance image processing engine based on libvips. Powers on-the-fly thumbnail generation, DPI normalization (300–400 DPI archival standard), contrast adjustment, and deskewing before OCR extraction."),
        ("pdf-parse (v1.1.1)", "Direct digital PDF stream parser extracting embedded vector text and metadata from born-digital government gazettes and e-Registration sale deeds."),
        ("Zod (v3.24.1)", "Dual-layer runtime validation. Validates request parameters, query strings, and multipart fields before controller invocation, automatically returning 400 Bad Request with field-level error messages."),
        ("CORS (v2.8.5)", "Dynamic origin validation allowing seamless cross-origin communication between the deployed Next.js frontend and Express backend across cloud domains (<code>*.onrender.com</code>, <code>localhost</code>)."),
        ("Morgan (v1.10.0)", "Structured HTTP request logging recording method, route, response status, latency in milliseconds, and content length for operational telemetry."),
    ]

    for comp, desc in be_components:
        story.append(Paragraph(f"• <b>{comp}:</b> {desc}", body_style))

    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 4: DATA PERSISTENCE & ORM TIER
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("4. Data Persistence Tier: PostgreSQL & Prisma ORM", h1_style))
    db_text = (
        "The system utilizes <b>PostgreSQL 16</b> hosted on <b>Neon Serverless Cloud</b> (with Render Managed DB compatibility). "
        "Data access is managed through <b>Prisma ORM v6.4.1</b>, providing type-safe query building, connection pooling, and "
        "declarative schema migrations.<br/>"
        "<b>Core Relational Models:</b><br/>"
        "• <b>User:</b> Central identity model supporting roles (<code>ADMIN</code>, <code>OFFICER</code>, <code>VERIFIER</code>, <code>CITIZEN</code>), "
        "account statuses (<code>PENDING_VERIFICATION</code>, <code>PENDING_APPROVAL</code>, <code>ACTIVE</code>), masked Aadhaar, and audit timestamps.<br/>"
        "• <b>LandRecord:</b> Core parcel entity holding 14-digit ULPIN, survey/gat numbers, plot areas in hectares, tenure classification, "
        "ASR circle rate valuation, and multi-layer attributes.<br/>"
        "• <b>Document:</b> Ingested archival scans with MIME types, storage paths, processing status (<code>UPLOADED</code>, <code>PROCESSING</code>, <code>PROCESSED</code>, <code>NEEDS_REVIEW</code>), "
        "OCR confidence scores, and JSONB extraction entities.<br/>"
        "• <b>VerificationWorkflow & Record:</b> 4-Eye dual-control state machine capturing verifier remarks, tehsildar digital signature certificates, "
        "SHA-256 payload hashes, and QR verification tokens.<br/>"
        "• <b>OfficerApplication:</b> Controlled officer onboarding workflows storing employee ID, departmental jurisdiction, and verification milestones.<br/>"
        "• <b>AuditLog:</b> Append-only compliance ledger recording actor, action type, IP address, timestamp, and modified resources."
    )
    story.append(Paragraph(db_text, body_style))
    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 5: AI, MULTIMODAL VISION & OCR PIPELINE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("5. Hybrid AI Vision & Multilingual OCR Pipeline", h1_style))
    ai_text = (
        "ILRDVS deploys an intelligent <b>Hybrid AI Vision Pipeline</b> designed for both extreme accuracy and failover resiliency:<br/>"
        "• <b>Cloud Primary: Google Gemini 1.5 Flash Vision API:</b> Evaluates high-resolution document scans using advanced multimodal "
        "reasoning. Capable of parsing complex handwritten Modi/Devanagari script, tabular Satbara extracts, and boundary demarcation text "
        "with sub-2-second turnaround time and ≥94% confidence.<br/>"
        "• <b>Edge Fallback: On-Device OpenCV + EasyOCR / Tesseract.js:</b> If cloud connectivity is disrupted or offline local processing "
        "is mandated for sensitive archival scans, the system automatically redirects documents to an on-device Python/Tesseract pipeline. "
        "Executes image deskewing, Otsu binarization, noise filtering, and local OCR without service downtime.<br/>"
        "• <b>Automated Entity Normalization:</b> Extracts key values into typed structures: Vendor Name, Purchaser Name, Consideration Amount, "
        "Khata Number, Khasra Number, and Boundary Demarcations (East, West, North, South)."
    )
    story.append(Paragraph(ai_text, body_style))
    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 6: THE 8-LAYER LAND STACK GEOSPATIAL ENGINE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("6. The 8-Layer Land Stack Geospatial Engine", h1_style))
    stack_text = (
        "Under DILRMP 3.0 guidelines, ILRDVS implements the unified <b>8-Layer Land Stack</b> anchored by the 14-digit Bhu-Aadhaar (ULPIN):<br/>"
        "• <b>L1 Cadastral Map:</b> Geo-referenced WGS-84 vector polygons with sub-meter vertex pins.<br/>"
        "• <b>L2 Record of Rights:</b> Authoritative legal title, tenure status, and ownership shares (7/12 & 8A).<br/>"
        "• <b>L3 NGDRS Registration:</b> Registered conveyance deeds, e-Challan stamp duty numbers, and sale records.<br/>"
        "• <b>L4 Land Use & Zoning:</b> Master plan zoning (Agricultural, Residential, Commercial, Industrial, CRZ buffer).<br/>"
        "• <b>L5 NAKSHA Urban Property:</b> Built-up footprints, Milkat Patra property cards, and permissible Floor Space Index (FSI).<br/>"
        "• <b>L6 Bank Mortgages (RBI ULI):</b> Real-time institutional financial liens preventing double-financing fraud.<br/>"
        "• <b>L7 RCCMS Revenue Court Cases:</b> Real-time litigation tracking; freezes mutation instantly upon active Stay Orders.<br/>"
        "• <b>L8 Statutory Valuation:</b> Algorithmic calculation of circle rates eliminating valuation discretion.<br/>"
        "<b>Frontend Visualizer:</b> Renders interactive SVG parcel polygons with dynamic red diagonal cross-hatching for active court disputes "
        "and golden padlock badges for bank encumbrances."
    )
    story.append(Paragraph(stack_text, body_style))
    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 7: SECURITY, CRYPTOGRAPHY & IT ACT COMPLIANCE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("7. Cryptographic Security & Legal Compliance Architecture", h1_style))
    sec_text = (
        "• <b>Information Technology Act, 2000 (Section 5 & 65B):</b> Electronic records digitally signed by revenue officers carry full "
        "legal presumption of authenticity in judicial proceedings.<br/>"
        "• <b>Tamper-Evident SHA-256 Hashing:</b> When an officer approves a record, a cryptographic SHA-256 hash digest is computed across "
        "the parcel attributes, timestamp, and officer identity, embedded directly into the digitized extract and printable QR code.<br/>"
        "• <b>Multi-Channel OTP Verification:</b> Account creation and digital signing incorporate real-time EmailJS / Resend email OTP "
        "challenges with 10-minute expiry windows and rate limiting.<br/>"
        "• <b>Privacy Preservation:</b> Citizen Aadhaar numbers are stored exclusively in masked format (<code>XXXX-XXXX-9124</code>) complying "
        "with UIDAI security mandates."
    )
    story.append(Paragraph(sec_text, body_style))
    story.append(Spacer(1, 4))

    # ─────────────────────────────────────────────────────────────
    # SECTION 8: CLOUD INFRASTRUCTURE & DEVOPS PIPELINE
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("8. Cloud DevOps & Deployment Infrastructure", h1_style))
    devops_text = (
        "• <b>Infrastructure as Code (IaC):</b> Declarative deployment managed via <code>render.yaml</code> orchestrating the Node.js Express "
        "web service (<code>ilrd-backend</code>) and Next.js static frontend (<code>ilrd-frontend</code>).<br/>"
        "• <b>Automated CI/CD:</b> Every Git push to <code>main</code> triggers automated TypeScript validation (<code>tsc</code>), Prisma schema "
        "push (<code>prisma db push</code>), Next.js bundle compilation, and zero-downtime deployment.<br/>"
        "• <b>Active Health Telemetry:</b> Backend exposes <code>GET /health</code> executing a live <code>SELECT 1</code> query against PostgreSQL, "
        "monitoring database latency in milliseconds and guaranteeing automated self-healing restart if degraded."
    )
    story.append(Paragraph(devops_text, body_style))
    story.append(Spacer(1, 6))

    # ─────────────────────────────────────────────────────────────
    # SECTION 9: MASTER DEPENDENCY & SPECIFICATION MATRIX
    # ─────────────────────────────────────────────────────────────
    story.append(Paragraph("9. Master Dependency & Technical Specification Matrix", h1_style))

    master_table_data = [
        [
            Paragraph("<b>Category</b>", th_style),
            Paragraph("<b>Package / Tool</b>", th_style),
            Paragraph("<b>Version</b>", th_style),
            Paragraph("<b>Runtime / Scope</b>", th_style),
            Paragraph("<b>Architectural Responsibility</b>", th_style),
        ],
        [
            Paragraph("Frontend Core", td_bold),
            Paragraph("Next.js", td_style),
            Paragraph("14.2.24", td_style),
            Paragraph("Node.js / Browser", td_style),
            Paragraph("App Router, SSR, SSG static exports, optimized route bundling.", td_style),
        ],
        [
            Paragraph("Frontend Core", td_bold),
            Paragraph("React & React DOM", td_style),
            Paragraph("18.3.1", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("Concurrent UI rendering, hooks, state lifecycle.", td_style),
        ],
        [
            Paragraph("State Management", td_bold),
            Paragraph("@tanstack/react-query", td_style),
            Paragraph("5.64.2", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("Asynchronous server state caching, mutation invalidation, query pooling.", td_style),
        ],
        [
            Paragraph("Styling Engine", td_bold),
            Paragraph("Tailwind CSS + PostCSS", td_style),
            Paragraph("3.4.17", td_style),
            Paragraph("Build / CSS", td_style),
            Paragraph("Atomic design tokens, responsive breakpoints, government palette.", td_style),
        ],
        [
            Paragraph("Form & Validation", td_bold),
            Paragraph("React Hook Form + Zod", td_style),
            Paragraph("7.54 / 3.24", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("High-performance unopinionated form inputs with strict Zod validation.", td_style),
        ],
        [
            Paragraph("Internationalization", td_bold),
            Paragraph("i18next / react-i18next", td_style),
            Paragraph("26.4 / 17.0", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("Dynamic multi-language localization (Marathi, Hindi, English).", td_style),
        ],
        [
            Paragraph("Data Visualization", td_bold),
            Paragraph("Recharts", td_style),
            Paragraph("2.15.0", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("Interactive SVG analytics charts for revenue administrative dashboards.", td_style),
        ],
        [
            Paragraph("QR / Barcode", td_bold),
            Paragraph("qrcode / jsQR / jsbarcode", td_style),
            Paragraph("1.5.4 / 1.4 / 3.12", td_style),
            Paragraph("Browser Client", td_style),
            Paragraph("Cryptographic QR generation, camera scanning, archival barcode output.", td_style),
        ],
        [
            Paragraph("Backend Framework", td_bold),
            Paragraph("Express.js", td_style),
            Paragraph("4.21.2", td_style),
            Paragraph("Node.js Server", td_style),
            Paragraph("RESTful routing, authentication middleware, multipart streaming.", td_style),
        ],
        [
            Paragraph("Language", td_bold),
            Paragraph("TypeScript", td_style),
            Paragraph("5.7.3", td_style),
            Paragraph("Universal", td_style),
            Paragraph("End-to-end static type safety across client, server, and database models.", td_style),
        ],
        [
            Paragraph("Database & ORM", td_bold),
            Paragraph("PostgreSQL + Prisma", td_style),
            Paragraph("PG 16 / Prisma 6.4", td_style),
            Paragraph("Database Engine", td_style),
            Paragraph("ACID transactions, spatial geometry indexing, automated schema migration.", td_style),
        ],
        [
            Paragraph("AI Vision (Cloud)", td_bold),
            Paragraph("Google Gemini 1.5 Flash", td_style),
            Paragraph("v1beta Multimodal", td_style),
            Paragraph("Cloud API", td_style),
            Paragraph("Sub-2s Devanagari handwriting and tabular Satbara visual extraction.", td_style),
        ],
        [
            Paragraph("AI Vision (Local)", td_bold),
            Paragraph("OpenCV + EasyOCR", td_style),
            Paragraph("Python / On-Device", td_style),
            Paragraph("Edge Microservice", td_style),
            Paragraph("Offline edge OCR fallback: image deskewing, binarization, character parse.", td_style),
        ],
        [
            Paragraph("Security & Auth", td_bold),
            Paragraph("jsonwebtoken + bcryptjs", td_style),
            Paragraph("9.0.2 / 3.0.2", td_style),
            Paragraph("Node.js Server", td_style),
            Paragraph("Cryptographic stateless session tokens, salted password hashing.", td_style),
        ],
        [
            Paragraph("Image Processing", td_bold),
            Paragraph("Sharp + pdf-parse", td_style),
            Paragraph("0.33.5 / 1.1.1", td_style),
            Paragraph("Node.js Server", td_style),
            Paragraph("High-speed rasterization, DPI optimization, PDF text stream parsing.", td_style),
        ],
        [
            Paragraph("Email & Notification", td_bold),
            Paragraph("EmailJS Browser / API", td_style),
            Paragraph("4.4.1 / REST", td_style),
            Paragraph("Multi-Channel", td_style),
            Paragraph("Real-time email OTP verification, citizen welcome, status notifications.", td_style),
        ],
        [
            Paragraph("Cloud DevOps", td_bold),
            Paragraph("Render Cloud (IaC)", td_style),
            Paragraph("render.yaml v1", td_style),
            Paragraph("Cloud Platform", td_style),
            Paragraph("Infrastructure as Code, automated Git webhooks, zero-downtime deployment.", td_style),
        ],
    ]

    t_master = Table(master_table_data, colWidths=[68, 88, 62, 70, 231])
    t_master.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 3),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_master)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated Complete Tech Stack PDF: {filename}")


if __name__ == '__main__':
    out_dir = r"c:\Users\SaadAli\Desktop\SIH"
    out_file = os.path.join(out_dir, "ILRDVS_Complete_Technology_Stack_Reference.pdf")
    build_pdf(out_file)
