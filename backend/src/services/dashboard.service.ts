import { User } from '../models/User.js';
import { DocumentModel } from '../models/Document.js';
import { LandRecord } from '../models/LandRecord.js';
import { AuditLog } from '../models/AuditLog.js';

export const getDashboardStatsService = async () => {
  const [
    totalUsers,
    totalDocuments,
    totalLandRecords,
    pendingVerification,
    verifiedRecords,
    rejectedRecords,
    needsReviewRecords,
    documentsProcessing,
    documentsUploaded,
    documentsProcessed,
    verificationStatusCounts,
    documentStatusCounts,
    userRoleCounts,
    districtWiseRecords,
    recentAuditLogs,
    monthlyProcessing,
  ] = await Promise.all([
    User.countDocuments(),
    DocumentModel.countDocuments(),
    LandRecord.countDocuments(),
    LandRecord.countDocuments({ verificationStatus: 'PENDING' }),
    LandRecord.countDocuments({ verificationStatus: 'VERIFIED' }),
    LandRecord.countDocuments({ verificationStatus: 'REJECTED' }),
    LandRecord.countDocuments({ verificationStatus: 'NEEDS_REVIEW' }),
    DocumentModel.countDocuments({ processingStatus: 'PROCESSING' }),
    DocumentModel.countDocuments({ processingStatus: 'UPLOADED' }),
    DocumentModel.countDocuments({ processingStatus: 'PROCESSED' }),

    // Verification status distribution
    LandRecord.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),

    // Document status distribution
    DocumentModel.aggregate([
      { $group: { _id: '$processingStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),

    // User roles breakdown
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { role: '$_id', count: 1, _id: 0 } },
    ]),

    // District-wise record distribution
    LandRecord.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { district: '$_id', count: 1, _id: 0 } },
    ]),

    // 10 most recent system audit events
    AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(8)
      .lean(),

    // Monthly document uploads/processing trend
    DocumentModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$uploadedAt' },
            month: { $month: '$uploadedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
      {
        $project: {
          period: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' },
            ],
          },
          count: 1,
          _id: 0,
        },
      },
    ]),
  ]);

  return {
    overview: {
      totalUsers,
      totalDocuments,
      totalLandRecords,
      pendingVerification,
      verifiedRecords,
      rejectedRecords,
      needsReviewRecords,
      documentsProcessing,
      documentsUploaded,
      documentsProcessed,
    },
    charts: {
      verificationStatus: verificationStatusCounts,
      documentStatus: documentStatusCounts,
      userRoles: userRoleCounts,
      districtWise: districtWiseRecords,
      monthlyTrends: monthlyProcessing,
    },
    recentActivity: recentAuditLogs,
  };
};
