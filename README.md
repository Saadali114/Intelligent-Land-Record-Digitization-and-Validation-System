# AI-Powered Intelligent Land Record Digitization and Validation System (ILRDVS)

![System Status](https://img.shields.io/badge/System-Production--Ready-emerald)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)
![Architecture](https://img.shields.io/badge/Architecture-Decoupled%20Full--Stack-indigo)
![Framework](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black)
![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20Mongoose-green)
![Database](https://img.shields.io/badge/Database-MongoDB%208-forestgreen)

An enterprise-grade, full-stack digital governance platform engineered to modernize and digitize historical Indian land records (such as **7/12 Satbara extracts, Ferfar mutation registers, Sale Deeds, and Property Cards**).

This project establishes the production foundation (**Frontend + Backend + Database + Authentication + RBAC + Document Management + Land Records + Verification Workflow + Operational Dashboard + API Architecture**), architected specifically to allow a **Python FastAPI AI/OCR/NLP Service** to plug in seamlessly in Phase 2.

---

## 1. Project Overview & The Land-Record Challenge

Land administration across India relies heavily on decades-old paper archives, handwritten records, archaic cadastral scripts, and physical registers. Over time, these documents suffer physical degradation, disputed mutation lineages, manual entry errors, and accessibility bottlenecks.

**ILRDVS** modernizes this ecosystem by:
1. **Preserving Archival Heritage**: Ingesting scanned historical documents (in Marathi, Hindi, English, Gujarati, etc.) alongside rich provenance metadata.
2. **Precision Cadastral Indexing**: Cataloging survey numbers, khasra numbers, khata numbers, plot areas (hectares/acres), and tenure classifications.
3. **Human-in-the-Loop Verification**: Providing a dedicated dual-pane workstation where authorized inspectors cross-reference original scans with extracted structured data, submit remarks, and generate immutable audit logs.
4. **Transparent Governance**: Implementing Role-Based Access Control (**ADMIN**, **OFFICER**, **VERIFIER**, **VIEWER**) and operational analytics dashboards.

---

## 2. System Architecture

To ensure modularity and clean division of labor for multi-developer teams, the system decouples the Next.js client from the Express API:

```text
Next.js Frontend (Port 3000)
       │
       │ Axios (withCredentials: true, Centralized Interceptors)
       ▼
TanStack Query (Client-side Server State, Caching, Invalidation)
       │
       ▼ HTTP REST (JSON)
Express + TypeScript Backend (Port 5000)
       ├── Auth & RBAC Middleware (JWT in Cookies / Bearer Header)
       ├── Zod Request Validators (Body, Query, Params)
       ├── Service Layer (Business Logic + Audit Logging)
       ├── Multer Storage Engine (Document Uploads & Static Serving)
       └── Mongoose ODM (Compound Indexed Schemas & Lean Queries)
             │
             ▼
      MongoDB Database (Port 27017)
```

### Future AI Pipeline Integration (Phase 2 Roadmap)
In Phase 2, the Express API communicates asynchronously with a Python FastAPI AI microservice:

```text
Express Backend
       │
       ▼ REST / Webhooks
Python FastAPI AI Service
       ├── 1. OpenCV Preprocessing (Deskewing, Binarization, Denoising)
       ├── 2. Multilingual OCR (Marathi Tesseract, TrOCR, PaddleOCR)
       ├── 3. NLP & Named Entity Recognition (NER for Owner, Survey #, Area)
       ├── 4. Automated Business Validation & Confidence Scoring
       └── 5. Duplicate Detection & Land Registry Anomaly Checks
             │
             ▼ Populates Extracted Data into MongoDB
Human-in-the-Loop Verifier Workstation (Approval / Correction / Rejection)
```

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom Government/Enterprise Palette
- **Server State Management**: `@tanstack/react-query` (TanStack Query v5)
- **HTTP Client**: Axios (Centralized instance with request/response interceptors)
- **Form Handling & Validation**: React Hook Form + `@hookform/resolvers` + Zod
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Pie/Donut charts, Bar charts, Area charts)

### Backend
- **Runtime & Framework**: Node.js + Express.js
- **Language**: TypeScript (`tsconfig` strict mode, compiled via `tsc` or executed via `tsx`)
- **Database & ODM**: MongoDB + Mongoose 8
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and Bearer header fallback
- **Password Security**: bcryptjs (Salt rounds: 10)
- **Validation**: Zod (Dual-layer request body and query validation)
- **File Uploads**: Multer (Local disk storage with mime-type safety)
- **Logging & Security**: Morgan HTTP logger, CORS policy, centralized error middleware

---

## 4. Folder Structure

```text
SIH/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection handler
│   │   ├── controllers/     # Thin HTTP controllers
│   │   ├── middleware/      # Auth, RBAC, Zod validation, Error handling
│   │   ├── models/          # Mongoose models (User, Document, LandRecord, VerificationRecord, AuditLog)
│   │   ├── routes/          # Express route definitions
│   │   ├── schemas/         # Zod API validation schemas
│   │   ├── seed/            # Comprehensive seed script (36 users, records, audit trails)
│   │   ├── services/        # Business logic and database aggregation services
│   │   ├── utils/           # Standardized response helper & audit logger
│   │   ├── app.ts           # Express app configuration & middleware
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Physical document file storage
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/       # Operations dashboard with Recharts
│   │   ├── documents/       # Document repository and upload modal
│   │   ├── land-records/    # Searchable cadastral catalog with CRUD
│   │   ├── login/           # Authentication portal with 1-click demo switcher
│   │   ├── profile/         # User security profile & jurisdiction
│   │   ├── unauthorized/    # 403 Access-denied page
│   │   ├── globals.css      # Custom design tokens & scrollbars
│   │   ├── layout.tsx       # Root layout with QueryProvider & AuthProvider
│   │   ├── not-found.tsx    # 404 handler
│   │   └── page.tsx         # Modern Government portal landing page
│   ├── components/
│   │   ├── layout/          # Topbar, Sidebar, AppLayout (RBAC-aware)
│   │   └── ui/              # Button, Input, Select, Badge, Card, Modal, Pagination, Skeleton, EmptyState
│   ├── context/             # AuthContext (session persistence, role helpers)
│   ├── hooks/               # Custom TanStack Query hooks & mutations
│   ├── lib/                 # Centralized Axios instance & utility functions
│   ├── providers/           # TanStack QueryClient provider
│   ├── schemas/             # Zod form validation schemas
│   ├── services/            # Frontend API client modules
│   ├── types/               # TypeScript interfaces
│   ├── .env.local
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or MongoDB Atlas URI

### Step 1: Clone and Configure Environment

Configure Backend `.env`:
```bash
cd backend
cp .env.example .env
```
Default `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/land_record_db
JWT_SECRET=super_secret_jwt_key_land_records_2026_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Configure Frontend `.env.local`:
```bash
cd ../frontend
cp .env.example .env.local
```
Default `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Step 2: Install Dependencies

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

---

### Step 3: Seed the Database

The project includes an extensive database seed script that clears obsolete collections, initializes indexes, and populates:
- **1 Super Admin**
- **5 Officers**
- **10 Verifiers**
- **20 Viewers**
- **15 Archival Documents** (7/12 extracts, Sale Deeds, Mutation registers in Marathi, Hindi, and English)
- **20 Authentic Maharashtra Land Records** (Pune, Nashik, Nagpur, Satara, Thane) with Survey/Khasra/Khata numbers and area measurements
- **Verification Audit Records & 25 Historical Audit Logs**

Run the seed script from `backend/`:
```bash
npm run seed
```

---

### Step 4: Run the Full-Stack Application

In Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
Backend API will listen on `http://localhost:5000`. Health check: `http://localhost:5000/health`.

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Frontend web application will run on `http://localhost:3000`.

---

## 6. Seed Credentials & Role-Based Access Control (RBAC)

All pre-seeded demo accounts share the password: `Password123!`

| Role | Demo Email | Permissions |
| :--- | :--- | :--- |
| **ADMIN** | `admin@landrecord.gov.in` | Full system control, User management, Role assignment, Document management, Land Record CRUD, Verification override, System Audit logs. |
| **OFFICER** | `officer1@landrecord.gov.in` | Upload archival documents, create/edit land records, view verification status, access dashboard. |
| **VERIFIER** | `verifier1@landrecord.gov.in` | Access verification workstation, review extracted fields against scans, approve/reject records, submit corrections with mandatory remarks. |
| **VIEWER** | `viewer1@landrecord.gov.in` | Read-only citizen access to certified land records and document repository. Cannot edit, verify, or provision users. |

*Tip: The `/login` page includes a **One-Click Demo Account Quick Fill** toolbar to switch between all 4 roles instantly.*

---

## 7. REST API Documentation

All API responses strictly adhere to the uniform enterprise JSON format:

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error description",
  "error": { ... }
}
```

### Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user; returns JWT and sets HTTP-only cookie |
| `POST` | `/api/auth/register` | Public | Self-register non-admin account |
| `GET` | `/api/auth/me` | Authenticated | Retrieve currently authenticated user profile |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate session cookie and log logout event |
| `GET` | `/api/dashboard/stats` | Authenticated | Live aggregation of system metrics, Recharts trends & audit logs |
| `GET` | `/api/users` | `ADMIN` | Search, filter, and paginate system users |
| `POST` | `/api/users` | `ADMIN` | Provision a new user with role and jurisdiction |
| `PUT` | `/api/users/:id` | `ADMIN` | Update user details or department assignment |
| `PATCH`| `/api/users/:id/status` | `ADMIN` | Toggle user status (`ACTIVE`, `INACTIVE`, `SUSPENDED`) |
| `DELETE`| `/api/users/:id` | `ADMIN` | Delete a user account |
| `GET` | `/api/documents` | All Roles | List documents with search, language filter, and pagination |
| `POST` | `/api/documents` | `ADMIN`, `OFFICER` | Upload document file via Multer (PDF, JPEG, PNG, etc.) |
| `GET` | `/api/documents/:id` | All Roles | View document metadata and AI pipeline readiness |
| `DELETE`| `/api/documents/:id` | `ADMIN` | Remove document and physical storage file |
| `GET` | `/api/land-records` | All Roles | Search and filter land records catalog by district/status/khasra |
| `POST` | `/api/land-records` | `ADMIN`, `OFFICER` | Register a new cadastral land record |
| `PUT` | `/api/land-records/:id` | `ADMIN`, `OFFICER`, `VERIFIER` | Update cadastral land record information |
| `DELETE`| `/api/land-records/:id` | `ADMIN` | Delete a land record |
| `GET` | `/api/verification/queue` | `ADMIN`, `OFFICER`, `VERIFIER` | Fetch pending and needs-review records awaiting verification |
| `GET` | `/api/verification/history/:id` | `ADMIN`, `OFFICER`, `VERIFIER` | Retrieve audit history of decisions made on a record |
| `POST` | `/api/verification/:id` | `ADMIN`, `VERIFIER` | Submit decision (`APPROVED`, `REJECTED`, `CORRECTED`) with remarks |
| `GET` | `/api/audit` | `ADMIN` | Inspect system-wide administrative audit trail |

---

## 8. Scalability & Architectural Guarantees

1. **MongoDB Index Optimization**:
   - Compound indexes on `{ role: 1, status: 1 }`, `{ district: 1, tehsil: 1, village: 1 }`, `{ processingStatus: 1, uploadedAt: -1 }`.
   - Text indexing on cadastral entities with `{ default_language: "none" }` to guarantee seamless multilingual document indexing without stop-word collisions.
2. **Server-Side Pagination**:
   - No bulk data dump to the frontend; both users, documents, land records, and verification queues use limit/offset skip queries with MongoDB `.countDocuments()`.
3. **Cache Invalidation Lifecycle**:
   - TanStack Query automatically invalidates query keys upon successful mutations (`useCreateUserMutation`, `useUploadDocumentMutation`, `useVerifyRecordMutation`), ensuring the UI stays fresh without unnecessary polling.
4. **Security & Auditability**:
   - Passwords hashed with salted bcrypt rounds.
   - Sensitive password hashes stripped from Mongoose serialization (`toJSON` transform).
   - Every login, creation, modification, verification, and deletion event recorded in `AuditLog`.

---

## 9. License & Team
Developed for the National Land Record Digitization and Validation Initiative.
Phase 1 Web Application Foundation complete and ready for AI Service integration.

---

## 10. Real SMS OTP Setup (MSG91 & India DLT Compliance)

The ILRDVS platform features real SMS OTP authentication powered by the **MSG91 SendOTP API** with an extensible provider abstraction (`OTPProvider`).

### Production SMS Delivery in India (DLT Compliance)
Per Telecom Regulatory Authority of India (TRAI) regulations, commercial SMS delivery requires registration on an authorized DLT telecom portal (e.g. Vilpower, Jio DLT, Airtel DLT):

1. **Entity Registration**: Register your government department or enterprise entity to obtain a registered Principal Entity (PE) ID.
2. **Header / Sender ID Approval**: Register a 6-character alphabetic header (e.g., `ILRDVS`, `MHREV`).
3. **Template Approval**: Register an explicit OTP content template on DLT, for example:
   ```text
   Your OTP for ILRDVS land record verification is {#var#}. Valid for 5 minutes. Do not share with anyone. - Revenue Dept
   ```
4. **MSG91 Dashboard Setup**:
   - Navigate to **MSG91 Dashboard** → **OTP**.
   - Create a new OTP template and link the approved **DLT Template ID** and **Sender ID**.
   - Copy your **Authkey** and the **Template ID**.

### Backend Environment Configuration
Configure the following in `backend/.env` (never commit secrets to version control):
```env
# SMS Provider Selection
SMS_PROVIDER=msg91
SMS_PROVIDER_MODE=production

# MSG91 Credentials
MSG91_AUTH_KEY=your_production_msg91_authkey
MSG91_OTP_TEMPLATE_ID=your_approved_dlt_template_id

# Security & Rate Limiting Controls
OTP_EXPIRY_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_MAX_REQUESTS_PER_HOUR=5
```

### Local Development / Sandbox Mode
For local development without an active MSG91 DLT account:
- Set `SMS_PROVIDER_MODE=sandbox` in `backend/.env`.
- The system generates time-based secure 6-digit codes and logs simulated dispatches to the server console.
- **Production Guardrail**: In `NODE_ENV=production`, `SandboxOTPProvider` is strictly disabled and rejected by the factory engine.

### Security Architecture & Legal Distinction
- **Zero Exposure**: Plaintext OTP values are never returned to the frontend or exposed in API JSON responses.
- **Strict Distinction**: Successful SMS OTP verification confirms **Proof of Mobile Control**. It does **NOT** confer land title ownership. Landholder standing is established solely through the subsequent Cadastral Record Match and User ↔ Land Legal Standing verification pillars.

---

## 11. Real Email OTP Authentication Engine (Resend & Dev Sandbox)

ILRDVS features a production-ready **Email OTP Verification Engine** designed for citizen authentication, applicant verification, and high-trust account operations without requiring telecom DLT registration.

### Email Delivery Provider Architecture
The system employs an extensible `EmailProvider` interface utilizing native Node.js `fetch` (zero heavy external email client dependencies):

1. **Resend (`EMAIL_PROVIDER=resend`)**:
   - Dispatches transactional emails via the high-deliverability Resend REST API (`https://api.resend.com/emails`).
   - Renders a responsive government-branded HTML template featuring a distinct 6-digit code box, expiry warning (5 minutes), and anti-phishing advisory.
2. **Development Sandbox (`EMAIL_PROVIDER=dev`)**:
   - When running locally without a Resend API key, the `DevEmailProvider` generates and formats verification emails directly to the server terminal.
   - **Production Guardrail**: Rejects dev mode if `NODE_ENV=production` is detected.

### Backend Environment Configuration
Add the following variables to `backend/.env`:
```env
# Email Provider Selection ('resend' or 'dev')
EMAIL_PROVIDER=resend

# Resend Credentials
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM_NAME="ILRDVS Land Authority"
EMAIL_FROM_ADDRESS=onboarding@resend.dev

# Cryptographic Salt (Falls back to JWT_SECRET if unset)
OTP_HMAC_SECRET=your_secure_hmac_secret_key

# Security & Expiry Controls
OTP_EXPIRY_MINUTES=5
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_MAX_REQUESTS_PER_HOUR=5
```

### Security Architecture
- **Cryptographically Secure OTPs**: Generated using Node.js `crypto.randomInt(100000, 1000000)`.
- **HMAC-SHA256 Hashed Storage**: Plaintext OTPs are **never saved** to MongoDB and **never logged**. Only the salted HMAC-SHA256 hash is retained.
- **Single-Use Consumption**: Once verified, the database record status transitions to `VERIFIED`. Any re-verification attempt is immediately rejected.
- **Automatic TTL Pruning**: MongoDB TTL index on `expiresAt` automatically cleans up expired verification sessions without scheduled background sweeps.
- **Attempt Locking & Cooldown**: Maximum 5 attempts before session lockout, enforced 60-second resend cooldown, and hourly quota of 5 requests per email.

### REST API Endpoints
| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/email-otp/send` | `{ email, purpose }` | Generates and sends a 6-digit OTP code to the recipient's inbox |
| `POST` | `/api/auth/email-otp/verify` | `{ email, otp, purpose }` | Verifies candidate 6-digit OTP against the HMAC hash |
| `POST` | `/api/auth/email-otp/resend` | `{ email, purpose }` | Re-generates and re-dispatches OTP subject to cooldown controls |

### Legal & Verification Distinction
- **Email Verified**: Confirms only that the applicant controls the submitted email address.
- **Statutory Cadastral Rights**: Ownership, co-ownership, tenancy, or legal heirship is validated independently through the 4-Pillar Cadastral Registry Cross-Check and Revenue Officer Approval workflow.


