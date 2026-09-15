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

  // Normalize district names across Devanagari & English so duplicates are merged
  const DEVANAGARI_TO_ENGLISH_DISTRICTS: Record<string, string> = {
    'पुणे': 'Pune',
    'ठाणे': 'Thane',
    'नाशिक': 'Nashik',
    'नासिक': 'Nashik',
    'रायगड': 'Raigad',
    'नागपूर': 'Nagpur',
    'नागपुर': 'Nagpur',
    'छत्रपती संभाजीनगर': 'Chhatrapati Sambhajinagar',
    'छत्रपति संभाजीनगर': 'Chhatrapati Sambhajinagar',
    'औरंगाबाद': 'Chhatrapati Sambhajinagar',
    'सातारा': 'Satara',
    'कोल्हापूर': 'Kolhapur',
    'कोल्हापुर': 'Kolhapur',
    'सोलापूर': 'Solapur',
    'सोलापुर': 'Solapur',
    'अमरावती': 'Amravati',
    'नांदेड': 'Nanded',
    'नांदेड़': 'Nanded',
    'मुंबई शहर': 'Mumbai City',
    'मुंबई उपनगर': 'Mumbai Suburban',
    'पालघर': 'Palghar',
    'अहमदनगर': 'Ahmednagar',
    'जळगाव': 'Jalgaon',
    'धुळे': 'Dhule',
    'नंदुरबार': 'Nandurbar',
    'जालना': 'Jalna',
    'परभणी': 'Parbhani',
    'हिंगोली': 'Hingoli',
    'बीड': 'Beed',
    'लातूर': 'Latur',
    'धाराशिव': 'Dharashiv',
    'उस्मानाबाद': 'Dharashiv',
    'अकोला': 'Akola',
    'बुलढाणा': 'Buldhana',
    'वाशिम': 'Washim',
    'यवतमाळ': 'Yavatmal',
    'वर्धा': 'Wardha',
    'भंडारा': 'Bhandara',
    'गोंदिया': 'Gondia',
    'चंद्रपूर': 'Chandrapur',
    'गडचिरोली': 'Gadchiroli',
    'सांगली': 'Sangli',
    'रत्नागिरी': 'Ratnagiri',
    'सिंधुदुर्ग': 'Sindhudurg',
  };

  const districtMap = new Map<string, number>();
  for (const item of (districtWiseRecords || [])) {
    const raw = (item.district || '').trim();
    if (!raw) continue;
    const canonical = DEVANAGARI_TO_ENGLISH_DISTRICTS[raw] || raw;
    districtMap.set(canonical, (districtMap.get(canonical) || 0) + (item.count || 0));
  }
  const normalizedDistrictWise = Array.from(districtMap.entries())
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

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
      districtWise: normalizedDistrictWise,
      monthlyTrends: monthlyProcessing,
    },
    recentActivity: recentAuditLogs,
  };
};
