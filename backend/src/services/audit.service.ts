import { AuditLog } from '../models/AuditLog.js';
import { PaginationMeta } from '../utils/response.js';

export const getAuditLogsService = async (query: {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (query.action) filter.action = query.action;
  if (query.resourceType) filter.resourceType = query.resourceType;

  const [total, logs] = await Promise.all([
    AuditLog.countDocuments(filter),
    AuditLog.find(filter)
      .populate('userId', 'name email role department')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };

  return { logs, pagination };
};
