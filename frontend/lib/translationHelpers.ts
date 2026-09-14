export function formatRole(
  role?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!role) return '';
  const r = role.toLowerCase();
  if (t) {
    return t(`roles.${r}`, {
      defaultValue: t(`status.${r}`, {
        defaultValue: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
      }),
    });
  }
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function formatStatus(
  status?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!status) return '';
  const s = status.toLowerCase();
  const readable = status.replace(/_/g, ' ');
  if (t) {
    return t(`status.${s}`, {
      defaultValue: readable.charAt(0).toUpperCase() + readable.slice(1),
    });
  }
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export function formatDocType(
  docType?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!docType) return '';
  const dt = docType.toLowerCase().replace(/[\s\/-]+/g, '_');
  let key = dt;
  if (dt.includes('7_12') || dt.includes('712')) key = 'doc_7_12';
  else if (dt.includes('8a') || dt.includes('8_a')) key = 'doc_8a';
  else if (dt.includes('ferfar') || dt.includes('mutation')) key = 'ferfar';
  else if (dt.includes('sale') || dt.includes('deed')) key = 'sale_deed';

  if (t) {
    return t(`documentTypes.${key}`, {
      defaultValue: docType,
    });
  }
  return docType;
}

const DISTRICT_KEY_MAP: Record<string, string> = {
  // Pune
  'pune': 'pune',
  'पुणे': 'pune',
  // Mumbai City
  'mumbai city': 'mumbaiCity',
  'mumbai': 'mumbaiCity',
  'mumbaicity': 'mumbaiCity',
  'मुंबई शहर': 'mumbaiCity',
  'मुंबई': 'mumbaiCity',
  // Mumbai Suburban
  'mumbai suburban': 'mumbaiSuburban',
  'mumbaisuburban': 'mumbaiSuburban',
  'मुंबई उपनगर': 'mumbaiSuburban',
  // Thane
  'thane': 'thane',
  'ठाणे': 'thane',
  // Raigad
  'raigad': 'raigad',
  'रायगड': 'raigad',
  // Palghar
  'palghar': 'palghar',
  'पालघर': 'palghar',
  // Ratnagiri
  'ratnagiri': 'ratnagiri',
  'रत्नागिरी': 'ratnagiri',
  // Sindhudurg
  'sindhudurg': 'sindhudurg',
  'सिंधुदुर्ग': 'sindhudurg',
  // Nashik
  'nashik': 'nashik',
  'नाशिक': 'nashik',
  'नासिक': 'nashik',
  // Dhule
  'dhule': 'dhule',
  'धुळे': 'dhule',
  'धुले': 'dhule',
  // Nandurbar
  'nandurbar': 'nandurbar',
  'नंदुरबार': 'nandurbar',
  // Jalgaon
  'jalgaon': 'jalgaon',
  'जळगाव': 'jalgaon',
  'जलगांव': 'jalgaon',
  // Ahmednagar
  'ahmednagar': 'ahmednagar',
  'ahilyanagar': 'ahmednagar',
  'अहमदनगर': 'ahmednagar',
  'अहिल्यानगर': 'ahmednagar',
  // Chhatrapati Sambhajinagar
  'chhatrapati sambhajinagar': 'chhatrapatiSambhajinagar',
  'chhatrapatisambhajinagar': 'chhatrapatiSambhajinagar',
  'aurangabad': 'chhatrapatiSambhajinagar',
  'छत्रपती संभाजीनगर': 'chhatrapatiSambhajinagar',
  'छत्रपति संभाजीनगर': 'chhatrapatiSambhajinagar',
  'औरंगाबाद': 'chhatrapatiSambhajinagar',
  // Jalna
  'jalna': 'jalna',
  'जालना': 'jalna',
  // Parbhani
  'parbhani': 'parbhani',
  'परभणी': 'parbhani',
  // Hingoli
  'hingoli': 'hingoli',
  'हिंगोली': 'hingoli',
  // Beed
  'beed': 'beed',
  'बीड': 'beed',
  // Nanded
  'nanded': 'nanded',
  'नांदेड': 'nanded',
  'नांदेड़': 'nanded',
  // Dharashiv
  'dharashiv': 'dharashiv',
  'osmanabad': 'dharashiv',
  'धाराशिव': 'dharashiv',
  'उस्मानाबाद': 'dharashiv',
  // Latur
  'latur': 'latur',
  'लातूर': 'latur',
  // Amravati
  'amravati': 'amravati',
  'अमरावती': 'amravati',
  // Akola
  'akola': 'akola',
  'अकोला': 'akola',
  // Yavatmal
  'yavatmal': 'yavatmal',
  'यवतमाळ': 'yavatmal',
  // Buldhana
  'buldhana': 'buldhana',
  'बुलढाणा': 'buldhana',
  // Washim
  'washim': 'washim',
  'वाशिम': 'washim',
  // Nagpur
  'nagpur': 'nagpur',
  'नागपूर': 'nagpur',
  'नागपुर': 'nagpur',
  // Wardha
  'wardha': 'wardha',
  'वर्धा': 'wardha',
  // Bhandara
  'bhandara': 'bhandara',
  'भंडारा': 'bhandara',
  // Gondia
  'gondia': 'gondia',
  'गोंदिया': 'gondia',
  // Chandrapur
  'chandrapur': 'chandrapur',
  'चंद्रपूर': 'chandrapur',
  'चंद्रपुर': 'chandrapur',
  // Gadchiroli
  'gadchiroli': 'gadchiroli',
  'गडचिरोली': 'gadchiroli',
  // Kolhapur
  'kolhapur': 'kolhapur',
  'कोल्हापूर': 'kolhapur',
  'कोल्हापुर': 'kolhapur',
  // Sangli
  'sangli': 'sangli',
  'सांगली': 'sangli',
  // Solapur
  'solapur': 'solapur',
  'सोलापूर': 'solapur',
  'सोलापुर': 'solapur',
  // Satara
  'satara': 'satara',
  'सातारा': 'satara',
};

export function normalizeDistrictKey(district?: string | null): string {
  if (!district) return '';
  const clean = district.trim().toLowerCase();
  if (DISTRICT_KEY_MAP[clean]) {
    return DISTRICT_KEY_MAP[clean];
  }
  const camel = clean.replace(/[\s_-]+(.)/g, (_, c) => c.toUpperCase());
  if (DISTRICT_KEY_MAP[camel]) {
    return DISTRICT_KEY_MAP[camel];
  }
  return clean;
}

export function formatDistrict(
  district?: string | null,
  t?: (key: string, options?: any) => string
): string {
  if (!district) return '';
  const key = normalizeDistrictKey(district);
  if (t) {
    return t(`districts.${key}`, {
      defaultValue: district,
    });
  }
  return district;
}
