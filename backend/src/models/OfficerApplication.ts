import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder, PrismaSingleQueryBuilder } from '../config/prismaQuery.js';
import { OfficerApplicationStatus } from '@prisma/client';

export { OfficerApplicationStatus };

export interface IOfficerApplication {
  id: string;
  _id: string;
  userId: any;
  requestedRole: 'OFFICER';
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  office: string;
  district: string;
  taluka?: string | null;
  phone?: string | null;
  preferredLanguage: string;
  emailVerified: boolean;
  status: OfficerApplicationStatus;
  rejectionReason?: string | null;
  clarificationMessage?: string | null;
  approvedBy?: any;
  approvedById?: string | null;
  approvedAt?: Date | null;
  rejectedBy?: any;
  rejectedById?: string | null;
  rejectedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
  toJSON(): any;
  save(): Promise<IOfficerApplication>;
  populate(path: any, select?: any): Promise<IOfficerApplication>;
}

export function enrichOfficerApplication(raw: any): IOfficerApplication | null {
  if (!raw) return null;
  const app = withMongoId({ ...raw }) as IOfficerApplication;

  if (raw.user) {
    app.userId = withMongoId(raw.user);
  }
  if (raw.approvedBy) {
    app.approvedBy = withMongoId(raw.approvedBy);
  }
  if (raw.rejectedBy) {
    app.rejectedBy = withMongoId(raw.rejectedBy);
  }

  app.toObject = function () {
    return { ...this };
  };

  app.toJSON = function () {
    return { ...this };
  };

  app.save = async function (): Promise<IOfficerApplication> {
    const cleanUserId =
      this.userId && typeof this.userId === 'object' && this.userId.id
        ? this.userId.id
        : typeof this.userId === 'string'
        ? this.userId
        : raw.userId;

    const cleanApprovedById =
      this.approvedBy && typeof this.approvedBy === 'object' && this.approvedBy.id
        ? this.approvedBy.id
        : typeof this.approvedBy === 'string'
        ? this.approvedBy
        : this.approvedById;

    const cleanRejectedById =
      this.rejectedBy && typeof this.rejectedBy === 'object' && this.rejectedBy.id
        ? this.rejectedBy.id
        : typeof this.rejectedBy === 'string'
        ? this.rejectedBy
        : this.rejectedById;

    const updated = await prisma.officerApplication.update({
      where: { id: this.id },
      data: {
        userId: cleanUserId,
        name: this.name,
        email: this.email,
        employeeId: this.employeeId,
        department: this.department,
        designation: this.designation,
        office: this.office,
        district: this.district,
        taluka: this.taluka,
        phone: this.phone,
        preferredLanguage: this.preferredLanguage,
        emailVerified: this.emailVerified,
        status: this.status,
        rejectionReason: this.rejectionReason,
        clarificationMessage: this.clarificationMessage,
        approvedById: cleanApprovedById || null,
        approvedAt: this.approvedAt,
        rejectedById: cleanRejectedById || null,
        rejectedAt: this.rejectedAt,
      },
      include: {
        user: true,
        approvedBy: true,
        rejectedBy: true,
      },
    });
    return enrichOfficerApplication(updated)!;
  };

  app.populate = async function (): Promise<IOfficerApplication> {
    const fresh = await prisma.officerApplication.findUnique({
      where: { id: this.id },
      include: {
        user: true,
        approvedBy: true,
        rejectedBy: true,
      },
    });
    return enrichOfficerApplication(fresh)!;
  };

  return app;
}

export const OfficerApplication = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IOfficerApplication[]>(async ({ skip, take, orderBy }) => {
      const apps = await prisma.officerApplication.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          user: true,
          approvedBy: true,
          rejectedBy: true,
        },
      });
      return apps.map((a) => enrichOfficerApplication(a)!);
    });
  },

  findOne(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaSingleQueryBuilder<IOfficerApplication>(async ({ orderBy }) => {
      const app = await prisma.officerApplication.findFirst({
        where,
        include: {
          user: true,
          approvedBy: true,
          rejectedBy: true,
        },
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return enrichOfficerApplication(app);
    });
  },

  findById(id: string) {
    return new PrismaSingleQueryBuilder<IOfficerApplication>(async () => {
      if (!id) return null;
      const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
      const app = await prisma.officerApplication.findUnique({
        where: { id: cleanId },
        include: {
          user: true,
          approvedBy: true,
          rejectedBy: true,
        },
      });
      return enrichOfficerApplication(app);
    });
  },

  async create(data: any): Promise<IOfficerApplication> {
    const userId =
      data.userId && typeof data.userId === 'object' && data.userId.toString
        ? data.userId.toString()
        : String(data.userId);

    const created = await prisma.officerApplication.create({
      data: {
        userId,
        requestedRole: data.requestedRole || 'OFFICER',
        name: data.name,
        email: data.email?.toLowerCase().trim(),
        employeeId: data.employeeId,
        department: data.department,
        designation: data.designation,
        office: data.office,
        district: data.district,
        taluka: data.taluka || null,
        phone: data.phone || null,
        preferredLanguage: data.preferredLanguage || 'en',
        emailVerified: Boolean(data.emailVerified),
        status: data.status || 'PENDING_EMAIL_VERIFICATION',
        rejectionReason: data.rejectionReason || null,
        clarificationMessage: data.clarificationMessage || null,
      },
      include: {
        user: true,
        approvedBy: true,
        rejectedBy: true,
      },
    });

    return enrichOfficerApplication(created)!;
  },

  async findOneAndUpdate(filter: any, update: any, options: any = {}): Promise<IOfficerApplication | null> {
    const where = mongoFilterToPrisma(filter);
    const existing = await prisma.officerApplication.findFirst({ where });
    if (!existing) return null;

    const updated = await prisma.officerApplication.update({
      where: { id: existing.id },
      data: update,
      include: {
        user: true,
        approvedBy: true,
        rejectedBy: true,
      },
    });
    return enrichOfficerApplication(updated);
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.officerApplication.count({ where });
  },
};
