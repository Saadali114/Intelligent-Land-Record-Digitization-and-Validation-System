import { DocumentRecord } from '../types';

export type FormCategory = '7_12_SATBARA' | 'SALE_DEED' | 'MUTATION_REGISTER' | 'PROPERTY_CARD';

export const getBackendFileUrl = (doc: DocumentRecord | null): string => {
  if (!doc) return '';
  // 1. Direct embedded Data URL stored in database metadata (100% immune to cloud container resets)
  if (doc.metadata?.previewDataUrl) {
    return doc.metadata.previewDataUrl;
  }
  if (doc.metadata?.thumbnailDataUrl) {
    return doc.metadata.thumbnailDataUrl;
  }
  if (doc.fileUrl && (doc.fileUrl.startsWith('http://') || doc.fileUrl.startsWith('https://') || doc.fileUrl.startsWith('data:'))) {
    return doc.fileUrl;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBase = apiUrl.replace(/\/api\/?$/, '');
  if (doc.fileUrl) {
    const cleanUrl = doc.fileUrl.startsWith('/') ? doc.fileUrl : `/${doc.fileUrl}`;
    return `${backendBase}${cleanUrl}`;
  }
  if (doc.fileName) {
    return `${backendBase}/uploads/${encodeURIComponent(doc.fileName)}`;
  }
  return '';
};

export const getDocumentFormCategory = (doc: DocumentRecord | null): FormCategory => {
  if (!doc) return '7_12_SATBARA';
  const ft = (doc.fileType || '').toLowerCase();
  const on = (doc.originalName || '').toLowerCase();
  const cl = (doc.landRecord?.landClassification || '').toLowerCase();
  const sn = (doc.landRecord?.surveyNumber || '').toLowerCase();
  const kn = (doc.landRecord?.khasraNumber || '').toLowerCase();

  const dt = ((doc as any).documentType || '').toLowerCase();
  const metaDt = (
    doc.metadata?.aiExtraction?.documentType ||
    (doc.metadata as any)?.docType ||
    (doc.metadata as any)?.documentType ||
    ''
  ).toLowerCase();
  const remarks = (doc.landRecord?.remarks || '').toLowerCase();
  const rawSnippet = (doc.metadata?.aiExtraction?.rawTextSnippet || '').toLowerCase();

  // 1. Explicit 7/12 Extract check FIRST (prioritized over mutation/other)
  if (
    ft.includes('7/12') ||
    ft.includes('7-12') ||
    ft.includes('satbara') ||
    on.includes('7/12') ||
    on.includes('7-12') ||
    on.includes('7_12') ||
    on.includes('satbara') ||
    dt.includes('7/12') ||
    metaDt.includes('7/12') ||
    kn.includes('7/12')
  ) {
    return '7_12_SATBARA';
  }

  // 2. Sale Deed / Conveyance Deed check (English, Marathi & Hindi)
  if (
    ft.includes('sale') ||
    ft.includes('kharidi') ||
    ft.includes('conveyance') ||
    ft.includes('खरेदी') ||
    ft.includes('बैनामा') ||
    dt.includes('sale') ||
    dt.includes('kharidi') ||
    dt.includes('खरेदी') ||
    metaDt.includes('sale') ||
    metaDt.includes('kharidi') ||
    metaDt.includes('खरेदी') ||
    metaDt.includes('deed') ||
    on.includes('sale') ||
    on.includes('kharidi') ||
    on.includes('खरेदी') ||
    on.includes('खत') ||
    on.includes('बैनामा') ||
    on.includes('विक्रय') ||
    on.includes('conveyance') ||
    on.includes('deed') ||
    remarks.includes('sale deed') ||
    remarks.includes('deed of absolute sale') ||
    remarks.includes('खरेदीखत') ||
    remarks.includes('conveyance') ||
    rawSnippet.includes('sale deed') ||
    rawSnippet.includes('खरेदीखत') ||
    rawSnippet.includes('deed of absolute sale') ||
    cl.includes('residential') ||
    kn.includes('sale deed') ||
    sn.includes('site')
  ) {
    return 'SALE_DEED';
  }

  // 3. Mutation Register check (Village Form 6 / फेरफार नोंदवही / नामांतरण)
  if (
    ft.includes('mutation') ||
    ft.includes('ferfar') ||
    ft.includes('form 6') ||
    ft.includes('form_6') ||
    ft.includes('form-6') ||
    ft.includes('गाव नमुना ६') ||
    ft.includes('फेरफार') ||
    dt.includes('mutation') ||
    dt.includes('ferfar') ||
    dt.includes('फेरफार') ||
    metaDt.includes('mutation') ||
    metaDt.includes('ferfar') ||
    metaDt.includes('फेरफार') ||
    on.includes('mutation') ||
    on.includes('ferfar') ||
    on.includes('form_6') ||
    on.includes('form-6') ||
    on.includes('फेरफार') ||
    on.includes('नामांतरण') ||
    remarks.includes('mutation register') ||
    remarks.includes('गाव नमुना ६') ||
    remarks.includes('फेरफार नोंद') ||
    rawSnippet.includes('गाव नमुना ६') ||
    rawSnippet.includes('गाव नमुना सहा') ||
    rawSnippet.includes('फेरफार नोंदवही')
  ) {
    return 'MUTATION_REGISTER';
  }

  // 4. Property Card check
  if (
    ft.includes('property') ||
    ft.includes('milkat') ||
    ft.includes('cts') ||
    on.includes('card') ||
    on.includes('milkat')
  ) {
    return 'PROPERTY_CARD';
  }

  // Default to 7/12 Satbara Extract
  return '7_12_SATBARA';
};

// Offline Cadastral Dictionary
export const CADASTRAL_DICTIONARY: Record<string, Record<string, string>> = {
  mr_to_en: {
    'भोगवटादार वर्ग १': 'Occupant Class 1 (Bhogwatadar Class 1)',
    'भोगवटादार वर्ग २': 'Occupant Class 2 (Bhogwatadar Class 2)',
    'शासकीय पट्टेदार': 'Government Lessee',
    'भोगवटादार वर्ग - १': 'Occupant Class 1',
    'भोगवटादार वर्ग - २': 'Occupant Class 2',
    'शेतजमीन': 'Agricultural Land',
    'अकृषिक': 'Non-Agricultural (NA)',
    'बागायत': 'Irrigated (Bagayat)',
    'जिरायत': 'Dry Crop (Jirayat)',
    'हवेली': 'Haveli',
    'पुणे': 'Pune',
    'नांदेड': 'Nanded',
    'मौजे': 'Village Mouje',
    'गट क्र.': 'Gat No.',
    'सर्व्हे क्र.': 'Survey No.',
    'खाते क्र.': 'Khata No.',
    'खरेदी खत': 'Sale Deed',
    'फेरफार नोंद': 'Mutation Register',
    'मिळकत पत्रिका': 'Property Card',
    'निवासी भूखंड': 'Residential Plot',
    'व्यावसायिक': 'Commercial',
    'मुक्त धारणा': 'Freehold',
    'पट्टा धारणा': 'Leasehold',
    'वारस नोंद': 'Inheritance Mutation',
    'खरेदी नोंद': 'Sale Mutation',
    'हक्कसोड': 'Relinquishment',
  },
  en_to_mr: {
    'Occupant Class 1': 'भोगवटादार वर्ग १',
    'Occupant Class 2': 'भोगवटादार वर्ग २',
    'Agricultural Land': 'शेतजमीन',
    'Non-Agricultural': 'अकृषिक',
    'Sale Deed': 'खरेदी खत',
    'Mutation Register': 'फेरफार नोंदवही',
    'Property Card': 'मिळकत पत्रिका',
    'Residential Plot': 'निवासी भूखंड',
    'Commercial': 'व्यावसायिक',
    'Freehold': 'मुक्त धारणा (Freehold)',
    'Leasehold': 'पट्टा धारणा (Leasehold)',
  },
  mr_to_hi: {
    'भोगवटादार वर्ग १': 'कब्जेदार वर्ग १',
    'भोगवटादार वर्ग २': 'कब्जेदार वर्ग २',
    'शेतजमीन': 'कृषि भूमि',
    'अकृषिक': 'गैर-कृषि (NA)',
    'खाते क्र.': 'खाता संख्या',
    'गट क्र.': 'गट संख्या',
    'गाव': 'गाँव',
    'तालुका': 'तहसील',
    'जिल्हा': 'जिला',
    'फेरफार': 'नामांतरण (दाखिल-खारिज)',
    'खरेदी खत': 'बैनामा / विक्रय पत्र',
  },
};

export const translateCadastralText = async (text: string, lang: string): Promise<string> => {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // Fast dictionary matches
  if (lang === 'en' && CADASTRAL_DICTIONARY.mr_to_en && CADASTRAL_DICTIONARY.mr_to_en[trimmed]) {
    return CADASTRAL_DICTIONARY.mr_to_en[trimmed];
  }
  if (lang === 'mr' && CADASTRAL_DICTIONARY.en_to_mr && CADASTRAL_DICTIONARY.en_to_mr[trimmed]) {
    return CADASTRAL_DICTIONARY.en_to_mr[trimmed];
  }
  if (lang === 'hi' && CADASTRAL_DICTIONARY.mr_to_hi && CADASTRAL_DICTIONARY.mr_to_hi[trimmed]) {
    return CADASTRAL_DICTIONARY.mr_to_hi[trimmed];
  }

  // Numbers, punctuation, codes
  if (/^[\d\s.,\-\/#:()]+$/.test(trimmed)) return trimmed;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const translated = data[0].map((chunk: any) => chunk[0]).join('');
        if (translated && translated.trim()) return translated.trim();
      }
    }
  } catch (e) {
    console.warn('Network translation fallback:', e);
  }
  return trimmed;
};
