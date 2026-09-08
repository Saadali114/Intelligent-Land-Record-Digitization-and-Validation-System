-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER', 'CITIZEN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_VERIFICATION', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "DocumentProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'OCR_COMPLETED', 'ANALYSIS_COMPLETED', 'PENDING_OFFICER_REVIEW', 'ACTION_REQUIRED', 'VERIFIED', 'REJECTED', 'PROCESSED', 'FAILED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "LandDocumentType" AS ENUM ('7_12', '8A', 'FERFAR', 'SALE_DEED', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'OCR_COMPLETED', 'ANALYSIS_COMPLETED', 'PENDING_OFFICER_REVIEW', 'ACTION_REQUIRED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OfficerApplicationStatus" AS ENUM ('PENDING_EMAIL_VERIFICATION', 'PENDING_APPROVAL', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OTPPurpose" AS ENUM ('REGISTRATION', 'LOGIN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'MOBILE_VERIFICATION');

-- CreateEnum
CREATE TYPE "OTPStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED', 'LOCKED');

-- CreateEnum
CREATE TYPE "VerificationAction" AS ENUM ('APPROVED', 'REJECTED', 'CORRECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "department" TEXT NOT NULL DEFAULT 'Citizen Services',
    "district" TEXT NOT NULL DEFAULT 'Maharashtra',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "preferredLanguage" TEXT DEFAULT 'en',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "mobile" TEXT,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerifiedAt" TIMESTAMP(3),
    "mobileVerificationMethod" TEXT DEFAULT 'SMS',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Marathi',
    "uploadedById" TEXT NOT NULL,
    "processingStatus" "DocumentProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "documentTypeEnum" "LandDocumentType" NOT NULL DEFAULT '7_12',
    "checksum" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "pageCount" INTEGER NOT NULL DEFAULT 1,
    "isReuploaded" BOOLEAN NOT NULL DEFAULT false,
    "reuploadedFromId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_records" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,
    "ownerName" TEXT NOT NULL,
    "surveyNumber" TEXT NOT NULL,
    "gatNumber" TEXT,
    "khasraNumber" TEXT NOT NULL,
    "khataNumber" TEXT NOT NULL,
    "plotArea" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "tehsil" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "email" TEXT,
    "landClassification" TEXT NOT NULL DEFAULT 'Agricultural',
    "ownershipType" TEXT NOT NULL DEFAULT 'Single Owner',
    "mutationNumber" TEXT,
    "registrationNumber" TEXT,
    "sourceDocumentId" TEXT,
    "sourceType" TEXT DEFAULT 'DEMO_REFERENCE_RECORD',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" TEXT NOT NULL,
    "verifiedById" TEXT,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_workflows" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT,
    "documentId" TEXT,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'PENDING_OFFICER_REVIEW',
    "casePreset" TEXT,
    "applicant" JSONB NOT NULL,
    "documentData" JSONB NOT NULL,
    "ocrData" JSONB,
    "anomalyAnalysis" JSONB,
    "clarificationHistory" JSONB DEFAULT '[]',
    "officialRecordMatch" JSONB NOT NULL,
    "relationshipVerification" JSONB NOT NULL,
    "riskAssessment" JSONB NOT NULL,
    "officerDecision" JSONB NOT NULL,
    "auditTimeline" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_records" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "previousData" JSONB NOT NULL DEFAULT '{}',
    "updatedData" JSONB NOT NULL DEFAULT '{}',
    "action" "VerificationAction" NOT NULL,
    "remarks" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officer_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedRole" TEXT NOT NULL DEFAULT 'OFFICER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "taluka" TEXT,
    "phone" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "OfficerApplicationStatus" NOT NULL DEFAULT 'PENDING_EMAIL_VERIFICATION',
    "rejectionReason" TEXT,
    "clarificationMessage" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedById" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "officer_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "otpHash" TEXT,
    "providerReqId" TEXT,
    "purpose" "OTPPurpose" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "status" "OTPStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL DEFAULT '127.0.0.1',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE INDEX "users_role_accountStatus_idx" ON "users"("role", "accountStatus");

-- CreateIndex
CREATE INDEX "users_district_department_idx" ON "users"("district", "department");

-- CreateIndex
CREATE INDEX "users_emailVerified_idx" ON "users"("emailVerified");

-- CreateIndex
CREATE INDEX "users_mobile_idx" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "documents_documentId_key" ON "documents"("documentId");

-- CreateIndex
CREATE INDEX "documents_uploadedById_idx" ON "documents"("uploadedById");

-- CreateIndex
CREATE INDEX "documents_processingStatus_uploadedAt_idx" ON "documents"("processingStatus", "uploadedAt");

-- CreateIndex
CREATE INDEX "documents_language_processingStatus_idx" ON "documents"("language", "processingStatus");

-- CreateIndex
CREATE INDEX "documents_checksum_idx" ON "documents"("checksum");

-- CreateIndex
CREATE INDEX "documents_isReuploaded_idx" ON "documents"("isReuploaded");

-- CreateIndex
CREATE INDEX "documents_reuploadedFromId_idx" ON "documents"("reuploadedFromId");

-- CreateIndex
CREATE INDEX "land_records_recordId_idx" ON "land_records"("recordId");

-- CreateIndex
CREATE INDEX "land_records_ownerName_idx" ON "land_records"("ownerName");

-- CreateIndex
CREATE INDEX "land_records_surveyNumber_idx" ON "land_records"("surveyNumber");

-- CreateIndex
CREATE INDEX "land_records_gatNumber_idx" ON "land_records"("gatNumber");

-- CreateIndex
CREATE INDEX "land_records_khasraNumber_idx" ON "land_records"("khasraNumber");

-- CreateIndex
CREATE INDEX "land_records_khataNumber_idx" ON "land_records"("khataNumber");

-- CreateIndex
CREATE INDEX "land_records_village_idx" ON "land_records"("village");

-- CreateIndex
CREATE INDEX "land_records_tehsil_idx" ON "land_records"("tehsil");

-- CreateIndex
CREATE INDEX "land_records_district_idx" ON "land_records"("district");

-- CreateIndex
CREATE INDEX "land_records_email_idx" ON "land_records"("email");

-- CreateIndex
CREATE INDEX "land_records_district_tehsil_village_idx" ON "land_records"("district", "tehsil", "village");

-- CreateIndex
CREATE INDEX "land_records_district_verificationStatus_idx" ON "land_records"("district", "verificationStatus");

-- CreateIndex
CREATE INDEX "land_records_surveyNumber_village_idx" ON "land_records"("surveyNumber", "village");

-- CreateIndex
CREATE INDEX "land_records_createdById_idx" ON "land_records"("createdById");

-- CreateIndex
CREATE INDEX "land_records_verifiedById_idx" ON "land_records"("verifiedById");

-- CreateIndex
CREATE INDEX "land_records_createdAt_idx" ON "land_records"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_workflows_applicationId_key" ON "verification_workflows"("applicationId");

-- CreateIndex
CREATE INDEX "verification_workflows_userId_idx" ON "verification_workflows"("userId");

-- CreateIndex
CREATE INDEX "verification_workflows_documentId_idx" ON "verification_workflows"("documentId");

-- CreateIndex
CREATE INDEX "verification_workflows_status_idx" ON "verification_workflows"("status");

-- CreateIndex
CREATE INDEX "verification_workflows_casePreset_idx" ON "verification_workflows"("casePreset");

-- CreateIndex
CREATE INDEX "verification_workflows_createdAt_idx" ON "verification_workflows"("createdAt");

-- CreateIndex
CREATE INDEX "verification_records_recordId_verifiedAt_idx" ON "verification_records"("recordId", "verifiedAt");

-- CreateIndex
CREATE INDEX "verification_records_verifiedById_idx" ON "verification_records"("verifiedById");

-- CreateIndex
CREATE UNIQUE INDEX "officer_applications_employeeId_key" ON "officer_applications"("employeeId");

-- CreateIndex
CREATE INDEX "officer_applications_userId_idx" ON "officer_applications"("userId");

-- CreateIndex
CREATE INDEX "officer_applications_email_idx" ON "officer_applications"("email");

-- CreateIndex
CREATE INDEX "officer_applications_district_idx" ON "officer_applications"("district");

-- CreateIndex
CREATE INDEX "officer_applications_status_createdAt_idx" ON "officer_applications"("status", "createdAt");

-- CreateIndex
CREATE INDEX "officer_applications_district_status_idx" ON "officer_applications"("district", "status");

-- CreateIndex
CREATE INDEX "otp_verifications_email_purpose_status_createdAt_idx" ON "otp_verifications"("email", "purpose", "status", "createdAt");

-- CreateIndex
CREATE INDEX "otp_verifications_mobile_purpose_status_createdAt_idx" ON "otp_verifications"("mobile", "purpose", "status", "createdAt");

-- CreateIndex
CREATE INDEX "otp_verifications_expiresAt_idx" ON "otp_verifications"("expiresAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_timestamp_idx" ON "audit_logs"("action", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_records" ADD CONSTRAINT "land_records_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_records" ADD CONSTRAINT "land_records_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_records" ADD CONSTRAINT "land_records_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_workflows" ADD CONSTRAINT "verification_workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_workflows" ADD CONSTRAINT "verification_workflows_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "land_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer_applications" ADD CONSTRAINT "officer_applications_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
