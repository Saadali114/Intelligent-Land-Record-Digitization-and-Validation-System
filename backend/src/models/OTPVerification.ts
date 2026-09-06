import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder, PrismaSingleQueryBuilder } from '../config/prismaQuery.js';
import { OTPPurpose, OTPStatus } from '@prisma/client';

export { OTPPurpose, OTPStatus };

export interface IOTPVerification {
  id: string;
  _id: string;
  email?: string | null;
  mobile?: string | null;
  otpHash?: string | null;
  providerReqId?: string | null;
  purpose: OTPPurpose;
  status: OTPStatus;
  attempts: number;
  expiresAt: Date;
  lastSentAt: Date;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
  toJSON(): any;
  save(): Promise<IOTPVerification>;
}

export function enrichOTPVerification(raw: any): IOTPVerification | null {
  if (!raw) return null;
  const otp = withMongoId({ ...raw }) as IOTPVerification;

  otp.toObject = function () {
    return { ...this };
  };

  otp.toJSON = function () {
    return { ...this };
  };

  otp.save = async function (): Promise<IOTPVerification> {
    const updated = await prisma.oTPVerification.update({
      where: { id: this.id },
      data: {
        status: this.status,
        attempts: this.attempts,
        verifiedAt: this.verifiedAt,
      },
    });
    return enrichOTPVerification(updated)!;
  };

  return otp;
}

export const OTPVerification = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IOTPVerification[]>(async ({ skip, take, orderBy }) => {
      const records = await prisma.oTPVerification.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return records.map((r) => enrichOTPVerification(r)!);
    });
  },

  findOne(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaSingleQueryBuilder<IOTPVerification>(async ({ orderBy }) => {
      const record = await prisma.oTPVerification.findFirst({
        where,
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return enrichOTPVerification(record);
    });
  },

  async create(data: any): Promise<IOTPVerification> {
    const created = await prisma.oTPVerification.create({
      data: {
        email: data.email?.toLowerCase().trim() || null,
        mobile: data.mobile?.trim() || null,
        otpHash: data.otpHash || null,
        providerReqId: data.providerRequestId || data.providerReqId || null,
        purpose: data.purpose || 'EMAIL_VERIFICATION',
        status: data.status || 'PENDING',
        attempts: Number(data.attempts) || 0,
        expiresAt: data.expiresAt,
        lastSentAt: data.lastSentAt || new Date(),
        verifiedAt: data.verifiedAt || null,
      },
    });

    return enrichOTPVerification(created)!;
  },

  async updateMany(filter: any, update: any): Promise<{ count: number }> {
    const where = mongoFilterToPrisma(filter);
    const cleanData = update.$set ? update.$set : update;
    return prisma.oTPVerification.updateMany({
      where,
      data: cleanData,
    });
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.oTPVerification.count({ where });
  },
};
