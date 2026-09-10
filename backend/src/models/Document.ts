import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder, PrismaSingleQueryBuilder } from '../config/prismaQuery.js';
export type DocumentProcessingStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'OCR_COMPLETED'
  | 'ANALYSIS_COMPLETED'
  | 'PENDING_OFFICER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'PROCESSED'
  | 'FAILED'
  | 'NEEDS_REVIEW';

export type LandDocumentType = 'DOC_7_12' | 'DOC_8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER' | '7_12' | '8A';

export interface IDocument {
  id: string;
  _id: string;
  documentId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  language: string;
  uploadedBy: any;
  uploadedById: string;
  processingStatus: DocumentProcessingStatus;
  documentTypeEnum: LandDocumentType;
  checksum?: string | null;
  version: number;
  pageCount: number;
  isReuploaded: boolean;
  reuploadedFromId?: string | null;
  isLegacyRecord?: boolean;
  mrrCategory?: string | null;
  uploadedAt: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
  toJSON(): any;
  save(): Promise<IDocument>;
  populate(path: any, select?: any): Promise<IDocument>;
}

export function enrichDocument(raw: any): IDocument | null {
  if (!raw) return null;
  const doc = withMongoId({ ...raw }) as IDocument;

  if (doc.metadata && typeof doc.metadata === 'object' && 'previewDataUrl' in doc.metadata) {
    const safeMetadata = { ...(doc.metadata as any) };
    delete safeMetadata.previewDataUrl;
    doc.metadata = safeMetadata;
  }

  if (raw.uploadedBy) {
    doc.uploadedBy = withMongoId(raw.uploadedBy);
  } else if (raw.uploadedById) {
    doc.uploadedBy = raw.uploadedById;
  }

  doc.toObject = function () {
    return { ...this };
  };

  doc.toJSON = function () {
    return { ...this };
  };

  doc.save = async function (): Promise<IDocument> {
    let cleanDocType: any = this.documentTypeEnum;
    if (cleanDocType === '7_12') cleanDocType = 'DOC_7_12';
    else if (cleanDocType === '8A') cleanDocType = 'DOC_8A';

    const updated = await prisma.document.update({
      where: { id: this.id },
      data: {
        fileName: this.fileName,
        originalName: this.originalName,
        filePath: this.filePath,
        fileType: this.fileType,
        fileSize: this.fileSize,
        mimeType: this.mimeType,
        language: this.language,
        processingStatus: this.processingStatus as any,
        documentTypeEnum: cleanDocType,
        checksum: this.checksum,
        version: this.version,
        pageCount: this.pageCount,
        isReuploaded: this.isReuploaded,
        reuploadedFromId: this.reuploadedFromId,
        isLegacyRecord: this.isLegacyRecord ?? false,
        mrrCategory: this.mrrCategory,
        metadata: this.metadata,
      } as any,
      include: {
        uploadedBy: true,
      },
    });
    return enrichDocument(updated)!;
  };

  doc.populate = async function (): Promise<IDocument> {
    const fresh = await prisma.document.findUnique({
      where: { id: this.id },
      include: { uploadedBy: true },
    });
    return enrichDocument(fresh)!;
  };

  return doc;
}

export const DocumentModel = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IDocument[]>(async ({ skip, take, orderBy }) => {
      const documents = await prisma.document.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { uploadedAt: 'desc' },
        include: { uploadedBy: true },
      });
      return documents.map((d: any) => enrichDocument(d)!);
    });
  },

  findOne(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaSingleQueryBuilder<IDocument>(async ({ orderBy }) => {
      const doc = await prisma.document.findFirst({
        where,
        include: { uploadedBy: true },
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return enrichDocument(doc);
    });
  },

  findById(id: string) {
    return new PrismaSingleQueryBuilder<IDocument>(async () => {
      if (!id) return null;
      const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
      const doc = await prisma.document.findUnique({
        where: { id: cleanId },
        include: { uploadedBy: true },
      });
      return enrichDocument(doc);
    });
  },

  async create(data: any): Promise<IDocument> {
    const uploadedById =
      data.uploadedBy && typeof data.uploadedBy === 'object' && data.uploadedBy.toString
        ? data.uploadedBy.toString()
        : String(data.uploadedBy);

    // Map doc type enum
    let docTypeEnum: LandDocumentType = 'DOC_7_12';
    if (data.documentTypeEnum === '8A' || data.documentTypeEnum === 'DOC_8A') docTypeEnum = 'DOC_8A';
    else if (data.documentTypeEnum === 'FERFAR') docTypeEnum = 'FERFAR';
    else if (data.documentTypeEnum === 'SALE_DEED') docTypeEnum = 'SALE_DEED';
    else if (data.documentTypeEnum === 'OTHER') docTypeEnum = 'OTHER';

    const created = await prisma.document.create({
      data: {
        documentId: data.documentId,
        fileName: data.fileName,
        originalName: data.originalName,
        filePath: data.filePath,
        fileType: data.fileType,
        fileSize: Number(data.fileSize) || 0,
        mimeType: data.mimeType,
        language: data.language || 'Marathi',
        uploadedById,
        processingStatus: data.processingStatus || 'UPLOADED',
        documentTypeEnum: docTypeEnum,
        checksum: data.checksum || null,
        version: Number(data.version) || 1,
        pageCount: Number(data.pageCount) || 1,
        isReuploaded: Boolean(data.isReuploaded),
        reuploadedFromId: data.reuploadedFromId || null,
        uploadedAt: data.uploadedAt || new Date(),
        metadata: data.metadata || {},
      },
      include: {
        uploadedBy: true,
      },
    });

    return enrichDocument(created)!;
  },

  async findByIdAndUpdate(id: string, update: any): Promise<IDocument | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const updated = await prisma.document.update({
      where: { id: cleanId },
      data: update,
      include: { uploadedBy: true },
    });
    return enrichDocument(updated);
  },

  async findByIdAndDelete(id: string): Promise<IDocument | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const deleted = await prisma.document.delete({
      where: { id: cleanId },
      include: { uploadedBy: true },
    });
    return enrichDocument(deleted);
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.document.count({ where });
  },

  async aggregate(pipeline: any[]): Promise<any[]> {
    // Check if pipeline is for processingStatus or monthly trend
    const isMonthly = pipeline.some((stage) => stage.$group && stage.$group._id && stage.$group._id.year);

    if (isMonthly) {
      const docs = await prisma.document.findMany({
        select: { uploadedAt: true },
        orderBy: { uploadedAt: 'asc' },
      });

      const monthMap = new Map<string, number>();
      for (const d of docs) {
        const dt = new Date(d.uploadedAt);
        const period = `${dt.getMonth() + 1}/${dt.getFullYear()}`;
        monthMap.set(period, (monthMap.get(period) || 0) + 1);
      }

      return Array.from(monthMap.entries()).slice(-12).map(([period, count]) => ({
        period,
        count,
      }));
    }

    // Default: grouping by processingStatus
    const grouped = await prisma.document.groupBy({
      by: ['processingStatus'],
      _count: { processingStatus: true },
    });

    return grouped.map((g: any) => ({
      status: g.processingStatus,
      count: g._count.processingStatus,
    }));
  },
};
