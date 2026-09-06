import { prisma, withMongoId } from './prisma.js';

export function normalizeMongoId(id: any): string {
  if (!id) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && id.toString) return id.toString();
  return String(id);
}

/**
 * Transforms MongoDB-style filters into Prisma-compatible `where` objects.
 */
export function mongoFilterToPrisma(filter: any): any {
  if (!filter || typeof filter !== 'object') return {};

  const where: any = {};

  for (const key of Object.keys(filter)) {
    const value = filter[key];

    if (key === '$or') {
      where.OR = Array.isArray(value) ? value.map(mongoFilterToPrisma) : [];
      continue;
    }

    if (key === '$and') {
      where.AND = Array.isArray(value) ? value.map(mongoFilterToPrisma) : [];
      continue;
    }

    // Map _id -> id
    const targetKey =
      key === '_id'
        ? 'id'
        : key === 'sourceDocument'
        ? 'sourceDocumentId'
        : key === 'uploadedBy'
        ? 'uploadedById'
        : key === 'createdBy'
        ? 'createdById'
        : key === 'verifiedBy'
        ? 'verifiedById'
        : key;

    if (value === undefined) continue;

    // Handle RegExp or { $regex: '...', $options: 'i' }
    if (value instanceof RegExp) {
      const cleanRegex = value.source.replace(/^\^|\$$/g, '').replace(/\\/g, '');
      where[targetKey] = {
        contains: cleanRegex,
        mode: value.flags.includes('i') ? 'insensitive' : 'default',
      };
    } else if (value && typeof value === 'object' && !(value instanceof Date)) {
      if ('$regex' in value) {
        const pattern = String(value.$regex).replace(/^\^|\$$/g, '');
        where[targetKey] = {
          contains: pattern,
          mode: value.$options?.includes('i') ? 'insensitive' : 'default',
        };
      } else if ('$in' in value) {
        where[targetKey] = {
          in: Array.isArray(value.$in)
            ? value.$in.map((v: any) => (v && typeof v === 'object' && v.toString ? v.toString() : v))
            : value.$in,
        };
      } else if ('$ne' in value) {
        where[targetKey] = {
          not: value.$ne && typeof value.$ne === 'object' && value.$ne.toString ? value.$ne.toString() : value.$ne,
        };
      } else if ('$gte' in value || '$lte' in value || '$gt' in value || '$lt' in value) {
        where[targetKey] = {};
        if ('$gte' in value) where[targetKey].gte = value.$gte;
        if ('$lte' in value) where[targetKey].lte = value.$lte;
        if ('$gt' in value) where[targetKey].gt = value.$gt;
        if ('$lt' in value) where[targetKey].lt = value.$lt;
      } else {
        where[targetKey] = value;
      }
    } else {
      // Normal primitive
      if (typeof value === 'object' && value && value._bsontype) {
        where[targetKey] = value.toString();
      } else {
        where[targetKey] = value;
      }
    }
  }

  return where;
}

export class PrismaQueryBuilder<T> implements PromiseLike<T> {
  private _skip?: number;
  private _take?: number;
  private _orderBy?: any;
  private _include?: any;
  private _select?: any;

  constructor(
    private executor: (params: {
      skip?: number;
      take?: number;
      orderBy?: any;
      include?: any;
      select?: any;
    }) => Promise<T>
  ) {}

  sort(sortArg: any): this {
    if (!sortArg) return this;
    if (typeof sortArg === 'object') {
      const orderBy: any = {};
      for (const k of Object.keys(sortArg)) {
        const dir = sortArg[k];
        const field = k === '_id' ? 'id' : k;
        orderBy[field] = dir === 1 || dir === 'asc' ? 'asc' : 'desc';
      }
      this._orderBy = orderBy;
    } else if (typeof sortArg === 'string') {
      const isDesc = sortArg.startsWith('-');
      const field = isDesc ? sortArg.substring(1) : sortArg;
      this._orderBy = { [field === '_id' ? 'id' : field]: isDesc ? 'desc' : 'asc' };
    }
    return this;
  }

  skip(n: number): this {
    this._skip = Math.max(0, n);
    return this;
  }

  limit(n: number): this {
    this._take = Math.max(0, n);
    return this;
  }

  populate(..._args: any[]): this {
    // Relationships are auto-included or resolved by the executor
    return this;
  }

  select(..._args: any[]): this {
    return this;
  }

  lean(): this {
    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.executor({
      skip: this._skip,
      take: this._take,
      orderBy: this._orderBy,
      include: this._include,
      select: this._select,
    }).then(onfulfilled, onrejected);
  }
}

export class PrismaSingleQueryBuilder<T> implements PromiseLike<T | null> {
  private _orderBy?: any;
  private _include?: any;

  constructor(
    private executor: (params: { orderBy?: any; include?: any }) => Promise<T | null>
  ) {}

  sort(sortArg: any): this {
    if (!sortArg) return this;
    if (typeof sortArg === 'object') {
      const orderBy: any = {};
      for (const k of Object.keys(sortArg)) {
        const dir = sortArg[k];
        const field = k === '_id' ? 'id' : k;
        orderBy[field] = dir === 1 || dir === 'asc' ? 'asc' : 'desc';
      }
      this._orderBy = orderBy;
    } else if (typeof sortArg === 'string') {
      const isDesc = sortArg.startsWith('-');
      const field = isDesc ? sortArg.substring(1) : sortArg;
      this._orderBy = { [field === '_id' ? 'id' : field]: isDesc ? 'desc' : 'asc' };
    }
    return this;
  }

  populate(..._args: any[]): this {
    return this;
  }

  select(..._args: any[]): this {
    return this;
  }

  lean(): this {
    return this;
  }

  then<TResult1 = T | null, TResult2 = never>(
    onfulfilled?: ((value: T | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.executor({
      orderBy: this._orderBy,
      include: this._include,
    }).then(onfulfilled, onrejected);
  }
}

