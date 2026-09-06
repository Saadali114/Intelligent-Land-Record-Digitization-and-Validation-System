import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Ensures backward compatibility with frontend expecting MongoDB `_id`.
 * Injects `_id = id` recursively for objects and arrays.
 */
export function withMongoId<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map((item) => withMongoId(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const record = data as Record<string, any>;
    const copy: Record<string, any> = { ...record };
    if ('id' in record && !('_id' in record)) {
      copy._id = record.id;
    }
    for (const key of Object.keys(copy)) {
      if (typeof copy[key] === 'object' && copy[key] !== null && !(copy[key] instanceof Date)) {
        copy[key] = withMongoId(copy[key]);
      }
    }
    return copy as T;
  }
  return data;
}

export default prisma;
