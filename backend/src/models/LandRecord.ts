import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder, PrismaSingleQueryBuilder } from '../config/prismaQuery.js';
import { VerificationStatus, LandRecord as PrismaLandRecord } from '@prisma/client';

export { VerificationStatus };

export interface ILandRecord {
  id: string;
  _id: string;
  recordId?: string | null;
  ulpin?: string | null;
  ownerName: string;
  surveyNumber: string;
  gatNumber?: string | null;
  khasraNumber: string;
  khataNumber: string;
  plotArea: string;
  village: string;
  tehsil: string;
  district: string;
  email?: string | null;
  landClassification: string;
  ownershipType: string;
  mutationNumber?: string | null;
  registrationNumber?: string | null;
  sourceDocument?: any;
  sourceDocumentId?: string | null;
  sourceType?: string | null;
  verificationStatus: VerificationStatus;
  isAadhaarSeeded?: boolean;
  aadhaarMasked?: string | null;
  hasActiveDispute?: boolean;
  rccmsCaseNumber?: string | null;
  disputeDetails?: any;
  hasBankCharge?: boolean;
  bankChargeDetails?: any;
  circleRatePerSqm?: number | null;
  calculatedValuation?: number | null;
  isLegacyRecord?: boolean;
  mrrCategory?: string | null;
  createdBy: any;
  createdById: string;
  verifiedBy?: any;
  verifiedById?: string | null;
  confidenceScore: number;
  remarks?: string | null;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
  toJSON(): any;
  save(): Promise<ILandRecord>;
  populate(path: any, select?: any): Promise<ILandRecord>;
}

export const defaultLandRecordInclude = {
  createdBy: true,
  verifiedBy: true,
  sourceDocument: {
    select: {
      id: true,
      documentId: true,
      fileName: true,
      originalName: true,
      filePath: true,
      fileType: true,
      fileSize: true,
      mimeType: true,
      language: true,
      uploadedById: true,
      processingStatus: true,
      documentTypeEnum: true,
      checksum: true,
      version: true,
      pageCount: true,
      isReuploaded: true,
      reuploadedFromId: true,
      uploadedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export function enrichLandRecord(raw: any): ILandRecord | null {
  if (!raw) return null;
  const rec = withMongoId({ ...raw }) as ILandRecord;

  if (raw.sourceDocument) {
    rec.sourceDocument = withMongoId(raw.sourceDocument);
  } else if (raw.sourceDocumentId) {
    rec.sourceDocument = raw.sourceDocumentId;
  }

  if (raw.createdBy) {
    rec.createdBy = withMongoId(raw.createdBy);
  } else if (raw.createdById) {
    rec.createdBy = raw.createdById;
  }

  if (raw.verifiedBy) {
    rec.verifiedBy = withMongoId(raw.verifiedBy);
  } else if (raw.verifiedById) {
    rec.verifiedBy = raw.verifiedById;
  }

  rec.toObject = function () {
    return { ...this };
  };

  rec.toJSON = function () {
    return { ...this };
  };

  rec.save = async function (): Promise<ILandRecord> {
    const cleanVerifiedById =
      this.verifiedById ||
      (this.verifiedBy && typeof this.verifiedBy === 'object' && this.verifiedBy.id
        ? this.verifiedBy.id
        : null);

    const updated = await prisma.landRecord.update({
      where: { id: this.id },
      data: {
        recordId: this.recordId,
        ulpin: this.ulpin,
        ownerName: this.ownerName,
        surveyNumber: this.surveyNumber,
        gatNumber: this.gatNumber,
        khasraNumber: this.khasraNumber,
        khataNumber: this.khataNumber,
        plotArea: this.plotArea,
        village: this.village,
        tehsil: this.tehsil,
        district: this.district,
        email: this.email,
        landClassification: this.landClassification,
        ownershipType: this.ownershipType,
        mutationNumber: this.mutationNumber,
        registrationNumber: this.registrationNumber,
        sourceType: this.sourceType || 'DEMO_REFERENCE_RECORD',
        verificationStatus: this.verificationStatus,
        isAadhaarSeeded: this.isAadhaarSeeded ?? false,
        aadhaarMasked: this.aadhaarMasked,
        hasActiveDispute: this.hasActiveDispute ?? false,
        rccmsCaseNumber: this.rccmsCaseNumber,
        disputeDetails: this.disputeDetails,
        hasBankCharge: this.hasBankCharge ?? false,
        bankChargeDetails: this.bankChargeDetails,
        circleRatePerSqm: this.circleRatePerSqm,
        calculatedValuation: this.calculatedValuation,
        isLegacyRecord: this.isLegacyRecord ?? false,
        mrrCategory: this.mrrCategory,
        verifiedById: cleanVerifiedById || null,
        confidenceScore: this.confidenceScore,
        remarks: this.remarks,
      },
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(updated)!;
  };

  rec.populate = async function (): Promise<ILandRecord> {
    const fresh = await prisma.landRecord.findUnique({
      where: { id: this.id },
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(fresh)!;
  };

  return rec;
}

export const LandRecord = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<ILandRecord[]>(async ({ skip, take, orderBy }) => {
      const records = await prisma.landRecord.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { createdAt: 'desc' },
        include: defaultLandRecordInclude,
      });
      return records.map((r) => enrichLandRecord(r)!);
    });
  },

  findOne(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaSingleQueryBuilder<ILandRecord>(async ({ orderBy }) => {
      const record = await prisma.landRecord.findFirst({
        where,
        include: defaultLandRecordInclude,
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return enrichLandRecord(record);
    });
  },

  findById(id: string) {
    return new PrismaSingleQueryBuilder<ILandRecord>(async () => {
      if (!id) return null;
      const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
      const record = await prisma.landRecord.findUnique({
        where: { id: cleanId },
        include: defaultLandRecordInclude,
      });
      return enrichLandRecord(record);
    });
  },

  async create(data: any): Promise<ILandRecord> {
    const createdById =
      data.createdBy && typeof data.createdBy === 'object' && data.createdBy.toString
        ? data.createdBy.toString()
        : String(data.createdBy);

    const verifiedById = data.verifiedBy
      ? typeof data.verifiedBy === 'object' && data.verifiedBy.toString
        ? data.verifiedBy.toString()
        : String(data.verifiedBy)
      : null;

    const sourceDocumentId = data.sourceDocument
      ? typeof data.sourceDocument === 'object' && data.sourceDocument.toString
        ? data.sourceDocument.toString()
        : String(data.sourceDocument)
      : data.sourceDocumentId || null;

    const created = await prisma.landRecord.create({
      data: {
        recordId: data.recordId || null,
        ownerName: data.ownerName,
        surveyNumber: data.surveyNumber,
        gatNumber: data.gatNumber || null,
        khasraNumber: data.khasraNumber,
        khataNumber: data.khataNumber,
        plotArea: data.plotArea,
        village: data.village,
        tehsil: data.tehsil,
        district: data.district,
        email: data.email || null,
        landClassification: data.landClassification || 'Agricultural',
        ownershipType: data.ownershipType || 'Single Owner',
        mutationNumber: data.mutationNumber || null,
        registrationNumber: data.registrationNumber || null,
        sourceDocumentId,
        sourceType: data.sourceType || 'DEMO_REFERENCE_RECORD',
        verificationStatus: data.verificationStatus || 'PENDING',
        createdById,
        verifiedById,
        confidenceScore: Number(data.confidenceScore) || 0.9,
        remarks: data.remarks || null,
      },
      include: defaultLandRecordInclude,
    });

    return enrichLandRecord(created)!;
  },

  async findByIdAndUpdate(id: string, update: any): Promise<ILandRecord | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const updated = await prisma.landRecord.update({
      where: { id: cleanId },
      data: update,
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(updated);
  },

  async findOneAndUpdate(filter: any, update: any, options: any = {}): Promise<ILandRecord | null> {
    const where = mongoFilterToPrisma(filter);
    const existing = await prisma.landRecord.findFirst({ where });
    if (!existing) return null;

    const updated = await prisma.landRecord.update({
      where: { id: existing.id },
      data: update,
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(updated);
  },

  async findByIdAndDelete(id: string): Promise<ILandRecord | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const deleted = await prisma.landRecord.delete({
      where: { id: cleanId },
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(deleted);
  },

  async findOneAndDelete(filter: any): Promise<ILandRecord | null> {
    const where = mongoFilterToPrisma(filter);
    const existing = await prisma.landRecord.findFirst({ where });
    if (!existing) return null;

    const deleted = await prisma.landRecord.delete({
      where: { id: existing.id },
      include: defaultLandRecordInclude,
    });
    return enrichLandRecord(deleted);
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.landRecord.count({ where });
  },

  async distinct(field: string): Promise<string[]> {
    if (field === 'district') {
      const records = await prisma.landRecord.findMany({
        select: { district: true },
        distinct: ['district'],
      });
      return records.map((r) => r.district);
    }
    if (field === 'landClassification') {
      const records = await prisma.landRecord.findMany({
        select: { landClassification: true },
        distinct: ['landClassification'],
      });
      return records.map((r) => r.landClassification);
    }
    return [];
  },

  async aggregate(pipeline: any[]): Promise<any[]> {
    // Check if grouping by district or verificationStatus
    const isDistrict = pipeline.some((s) => s.$group && s.$group._id === '$district');

    if (isDistrict) {
      const grouped = await prisma.landRecord.groupBy({
        by: ['district'],
        _count: { district: true },
        orderBy: {
          _count: {
            district: 'desc',
          },
        },
        take: 8,
      });

      return grouped.map((g) => ({
        district: g.district,
        count: g._count.district,
      }));
    }

    const grouped = await prisma.landRecord.groupBy({
      by: ['verificationStatus'],
      _count: { verificationStatus: true },
    });

    return grouped.map((g) => ({
      status: g.verificationStatus,
      count: g._count.verificationStatus,
    }));
  },
};
