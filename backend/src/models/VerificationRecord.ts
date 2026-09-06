import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder } from '../config/prismaQuery.js';
import { VerificationAction } from '@prisma/client';

export { VerificationAction };

export interface IVerificationRecord {
  id: string;
  _id: string;
  recordId: any;
  verifiedBy: any;
  verifiedById: string;
  previousData: Record<string, any>;
  updatedData: Record<string, any>;
  action: VerificationAction;
  remarks: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
  toJSON(): any;
  populate(path: any, select?: any): Promise<IVerificationRecord>;
}

export function enrichVerificationRecord(raw: any): IVerificationRecord | null {
  if (!raw) return null;
  const vr = withMongoId({ ...raw }) as IVerificationRecord;

  if (raw.verifiedBy) {
    vr.verifiedBy = withMongoId(raw.verifiedBy);
  }

  vr.toObject = function () {
    return { ...this };
  };

  vr.toJSON = function () {
    return { ...this };
  };

  vr.populate = async function (): Promise<IVerificationRecord> {
    const fresh = await prisma.verificationRecord.findUnique({
      where: { id: this.id },
      include: {
        verifiedBy: true,
        landRecord: true,
      },
    });
    return enrichVerificationRecord(fresh)!;
  };

  return vr;
}

export const VerificationRecord = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IVerificationRecord[]>(async ({ skip, take, orderBy }) => {
      const records = await prisma.verificationRecord.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { verifiedAt: 'desc' },
        include: {
          verifiedBy: true,
          landRecord: true,
        },
      });
      return records.map((r) => enrichVerificationRecord(r)!);
    });
  },

  async create(data: any): Promise<IVerificationRecord> {
    const recordId =
      data.recordId && typeof data.recordId === 'object' && data.recordId.toString
        ? data.recordId.toString()
        : String(data.recordId);

    const verifiedById =
      data.verifiedBy && typeof data.verifiedBy === 'object' && data.verifiedBy.toString
        ? data.verifiedBy.toString()
        : String(data.verifiedBy);

    const created = await prisma.verificationRecord.create({
      data: {
        recordId,
        verifiedById,
        previousData: data.previousData || {},
        updatedData: data.updatedData || {},
        action: data.action,
        remarks: data.remarks || '',
        verifiedAt: data.verifiedAt || new Date(),
      },
      include: {
        verifiedBy: true,
        landRecord: true,
      },
    });

    return enrichVerificationRecord(created)!;
  },
};
