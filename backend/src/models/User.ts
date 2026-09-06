import { prisma, withMongoId } from '../config/prisma.js';
import { mongoFilterToPrisma, PrismaQueryBuilder, PrismaSingleQueryBuilder } from '../config/prismaQuery.js';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus, AccountStatus, User as PrismaUser } from '@prisma/client';

export { UserRole, UserStatus, AccountStatus };

export interface IUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  password?: string | null;
  role: UserRole;
  department: string;
  district: string;
  status: UserStatus;
  accountStatus?: AccountStatus;
  preferredLanguage?: string | null;
  emailVerified?: boolean;
  emailVerifiedAt?: Date | null;
  mobile?: string | null;
  mobileVerified?: boolean;
  mobileVerifiedAt?: Date | null;
  mobileVerificationMethod?: string | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
  toObject(): any;
  save(): Promise<IUser>;
}

export function enrichUser(raw: any): IUser | null {
  if (!raw) return null;
  const user = withMongoId({ ...raw }) as IUser;

  user.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  };

  user.toJSON = function () {
    const copy = { ...this };
    delete copy.password;
    return copy;
  };

  user.toObject = function () {
    return { ...this };
  };

  user.save = async function (): Promise<IUser> {
    const updated = await prisma.user.update({
      where: { id: this.id },
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        department: this.department,
        district: this.district,
        status: this.status,
        accountStatus: this.accountStatus,
        preferredLanguage: this.preferredLanguage,
        emailVerified: this.emailVerified,
        emailVerifiedAt: this.emailVerifiedAt,
        mobile: this.mobile,
        mobileVerified: this.mobileVerified,
        mobileVerifiedAt: this.mobileVerifiedAt,
        mobileVerificationMethod: this.mobileVerificationMethod,
        lastLogin: this.lastLogin,
      },
    });
    return enrichUser(updated)!;
  };

  return user;
}

export const User = {
  find(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaQueryBuilder<IUser[]>(async ({ skip, take, orderBy }) => {
      const users = await prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: orderBy || { createdAt: 'desc' },
      });
      return users.map((u) => enrichUser(u)!);
    });
  },

  findOne(filter: any = {}) {
    const where = mongoFilterToPrisma(filter);
    return new PrismaSingleQueryBuilder<IUser>(async ({ orderBy }) => {
      const user = await prisma.user.findFirst({
        where,
        orderBy,
      });
      return enrichUser(user);
    });
  },

  findById(id: string) {
    return new PrismaSingleQueryBuilder<IUser>(async () => {
      if (!id) return null;
      const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
      const user = await prisma.user.findUnique({
        where: { id: cleanId },
      });
      return enrichUser(user);
    });
  },

  async create(data: any): Promise<IUser> {
    let password = data.password;
    if (password && !password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email?.toLowerCase().trim(),
        password,
        role: data.role || 'CITIZEN',
        department: data.department || 'Citizen Services',
        district: data.district || 'Maharashtra',
        status: data.status || 'ACTIVE',
        accountStatus: data.accountStatus || 'ACTIVE',
        preferredLanguage: data.preferredLanguage || 'en',
        emailVerified: Boolean(data.emailVerified),
        emailVerifiedAt: data.emailVerifiedAt,
        mobile: data.mobile,
        mobileVerified: Boolean(data.mobileVerified),
        mobileVerifiedAt: data.mobileVerifiedAt,
        mobileVerificationMethod: data.mobileVerificationMethod || 'SMS',
      },
    });
    return enrichUser(created)!;
  },

  async findByIdAndUpdate(id: string, update: any, options: any = {}): Promise<IUser | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const cleanUpdate = { ...update };
    if (cleanUpdate.password && !cleanUpdate.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      cleanUpdate.password = await bcrypt.hash(cleanUpdate.password, salt);
    }
    const updated = await prisma.user.update({
      where: { id: cleanId },
      data: cleanUpdate,
    });
    return enrichUser(updated);
  },

  async findByIdAndDelete(id: string): Promise<IUser | null> {
    const cleanId = typeof id === 'object' && (id as any).toString ? (id as any).toString() : String(id);
    const deleted = await prisma.user.delete({
      where: { id: cleanId },
    });
    return enrichUser(deleted);
  },

  async countDocuments(filter: any = {}): Promise<number> {
    const where = mongoFilterToPrisma(filter);
    return prisma.user.count({ where });
  },

  async aggregate(pipeline: any[]): Promise<any[]> {
    // Used in dashboard: group by role
    const grouped = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });
    return grouped.map((g) => ({
      role: g.role,
      count: g._count.role,
    }));
  },
};
