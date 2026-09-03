import { LandRecord, ILandRecord } from '../models/LandRecord.js';
import { CreateLandRecordInput, UpdateLandRecordInput, LandRecordQueryInput } from '../schemas/land-record.schema.js';
import { PaginationMeta } from '../utils/response.js';
import { logAudit } from '../utils/audit.js';

export const getLandRecordsService = async (query: LandRecordQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.district) {
    filter.district = { $regex: query.district, $options: 'i' };
  }
  if (query.tehsil) {
    filter.tehsil = { $regex: query.tehsil, $options: 'i' };
  }
  if (query.village) {
    filter.village = { $regex: query.village, $options: 'i' };
  }
  if (query.status) {
    filter.verificationStatus = query.status;
  }
  if (query.landClassification) {
    filter.landClassification = query.landClassification;
  }
  if (query.search) {
    filter.$or = [
      { ownerName: { $regex: query.search, $options: 'i' } },
      { surveyNumber: { $regex: query.search, $options: 'i' } },
      { khasraNumber: { $regex: query.search, $options: 'i' } },
      { khataNumber: { $regex: query.search, $options: 'i' } },
      { village: { $regex: query.search, $options: 'i' } },
      { district: { $regex: query.search, $options: 'i' } },
      { mutationNumber: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortField = query.sortBy || 'createdAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

  const [total, records] = await Promise.all([
    LandRecord.countDocuments(filter),
    LandRecord.find(filter)
      .populate('createdBy', 'name email role department district')
      .populate('verifiedBy', 'name email role department district')
      .populate('sourceDocument', 'documentId fileName originalName language processingStatus')
      .sort({ [sortField]: sortDirection })
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

  return { records, pagination };
};

export const getLandRecordByIdService = async (id: string) => {
  const record = await LandRecord.findById(id)
    .populate('createdBy', 'name email role department district')
    .populate('verifiedBy', 'name email role department district')
    .populate('sourceDocument')
    .lean();

  if (!record) {
    throw new Error('Land record not found');
  }
  return record;
};

export const createLandRecordService = async (
  input: CreateLandRecordInput,
  userId: string,
  ip?: string
) => {
  const record = await LandRecord.create({
    ...input,
    createdBy: userId,
    verificationStatus: 'PENDING',
  });

  await logAudit({
    userId: userId as any,
    action: 'RECORD_CREATED',
    resourceType: 'LandRecord',
    resourceId: record._id.toString(),
    description: `Created land record for ${record.ownerName}, Survey #${record.surveyNumber}, ${record.village}`,
    ipAddress: ip,
  });

  return record.populate('createdBy', 'name email role');
};

export const updateLandRecordService = async (
  id: string,
  input: UpdateLandRecordInput,
  userId: string,
  ip?: string
) => {
  const record = await LandRecord.findById(id);
  if (!record) {
    throw new Error('Land record not found');
  }

  Object.assign(record, input);
  await record.save();

  await logAudit({
    userId: userId as any,
    action: 'RECORD_UPDATED',
    resourceType: 'LandRecord',
    resourceId: id,
    description: `Updated land record #${record.surveyNumber} in ${record.village}`,
    ipAddress: ip,
  });

  return record.populate([
    { path: 'createdBy', select: 'name email role' },
    { path: 'verifiedBy', select: 'name email role' },
    { path: 'sourceDocument' },
  ]);
};

export const deleteLandRecordService = async (id: string, userId: string, ip?: string) => {
  const record = await LandRecord.findById(id);
  if (!record) {
    throw new Error('Land record not found');
  }

  await LandRecord.findByIdAndDelete(id);

  await logAudit({
    userId: userId as any,
    action: 'RECORD_DELETED',
    resourceType: 'LandRecord',
    resourceId: id,
    description: `Deleted land record for ${record.ownerName}, Survey #${record.surveyNumber}`,
    ipAddress: ip,
  });

  return { id };
};

export const getFilterMetadataService = async () => {
  const [districts, classifications] = await Promise.all([
    LandRecord.distinct('district'),
    LandRecord.distinct('landClassification'),
  ]);
  return { districts, classifications };
};
