import { LandRecord } from '../models/LandRecord.js';
import { DocumentModel } from '../models/Document.js';
import { VerificationRecord, VerificationAction } from '../models/VerificationRecord.js';
import { VerifyRecordInput } from '../schemas/verification.schema.js';
import { PaginationMeta } from '../utils/response.js';
import { logAudit } from '../utils/audit.js';

export const getVerificationQueueService = async (query: {
  page?: number;
  limit?: number;
  district?: string;
  status?: string;
  search?: string;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  let targetStatus: any = query.status;
  if (targetStatus === 'PROCESSED' || targetStatus === 'UPLOADED') {
    targetStatus = 'PENDING';
  }

  const filter: Record<string, any> = {
    verificationStatus: targetStatus ? targetStatus : { $in: ['PENDING', 'NEEDS_REVIEW'] },
  };

  if (query.district) {
    filter.district = { $regex: query.district, $options: 'i' };
  }

  if (query.search) {
    filter.$or = [
      { ownerName: { $regex: query.search, $options: 'i' } },
      { surveyNumber: { $regex: query.search, $options: 'i' } },
      { khasraNumber: { $regex: query.search, $options: 'i' } },
      { village: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [total, records] = await Promise.all([
    LandRecord.countDocuments(filter),
    LandRecord.find(filter)
      .populate('createdBy', 'name email role department district')
      .populate('sourceDocument')
      .sort({ createdAt: -1 })
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

export const getVerificationHistoryService = async (recordId: string) => {
  const history = await VerificationRecord.find({ recordId })
    .populate('verifiedBy', 'name email role department district')
    .sort({ verifiedAt: -1 })
    .lean();

  return history;
};

export const verifyRecordService = async (
  recordId: string,
  input: VerifyRecordInput,
  verifierId: string,
  ip?: string
) => {
  const record = await LandRecord.findById(recordId);
  if (!record) {
    throw new Error('Land record not found');
  }

  const previousData = record.toObject();
  let updatedData: Record<string, any> = {};

  if (input.action === 'APPROVED') {
    record.verificationStatus = 'VERIFIED';
    record.verifiedBy = verifierId as any;
    record.remarks = input.remarks;
    updatedData = { verificationStatus: 'VERIFIED' };
  } else if (input.action === 'REJECTED') {
    record.verificationStatus = 'REJECTED';
    record.verifiedBy = verifierId as any;
    record.remarks = input.remarks;
    updatedData = { verificationStatus: 'REJECTED' };
  } else if (input.action === 'CORRECTED') {
    record.verificationStatus = 'VERIFIED'; // once corrected by verifier, marked verified
    record.verifiedBy = verifierId as any;
    record.remarks = input.remarks;

    if (input.correctedData) {
      Object.assign(record, input.correctedData);
      updatedData = { ...input.correctedData, verificationStatus: 'VERIFIED' };
    }
  }

  await record.save();

  const verificationEntry = await VerificationRecord.create({
    recordId: record._id,
    verifiedBy: verifierId,
    previousData,
    updatedData,
    action: input.action,
    remarks: input.remarks,
    verifiedAt: new Date(),
  });

  const auditActionMap: Record<VerificationAction, 'RECORD_VERIFIED' | 'RECORD_REJECTED' | 'RECORD_CORRECTED'> = {
    APPROVED: 'RECORD_VERIFIED',
    REJECTED: 'RECORD_REJECTED',
    CORRECTED: 'RECORD_CORRECTED',
  };

  await logAudit({
    userId: verifierId as any,
    action: auditActionMap[input.action],
    resourceType: 'LandRecord',
    resourceId: record._id.toString(),
    description: `Record #${record.surveyNumber} ${input.action.toLowerCase()}: ${input.remarks}`,
    ipAddress: ip,
  });

  // Asynchronously dispatch ground-truth feedback to AI microservice for continuous learning
  try {
    const { reportCorrectionToAIService } = await import('./ai-extraction.service.js');
    let originalText = '';
    if (record.sourceDocument) {
      const sourceDoc = await DocumentModel.findById(record.sourceDocument).select('metadata documentId');
      if (sourceDoc) originalText = sourceDoc.metadata?.aiExtraction?.rawTextSnippet || sourceDoc.metadata?.extractedText || '';
    }
    reportCorrectionToAIService({
      documentId: record.sourceDocument ? record.sourceDocument.toString() : record._id.toString(),
      originalData: previousData,
      correctedData: input.correctedData || updatedData,
      originalOcrText: originalText,
      verifierRemarks: input.remarks || '',
    }).catch(err => console.warn('[AI-Feedback] Async reporting error:', err));
  } catch (err: any) {
    console.warn('[AI-Feedback] Failed to trigger feedback:', err);
  }

  return {
    record,
    verificationEntry: await verificationEntry.populate('verifiedBy', 'name email role department'),
  };
};
