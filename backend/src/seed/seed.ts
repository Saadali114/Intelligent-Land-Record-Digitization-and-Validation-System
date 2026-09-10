import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { prisma } from '../config/prisma.js';
import { User, IUser } from '../models/User.js';
import { DocumentModel, IDocument } from '../models/Document.js';
import { LandRecord } from '../models/LandRecord.js';
import { VerificationRecord } from '../models/VerificationRecord.js';
import { AuditLog } from '../models/AuditLog.js';
import { connectDB } from '../config/db.js';
import { generateULPIN } from '../services/ulpin.service.js';

const SEED_PASSWORD = 'Password123!';

const DISTRICTS = [
  'Pune',
  'Nashik',
  'Nagpur',
  'Satara',
  'Thane',
  'Chhatrapati Sambhajinagar',
  'Kolhapur',
  'Solapur',
];

const TEHSILS: Record<string, string[]> = {
  Pune: ['Haveli', 'Baramati', 'Khed', 'Shirur', 'Mulshi'],
  Nashik: ['Nashik', 'Dindori', 'Sinnar', 'Niphad', 'Malegaon'],
  Nagpur: ['Nagpur Rural', 'Kamptee', 'Hingna', 'Umred', 'Katol'],
  Satara: ['Satara', 'Karad', 'Wai', 'Koregaon', 'Phaltan'],
  Thane: ['Thane', 'Kalyan', 'Bhiwandi', 'Ulhasnagar', 'Ambernath'],
  'Chhatrapati Sambhajinagar': ['Aurangabad', 'Paithan', 'Gangapur', 'Vaijapur'],
  Kolhapur: ['Karvir', 'Hatkangale', 'Shirol', 'Panhala'],
  Solapur: ['North Solapur', 'South Solapur', 'Barshi', 'Pandharpur'],
};

const VILLAGES: Record<string, string[]> = {
  Haveli: ['Khadakwasla', 'Wagholi', 'Uruli Kanchan', 'Shivane'],
  Baramati: ['Malegaon Budruk', 'Songaon', 'Katewadi', 'Jalochi'],
  Nashik: ['Deolali', 'Adgaon', 'Pathardi', 'Makhmalabad'],
  Dindori: ['Vani', 'Nanashi', 'Umrale', 'Dindori Rural'],
  'Nagpur Rural': ['Wadi', 'Parsodi', 'Besa', 'Ghogali'],
  Umred: ['Bhiwapur', 'Sirsi', 'Heeti', 'Makardhokada'],
  Karad: ['Ogalewadi', 'Varanje', 'Kole', 'Supane'],
  Satara: ['Mahadare', 'Dare', 'Karanje', 'Shahupuri'],
  Kalyan: ['Titwala', 'Shahad', 'Ambivli', 'Dombivli Rural'],
  Thane: ['Balkum', 'Majiwada', 'Kolshet', 'Vartak Nagar'],
};

const SAMPLE_NAMES = [
  'Ramesh Shankar Patil',
  'Sunita Dattatray Deshmukh',
  'Ganesh Bapurao Shinde',
  'Prakash Narayan Kulkarni',
  'Anusuya Pandurang Jadhav',
  'Eknath Tukaram More',
  'Suresh Vithalrao Pawar',
  'Laxmibai Madhavrao Gaikwad',
  'Santosh Bhikaji Chavan',
  'Mandakini Ramchandra Joshi',
  'Vijay Baburao Bhosale',
  'Ashok Kisanrao Jagtap',
  'Nirmala Dnyaneshwar Kale',
  'Dilip Sopanrao Salunkhe',
  'Vandana Digambar Kadam',
  'Balasaheb Maruti Thorat',
  'Pratibha Mohanrao Gunjal',
  'Sachin Raghunath Sawant',
  'Meena Yashwant Mane',
  'Chandrakant Govind Ghodke',
];

const ensureSampleFiles = (uploadDir: string) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const sampleFile1 = path.join(uploadDir, 'sample-7-12-extract.pdf');
  const sampleFile2 = path.join(uploadDir, 'sample-sale-deed.pdf');

  if (!fs.existsSync(sampleFile1)) {
    fs.writeFileSync(
      sampleFile1,
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n168\n%%EOF'
    );
  }
  if (!fs.existsSync(sampleFile2)) {
    fs.writeFileSync(
      sampleFile2,
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n168\n%%EOF'
    );
  }
};

export const ensureDefaultAccounts = async () => {
  const defaultUsers = [
    {
      name: 'Revenue Division Admin',
      email: 'admin@landrecord.gov.in',
      password: SEED_PASSWORD,
      role: 'ADMIN' as const,
      department: 'Land Revenue & Settlement Commissioner',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
    {
      name: 'Tehsildar Land Officer',
      email: 'officer@landrecord.gov.in',
      password: SEED_PASSWORD,
      role: 'OFFICER' as const,
      department: 'District Revenue & Survey Office',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
    {
      name: 'Tehsildar Land Officer 1',
      email: 'officer1@landrecord.gov.in',
      password: SEED_PASSWORD,
      role: 'OFFICER' as const,
      department: 'District Revenue & Survey Office',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
    {
      name: 'Land Record Inspector',
      email: 'verifier@landrecord.gov.in',
      password: SEED_PASSWORD,
      role: 'VERIFIER' as const,
      department: 'Record Verification & Audit Wing',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
    {
      name: 'Land Record Inspector 1',
      email: 'verifier1@landrecord.gov.in',
      password: SEED_PASSWORD,
      role: 'VERIFIER' as const,
      department: 'Record Verification & Audit Wing',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
    {
      name: 'Rahul Shankar Patil',
      email: 'rahul.patil@example.com',
      password: SEED_PASSWORD,
      role: 'CITIZEN' as const,
      department: 'Citizen & Landowner Services',
      district: 'Pune',
      status: 'ACTIVE' as const,
      accountStatus: 'ACTIVE' as const,
      emailVerified: true,
    },
  ];

  for (const u of defaultUsers) {
    try {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
        console.log(`Created default user: ${u.email} (${u.role})`);
      } else {
        existing.status = 'ACTIVE';
        existing.accountStatus = 'ACTIVE';
        existing.emailVerified = true;
        existing.password = SEED_PASSWORD;
        await existing.save();
      }
    } catch (err: any) {
      console.warn(`Could not ensure user ${u.email}:`, err.message);
    }
  }
};

export const seedDatabase = async (dropExisting: boolean = true) => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    if (dropExisting) {
      console.log('Clearing existing database tables...');
      try {
        await prisma.verificationRecord.deleteMany();
        await prisma.verificationWorkflow.deleteMany();
        await prisma.landRecord.deleteMany();
        await prisma.document.deleteMany();
        await prisma.officerApplication.deleteMany();
        await prisma.oTPVerification.deleteMany();
        await prisma.auditLog.deleteMany();
        await prisma.user.deleteMany();
      } catch (e) {
        console.log('Database tables already empty or not yet created');
      }
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    ensureSampleFiles(uploadDir);

    console.log('Creating users...');
    await ensureDefaultAccounts();
    const admin = (await User.findOne({ email: 'admin@landrecord.gov.in' }))!;

    // 5 Officers
    const officers: IUser[] = [];
    for (let i = 1; i <= 5; i++) {
      const email = `officer${i}@landrecord.gov.in`;
      let officer = await User.findOne({ email });
      if (!officer) {
        const dist = DISTRICTS[i % DISTRICTS.length];
        officer = await User.create({
          name: `Tehsildar Land Officer ${i}`,
          email,
          password: SEED_PASSWORD,
          role: 'OFFICER',
          department: 'District Revenue & Survey Office',
          district: dist,
          status: 'ACTIVE',
        });
      }
      officers.push(officer);
    }

    // 10 Verifiers
    const verifiers: IUser[] = [];
    for (let i = 1; i <= 10; i++) {
      const email = `verifier${i}@landrecord.gov.in`;
      let verifier = await User.findOne({ email });
      if (!verifier) {
        const dist = DISTRICTS[i % DISTRICTS.length];
        verifier = await User.create({
          name: `Land Record Inspector ${i}`,
          email,
          password: SEED_PASSWORD,
          role: 'VERIFIER',
          department: 'Record Verification & Audit Wing',
          district: dist,
          status: 'ACTIVE',
        });
      }
      verifiers.push(verifier);
    }

    console.log(`Created ${1 + officers.length + verifiers.length} users in seed.`);

    // Seed Documents
    console.log('Creating realistic land documents...');
    const documents: IDocument[] = [];
    const docTypes = ['7/12 Extract (Satbara)', 'Sale Deed (Kharidi Khat)', 'Mutation Register (Ferfar)', 'Property Card (Milkat Patra)'];
    const languages = ['Marathi', 'Marathi', 'Marathi', 'Hindi', 'English'];

    for (let i = 1; i <= 15; i++) {
      const uploader = verifiers[i % verifiers.length];
      const lang = languages[i % languages.length];
      const docType = docTypes[i % docTypes.length];
      const dateOffset = (15 - i) * 2; // spaced over past 30 days
      const uploadDate = new Date(Date.now() - dateOffset * 86400000);

      const statusChoices: Array<'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'NEEDS_REVIEW'> = [
        'PROCESSED',
        'PROCESSED',
        'UPLOADED',
        'PROCESSING',
        'NEEDS_REVIEW',
      ];
      const processingStatus = statusChoices[i % statusChoices.length];

      const isLegacy = i % 4 === 0;
      const doc = await DocumentModel.create({
        documentId: `DOC-MH-2026-${1000 + i}`,
        fileName: i % 2 === 0 ? 'sample-7-12-extract.pdf' : 'sample-sale-deed.pdf',
        originalName: `${docType.replace(/\s+/g, '_')}_Record_${i}.pdf`,
        filePath: path.join(uploadDir, i % 2 === 0 ? 'sample-7-12-extract.pdf' : 'sample-sale-deed.pdf'),
        fileType: 'PDF',
        fileSize: 1024 * 142 + i * 1234,
        mimeType: 'application/pdf',
        language: lang,
        uploadedBy: uploader._id,
        processingStatus,
        uploadedAt: uploadDate,
        isLegacyRecord: isLegacy,
        mrrCategory: isLegacy ? 'PRE_1947' : (i % 3 === 0 ? 'INTERMEDIATE' : 'MODERN'),
        metadata: {
          scannedDPI: isLegacy ? 400 : 300,
          originalLanguage: lang,
          docType,
          documentType: docType.includes('Sale Deed')
            ? 'SALE_DEED'
            : docType.includes('Mutation')
            ? 'MUTATION_REGISTER'
            : docType.includes('Property')
            ? 'PROPERTY_CARD'
            : '7_12_SATBARA',
          extractedConfidence: 0.94,
          archivalSerial: `ARCH-MH-REG-${2000 + i}`,
          aiExtraction: docType.includes('Sale Deed')
            ? {
                documentType: 'SALE_DEED',
                entities: {
                  vendor_name: 'Balasaheb Raghunath Deshmukh',
                  purchaser_name: 'Shri. Rameshwar Vithalrao Kadam',
                  consideration_amount: '₹ 48,50,000/-',
                  market_value: '₹ 51,00,000/-',
                  stamp_duty: '₹ 3,39,500/- (e-Challan GRAS-MH-2024-819)',
                  registration_fee: '₹ 30,000/-',
                  execution_date: '18/02/2024',
                  sub_registrar: 'दुय्यम निबंधक कार्यालय, हवेली क्र. ३, पुणे',
                  registration_number: `REG-MH-2024-${4000 + i}`,
                  boundary_east: 'Internal 12m DP Sector Road (१२ मी. रस्ता)',
                  boundary_west: 'Adjacent Survey / Gat No. 1377',
                  boundary_north: 'Open Layout Amenity Space / Garden (आरक्षित उद्यान)',
                  boundary_south: 'Main Village Access Road (गाव नकाशा रस्ता)',
                },
              }
            : undefined,
        },
      });
      documents.push(doc);
    }
    console.log(`Created ${documents.length} sample documents.`);

    // Seed Canonical Demo Reference Records
    console.log('Seeding canonical Demo Reference Records (LR-001, LR-002, LR-003)...');
    const demoReferenceRecords = [
      {
        recordId: 'LR-001',
        ulpin: '81LVQLD9407JH0', // Standard 14-digit ULPIN from DILRMP 3.0 Cover
        ownerName: 'Shankar Ganpat Patil',
        surveyNumber: '145/2A',
        gatNumber: '145/2A',
        khasraNumber: 'KH-1452',
        khataNumber: 'KT-304',
        plotArea: '1.25 Hectares',
        village: 'Khadakwasla',
        tehsil: 'Haveli',
        district: 'Pune',
        email: 'shankar.patil@example.com',
        landClassification: 'Agricultural (Jirayat)',
        ownershipType: 'Single Owner',
        mutationNumber: 'MUT-2024-8812',
        registrationNumber: 'MH-PUN-HAV-2024-001',
        sourceType: 'DEMO_REFERENCE_RECORD' as const,
        verificationStatus: 'VERIFIED' as const,
        isAadhaarSeeded: true,
        aadhaarMasked: 'XXXX-XXXX-9124',
        hasActiveDispute: false,
        hasBankCharge: false,
        circleRatePerSqm: 4200,
        calculatedValuation: 5250000,
        isLegacyRecord: false,
        mrrCategory: 'MODERN',
        createdBy: admin._id,
        confidenceScore: 0.98,
        remarks: 'Official Cadastral Reference Record (DILRMP 3.0 Demo Reference with Bhu-Aadhaar).',
      },
      {
        recordId: 'LR-002',
        ulpin: '81LVQLD9408JH1',
        ownerName: 'Meena Rajendra Kulkarni',
        surveyNumber: '88/3',
        gatNumber: '88/3',
        khasraNumber: 'KH-0883',
        khataNumber: 'KT-112',
        plotArea: '0.85 Hectares',
        village: 'Vani',
        tehsil: 'Dindori',
        district: 'Nashik',
        email: 'meena.kulkarni@example.com',
        landClassification: 'Agricultural (Bagayat)',
        ownershipType: 'Single Owner',
        mutationNumber: 'MUT-2023-4109',
        registrationNumber: 'MH-NSK-DIN-2023-002',
        sourceType: 'DEMO_REFERENCE_RECORD' as const,
        verificationStatus: 'VERIFIED' as const,
        isAadhaarSeeded: true,
        aadhaarMasked: 'XXXX-XXXX-3819',
        hasActiveDispute: true,
        rccmsCaseNumber: 'RCCMS-MH-2026-0412',
        disputeDetails: {
          courtName: 'Court of Sub-Divisional Officer (SDO), Dindori',
          caseType: 'Section 247 MLRC Title Partition Dispute',
          hearingDate: '15/11/2026',
          stayOrder: true,
        },
        hasBankCharge: true,
        bankChargeDetails: {
          bankName: 'State Bank of India',
          branch: 'Dindori Main Branch',
          loanAmount: 450000,
          chargeType: 'KCC Agricultural Hypothecation',
          sanctionDate: '12/03/2024',
          status: 'ACTIVE',
        },
        circleRatePerSqm: 3800,
        calculatedValuation: 3230000,
        isLegacyRecord: false,
        mrrCategory: 'MODERN',
        createdBy: admin._id,
        confidenceScore: 0.96,
        remarks: 'Official Cadastral Reference Record (Demo Reference with Active RCCMS Dispute & Bank Lien).',
      },
      {
        recordId: 'LR-003',
        ulpin: '81LVQLD9409JH2',
        ownerName: 'Rahul Shankar Patil',
        surveyNumber: '211/4',
        gatNumber: '211/4',
        khasraNumber: 'KH-2114',
        khataNumber: 'KT-589',
        plotArea: '2.10 Hectares',
        village: 'Wagholi',
        tehsil: 'Haveli',
        district: 'Pune',
        email: 'rahul.patil@example.com',
        landClassification: 'Residential Plot',
        ownershipType: 'Single Owner',
        mutationNumber: 'MUT-2025-9921',
        registrationNumber: 'MH-PUN-HAV-2025-003',
        sourceType: 'DEMO_REFERENCE_RECORD' as const,
        verificationStatus: 'VERIFIED' as const,
        isAadhaarSeeded: true,
        aadhaarMasked: 'XXXX-XXXX-4491',
        hasActiveDispute: false,
        hasBankCharge: false,
        circleRatePerSqm: 6500,
        calculatedValuation: 13650000,
        isLegacyRecord: false,
        mrrCategory: 'MODERN',
        createdBy: admin._id,
        confidenceScore: 0.99,
        remarks: 'Official Cadastral Reference Record (Urban Residential Plot under NAKSHA).',
      },
    ];

    for (const demoRec of demoReferenceRecords) {
      await LandRecord.create(demoRec);
    }

    const landRecords = [];
    const classifications = ['Agricultural (Jirayat)', 'Agricultural (Bagayat)', 'Non-Agricultural Commercial', 'Residential Plot', 'Government Land'];
    const ownershipTypes = ['Single Owner', 'Joint Family Ownership', 'Partnership Trust', 'Co-operative Society'];

    for (let i = 0; i < SAMPLE_NAMES.length; i++) {
      const ownerName = SAMPLE_NAMES[i];
      const district = DISTRICTS[i % DISTRICTS.length];
      const tehsilList = TEHSILS[district] || ['Taluka-1'];
      const tehsil = tehsilList[i % tehsilList.length];
      const villageList = VILLAGES[tehsil] || ['Gram-A', 'Gram-B'];
      const village = villageList[i % villageList.length];
      const doc = documents[i % documents.length];
      const officer = officers[i % officers.length];
      const verifier = verifiers[i % verifiers.length];

      const statusPool: Array<'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW'> = [
        'VERIFIED',
        'PENDING',
        'VERIFIED',
        'NEEDS_REVIEW',
        'REJECTED',
        'VERIFIED',
        'PENDING',
      ];
      const verificationStatus = statusPool[i % statusPool.length];

      const surveyNumber = `${100 + i}/${(i % 4) + 1}${String.fromCharCode(65 + (i % 3))}`;
      const khasraNumber = `KH-${2000 + i * 7}`;
      const khataNumber = `KT-${500 + i * 3}`;
      const plotArea = `${((i % 5) + 1) * 0.75 + 0.25} Hectares`;

      const ulpin = generateULPIN({ district, village, surveyNumber });
      const isAadhaarSeeded = i % 2 === 0;
      const hasActiveDispute = i % 5 === 0;
      const hasBankCharge = i % 4 === 0;
      const circleRatePerSqm = 2800 + (i % 8) * 450;
      const areaHectares = ((i % 5) + 1) * 0.75 + 0.25;
      const calculatedValuation = Math.round(circleRatePerSqm * areaHectares * 10000);
      const isLegacyRecord = i % 6 === 0;

      const record = await LandRecord.create({
        ownerName,
        surveyNumber,
        khasraNumber,
        khataNumber,
        plotArea,
        village,
        tehsil,
        district,
        ulpin,
        isAadhaarSeeded,
        aadhaarMasked: isAadhaarSeeded ? `XXXX-XXXX-${1000 + ((i * 389) % 9000)}` : undefined,
        hasActiveDispute,
        rccmsCaseNumber: hasActiveDispute ? `RCCMS-MH-2026-${5000 + i}` : undefined,
        disputeDetails: hasActiveDispute
          ? {
              courtName: 'Revenue Court of Sub-Divisional Officer (SDO)',
              caseType: 'Boundary Demarcation & Succession Contest (Sec 247 MLRC)',
              hearingDate: '24/11/2026',
              stayOrder: i % 10 === 0,
            }
          : undefined,
        hasBankCharge,
        bankChargeDetails: hasBankCharge
          ? {
              bankName: 'Bank of Maharashtra',
              branch: `${district} Central Branch`,
              loanAmount: 400000 + i * 25000,
              chargeType: 'Unified Lending Interface (ULI) Agri Mortgage',
              sanctionDate: '10/01/2025',
              status: 'ACTIVE',
            }
          : undefined,
        circleRatePerSqm,
        calculatedValuation,
        isLegacyRecord,
        mrrCategory: isLegacyRecord ? 'PRE_1947' : (i % 3 === 0 ? 'INTERMEDIATE' : 'MODERN'),
        landClassification: classifications[i % classifications.length],
        ownershipType: ownershipTypes[i % ownershipTypes.length],
        mutationNumber: `MUT-2025-${9000 + i}`,
        registrationNumber: `MH-REG-${3000 + i}`,
        sourceDocument: doc._id,
        verificationStatus,
        createdBy: officer._id,
        verifiedBy: verificationStatus !== 'PENDING' ? verifier._id : undefined,
        confidenceScore: 0.88 + (i % 12) * 0.01,
        remarks:
          doc.metadata?.docType?.includes('Sale Deed')
            ? `Deed of Absolute Sale | Vendor: Balasaheb Raghunath Deshmukh | Purchaser: ${ownerName} | Consideration: ₹ 48,50,000/- | Date: 18/02/2024`
            : verificationStatus === 'VERIFIED'
            ? 'Verified against field survey and archival 7/12 register.'
            : verificationStatus === 'REJECTED'
            ? 'Discrepancy detected in survey boundaries versus khasra record.'
            : verificationStatus === 'NEEDS_REVIEW'
            ? 'Minor signature mismatch on sale deed; re-verification required.'
            : 'Awaiting inspector review.',
      });

      landRecords.push(record);

      // Create VerificationRecord for processed records
      if (verificationStatus !== 'PENDING') {
        await VerificationRecord.create({
          recordId: record._id,
          verifiedBy: verifier._id,
          previousData: {
            ownerName,
            surveyNumber,
            verificationStatus: 'PENDING',
          },
          updatedData: {
            verificationStatus,
            remarks: record.remarks,
          },
          action:
            verificationStatus === 'VERIFIED'
              ? 'APPROVED'
              : verificationStatus === 'REJECTED'
              ? 'REJECTED'
              : 'CORRECTED',
          remarks: record.remarks || 'Verification entry created during routine audit.',
          verifiedAt: new Date(Date.now() - (i % 10) * 86400000),
        });
      }
    }
    console.log(`Created ${landRecords.length} land records with verification logs.`);

    // Seed Audit Logs
    console.log('Generating realistic system audit trails...');
    const auditActions = [
      { action: 'USER_LOGIN', desc: 'User logged into governance portal', res: 'Auth' },
      { action: 'DOCUMENT_UPLOADED', desc: 'Scanned 7/12 archival record uploaded for processing', res: 'Document' },
      { action: 'RECORD_CREATED', desc: 'Digital land record drafted from source register', res: 'LandRecord' },
      { action: 'RECORD_VERIFIED', desc: 'Land record approved after verification', res: 'LandRecord' },
      { action: 'RECORD_CORRECTED', desc: 'Discrepancy in survey number corrected by inspector', res: 'LandRecord' },
    ];

    for (let i = 0; i < 25; i++) {
      const user = i % 3 === 0 ? admin : i % 2 === 0 ? officers[i % officers.length] : verifiers[i % verifiers.length];
      const template = auditActions[i % auditActions.length];
      await AuditLog.create({
        userId: user._id,
        action: template.action,
        resourceType: template.res,
        resourceId: `RES-${4000 + i}`,
        description: `${template.desc} by ${user.name} (${user.role})`,
        ipAddress: `192.168.1.${10 + (i % 50)}`,
        timestamp: new Date(Date.now() - i * 3600000 * 4),
      });
    }

    console.log('========================================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------------');
    console.log('Default Credentials:');
    console.log('  Super Admin : admin@landrecord.gov.in     / Password123!');
    console.log('  Officer     : officer1@landrecord.gov.in  / Password123!');
    console.log('  Verifier    : verifier1@landrecord.gov.in / Password123!');
    console.log('  Viewer      : viewer1@landrecord.gov.in   / Password123!');
    console.log('========================================================');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

// If run directly via CLI (npm run seed)
const isDirectCliRun = process.argv[1] && (
  process.argv[1].endsWith('seed.ts') || 
  process.argv[1].endsWith('seed.js')
);

if (isDirectCliRun) {
  seedDatabase(true)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
