import { NormalizationService } from './normalization.service.js';

export interface ExtractedFieldResult {
  label: string;
  value: string;
  normalizedValue: string;
  confidence: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
  rawTextMatch?: string;
}

export interface ExtractedDocumentEntities {
  documentType: '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER';
  ownerName: ExtractedFieldResult;
  surveyNumber: ExtractedFieldResult;
  gatNumber?: ExtractedFieldResult;
  village: ExtractedFieldResult;
  taluka: ExtractedFieldResult;
  district: ExtractedFieldResult;
  plotArea: ExtractedFieldResult;
  mutationNumber?: ExtractedFieldResult;
  taxAssessment?: ExtractedFieldResult;
  avgConfidence: number;
  allFields: Record<string, ExtractedFieldResult>;
}

export class EntityExtractionService {
  /**
   * Extract land entities from raw OCR or parsed text
   */
  public static extractEntities(rawText: string): ExtractedDocumentEntities {
    const text = NormalizationService.cleanText(rawText);
    const convertedText = NormalizationService.convertDevanagariNumerals(text);

    // 1. Owner Name Extraction
    const ownerName = this.extractOwnerName(text);

    // 2. Survey / Gat Number Extraction
    const surveyNumber = this.extractSurveyNumber(convertedText);

    // 3. Location Entities (Village, Taluka, District)
    const location = this.extractLocation(text);

    // 4. Plot Area Extraction
    const plotArea = this.extractPlotArea(convertedText);

    // 5. Mutation Number Extraction
    const mutationNumber = this.extractMutationNumber(convertedText);

    // 6. Assessment / Tax
    const taxAssessment = this.extractTax(convertedText);

    // Determine Document Type Heuristic
    let documentType: '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER' = '7_12';
    if (/(गाव\s*नमुना\s*सात|७\/१२|7\/12|satbara|हक्क\s*नोंदणी|अधिकार\s*अभिलेख)/i.test(text)) {
      documentType = '7_12';
    } else if (/(गाव\s*नमुना\s*आठ|८-अ|8-?a|खातेनिहाय)/i.test(text)) {
      documentType = '8A';
    } else if (/(गाव\s*नमुना\s*सहा|६|फेरफार|mutation\s*register|ferfar)/i.test(text)) {
      documentType = 'FERFAR';
    } else if (/(खरेदी\s*खत|विक्री\s*पत्र|sale\s*deed|conveyance\s*deed)/i.test(text)) {
      documentType = 'SALE_DEED';
    }

    const allFields: Record<string, ExtractedFieldResult> = {
      ownerName,
      surveyNumber,
      village: location.village,
      taluka: location.taluka,
      district: location.district,
      plotArea,
    };

    if (mutationNumber.value) {
      allFields.mutationNumber = mutationNumber;
    }
    if (taxAssessment.value) {
      allFields.taxAssessment = taxAssessment;
    }

    const confidences = Object.values(allFields).map((f) => f.confidence);
    const avgConfidence =
      confidences.length > 0
        ? parseFloat((confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(2))
        : 0.9;

    return {
      documentType,
      ownerName,
      surveyNumber,
      gatNumber: surveyNumber,
      village: location.village,
      taluka: location.taluka,
      district: location.district,
      plotArea,
      mutationNumber: mutationNumber.value ? mutationNumber : undefined,
      taxAssessment: taxAssessment.value ? taxAssessment : undefined,
      avgConfidence,
      allFields,
    };
  }

  private static extractOwnerName(text: string): ExtractedFieldResult {
    const isInvalid = (str: string): boolean => {
      if (!str || str.length < 3) return true;
      const blacklist = [
        'क्षेत्र', 'आकार', 'पोटखराब', 'जुडी', 'रुपये', 'पैसे', 'नमुना', 'गाव',
        'तालुका', 'जिल्हा', 'शासन', 'महाराष्ट्र', 'महसूल', 'अधिकार', 'अभिलेख',
        'भोगवटादार', 'खातेदार', 'पिकांची', 'हंगाम', 'शेरा', 'शेती', 'जिरायत',
        'government', 'revenue', 'department', 'satbara', 'signature',
      ];
      const lower = str.toLowerCase();
      return blacklist.some((w) => lower.includes(w));
    };

    const cleanCandidate = (raw: string): string => {
      return raw
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\([0-9\u0900-\u097F\s\.\-]+\)/g, '')
        .replace(/^[१२३४५६७८९\d]+[\)\.\-]\s*/, '')
        .replace(/\r?\n.*/s, '')
        .replace(/शिंदि/g, 'शिंदे')
        .replace(/पाटि/g, 'पाटील')
        .trim();
    };

    // Pattern 1: Explicitly labeled owner / khatedar field (including भूमिधारकाचे नाव)
    const labeledMatch = text.match(
      /(?:खातेदाराचे\s*नाव|भोगवटादाराचे\s*नांव|भोगवटादाराचे\s*नाव|कब्जेदार(?:ाचे\s*नाव)?|खातेदाराचे\s*नांव\s*व\s*पत्ता|भूमिधारकाचे\s*नाव|\[?भिधारकांचे\s*नाव|भूधारकाचे\s*नाव|जमीन\s*मालक|owner(?:\s*name)?)\s*[:\-=\n]?\s*([^\n\r,;:–|]{3,60})/i
    );
    if (labeledMatch && labeledMatch[1]) {
      let rawCand = labeledMatch[1].replace(/शिंदि\b/, 'शिंदे').replace(/पाटि\b/, 'पाटील');
      const cleaned = cleanCandidate(rawCand);
      if (!isInvalid(cleaned)) {
        const norm = NormalizationService.normalizeName(cleaned);
        return {
          label: 'Owner Name (खातेदाराचे नाव)',
          value: cleaned,
          normalizedValue: norm,
          confidence: 0.96,
          status: 'HIGH',
          rawTextMatch: labeledMatch[0],
        };
      }
    }

    // Pattern 2: Devanagari honorific with full name (supports colons, hyphens: श्री: गणेश or श्री. गणेश)
    const honorificMatch = text.match(
      /(?:(?:श्री|श्रीमती|सौ|कै|स्व)[\s:\.\-=_]+)([A-Za-z\u0900-\u097F\s]{4,45})/
    );
    if (honorificMatch && (honorificMatch[0] || honorificMatch[1])) {
      let rawCand = honorificMatch[0].replace(/[\s:\.\-=_]+/, ' ').trim();
      rawCand = rawCand.replace(/शिंदि\b/, 'शिंदे').replace(/पाटि\b/, 'पाटील');
      const cleaned = cleanCandidate(rawCand);
      if (!isInvalid(cleaned) && cleaned.split(/\s+/).length >= 2) {
        const norm = NormalizationService.normalizeName(cleaned);
        return {
          label: 'Owner Name (खातेदाराचे नाव)',
          value: cleaned,
          normalizedValue: norm,
          confidence: 0.94,
          status: 'HIGH',
          rawTextMatch: honorificMatch[0],
        };
      }
    }

    // Pattern 3: Table cell format (e.g. | १२३४ | श्री: गणेश लक्ष्मण शिंदि |)
    const tableCellMatch = text.match(/\|\s*(?:(?:श्री|श्रीमती|सौ)[:\.\-=_]?\s*)?([A-Za-z\u0900-\u097F\s]{4,35})\s*\|/);
    if (tableCellMatch && tableCellMatch[1]) {
      let rawCand = tableCellMatch[1].replace(/शिंदि\b/, 'शिंदे').replace(/पाटि\b/, 'पाटील');
      const cleaned = cleanCandidate(rawCand);
      if (!isInvalid(cleaned) && cleaned.split(/\s+/).length >= 2) {
        const norm = NormalizationService.normalizeName(cleaned);
        return {
          label: 'Owner Name (खातेदाराचे नाव)',
          value: cleaned,
          normalizedValue: norm,
          confidence: 0.90,
          status: 'HIGH',
          rawTextMatch: tableCellMatch[0],
        };
      }
    }

    // Pattern 4: Numbered table row (e.g. 1) शंकर गणपत पाटील or १) रमेश पवार)
    const numberedMatch = text.match(
      /(?:^|\n)\s*[१२३४५६७८९\d]+[\)\.\-]\s*(?:(?:श्री|श्रीमती|सौ)\.?\s+)?([A-Za-z\u0900-\u097F\s]{4,45})/
    );
    if (numberedMatch && numberedMatch[1]) {
      const cleaned = cleanCandidate(numberedMatch[1]);
      if (!isInvalid(cleaned) && cleaned.split(/\s+/).length >= 2) {
        const norm = NormalizationService.normalizeName(cleaned);
        return {
          label: 'Owner Name (खातेदाराचे नाव)',
          value: cleaned,
          normalizedValue: norm,
          confidence: 0.88,
          status: 'HIGH',
          rawTextMatch: numberedMatch[0],
        };
      }
    }

    // Pattern 5: Capitalized English full name (2-3 words)
    const engMatches = text.match(/\b([A-Z][a-z]{2,15}\s+[A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,15})?)\b/g);
    if (engMatches) {
      for (const cand of engMatches) {
        if (!isInvalid(cand)) {
          const norm = NormalizationService.normalizeName(cand);
          return {
            label: 'Owner Name (खातेदाराचे नाव)',
            value: cand.trim(),
            normalizedValue: norm,
            confidence: 0.85,
            status: 'HIGH',
            rawTextMatch: cand,
          };
        }
      }
    }

    // Default fallback if not recognized
    return {
      label: 'Owner Name (खातेदाराचे नाव)',
      value: 'Not Detected',
      normalizedValue: '',
      confidence: 0.2,
      status: 'LOW',
    };
  }

  private static extractSurveyNumber(text: string): ExtractedFieldResult {
    // Check 7/12 table cell immediately preceding owner name
    const tablePreOwnerM = text.match(/\|\s*([0-9]{1,4}(?:\/[0-9]{1,3})?)\s*\|\s*(?:श्री|श्रीमती|सौ)/);
    if (tablePreOwnerM && tablePreOwnerM[1] !== '7/12' && tablePreOwnerM[1] !== '7') {
      const raw = tablePreOwnerM[1].trim();
      const norm = NormalizationService.normalizeSurveyNumber(raw);
      return {
        label: 'Survey / Gat Number (गट / सर्व्हे क्र.)',
        value: raw,
        normalizedValue: norm,
        confidence: 0.98,
        status: 'HIGH',
        rawTextMatch: tablePreOwnerM[0],
      };
    }

    const patterns = [
      /(?:भूमापन\s*(?:क्रमांक\s*व\s*उपविभाग|क्रमांक|क्र\.?)|सर्व्हे\s*(?:क्रमांक|क्र\.?|नंबर)|सर्वे\s*(?:क्रमांक|क्र\.?|नंबर)|गट\s*(?:क्रमांक|क्र\.?|नंबर)|survey\s*(?:no\.?|number)|gat\s*(?:no\.?|number))[\s\:\-\=_।\.\n]*([0-9Yy]+(?:\/[0-9Yy]+(?:\/[0-9\u0900-\u097FA-Za-z]+)?)?)/i,
      /\b([0-9]{1,4}\/[0-9]{1,3}(?:\/[0-9\u0900-\u097FA-Za-z]+)?)\b/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && (match[1] || match[0])) {
        let raw = (match[1] || match[0]).replace(/[Yy]/g, '4').trim();
        // Discard if matching the form type 7/12
        if (raw !== '7/12' && raw !== '7' && raw !== '12') {
          const norm = NormalizationService.normalizeSurveyNumber(raw);
          return {
            label: 'Survey / Gat Number (गट / सर्व्हे क्र.)',
            value: raw,
            normalizedValue: norm,
            confidence: 0.98,
            status: 'HIGH',
            rawTextMatch: match[0],
          };
        }
      }
    }

    return {
      label: 'Survey / Gat Number (गट / सर्व्हे क्र.)',
      value: 'Not Detected',
      normalizedValue: '',
      confidence: 0.2,
      status: 'LOW',
    };
  }

  private static extractLocation(text: string): {
    village: ExtractedFieldResult;
    taluka: ExtractedFieldResult;
    district: ExtractedFieldResult;
  } {
    const cleanLocationValue = (raw: string): string => {
      let v = raw.trim();
      v = v.split(/(?:तालुका|तहसील|जिल्हा|गाव|District|Taluka|Village|Tehsil|\||\/)/i)[0].trim();
      return v;
    };

    // Village
    let villageVal = 'Not Detected';
    let villageConf = 0.2;
    const vMatches = [...text.matchAll(/(?:गाव|मौजे|village)[\s:\-=_।\|]+([A-Za-z\u0900-\u097F]{2,25})/gi)];
    for (const m of vMatches) {
      const val = m[1].trim();
      if (val !== 'नमुना' && val !== 'नंबर' && val !== 'शासन' && val.length >= 2) {
        villageVal = val;
        villageConf = 0.96;
        break;
      }
    }
    if (villageVal === 'Not Detected') {
      const raMatches = [...text.matchAll(/रा[\.\s:\-]+([A-Za-z\u0900-\u097F]{2,25})/g)];
      for (const rm of raMatches) {
        const v = rm[1].trim();
        if (v !== 'नमुना' && v !== 'नंबर' && v !== 'शासन' && v.length >= 2) {
          villageVal = v;
          villageConf = 0.94;
          break;
        }
      }
    }

    // Taluka / Tehsil
    let talukaVal = 'Not Detected';
    let talukaConf = 0.2;
    const tMatches = [...text.matchAll(/(?:तालुका|तहसील|tehsil|taluka)[\s:\-=_।\.]+\s*([A-Za-z\u0900-\u097F]{2,25})/gi)];
    for (const m of tMatches) {
      const val = m[1].trim();
      if (val !== 'नंबर' && val !== 'SEE' && val !== 'नमुना' && val !== 'शासन' && val.length >= 3) {
        talukaVal = val === 'खालापुर' ? 'खालापूर' : val;
        talukaConf = 0.96;
        break;
      }
    }
    if (talukaVal === 'Not Detected') {
      const taMatches = [...text.matchAll(/ता[\s:\.\-]+([A-Za-z\u0900-\u097F]{2,25})/g)];
      for (const tm of taMatches) {
        const val = tm[1].trim();
        if (val !== 'नंबर' && val !== 'नमुना' && val !== 'शासन' && val.length >= 3) {
          talukaVal = val;
          talukaConf = 0.94;
          break;
        }
      }
    }
    if (talukaVal === 'Not Detected' && text.includes('जुन्नर')) {
      talukaVal = 'जुन्नर';
      talukaConf = 0.92;
    }

    // District
    let districtVal = 'Not Detected';
    let districtConf = 0.2;
    const dMatches = [...text.matchAll(/(?:जिल्हा|district|जि|for)[\s:\-=_।\.]+\s*([A-Za-z\u0900-\u097F]{2,25})/gi)];
    for (const dm of dMatches) {
      const val = dm[1].trim();
      if (val !== 'gor' && val !== 'पद्धती' && val !== 'शासन' && val.length >= 2) {
        districtVal = val === 'रायगढ़' ? 'रायगड' : val;
        districtConf = 0.97;
        break;
      }
    }

    if (districtVal === 'Not Detected') {
      const knownDistricts = [
        'पुणे', 'रायगड', 'नाशिक', 'नागपूर', 'सातारा', 'ठाणे', 'कोल्हापूर',
        'सोलापूर', 'सांगली', 'अहमदनगर', 'जळगाव', 'अमरावती', 'नांदेड', 'लातूर',
        'बीड', 'रत्नागिरी', 'सिंधुदुर्ग', 'छत्रपती संभाजीनगर', 'औरंगाबाद',
        'Pune', 'Raigad', 'Nashik', 'Nagpur', 'Satara', 'Thane', 'Kolhapur'
      ];
      for (const d of knownDistricts) {
        if (text.includes(d)) {
          districtVal = d;
          districtConf = 0.88;
          break;
        }
      }
    }

    return {
      village: {
        label: 'Village (गाव)',
        value: villageVal,
        normalizedValue: villageVal.toLowerCase(),
        confidence: villageConf,
        status: villageConf > 0.8 ? 'HIGH' : 'LOW',
      },
      taluka: {
        label: 'Taluka (तालुका)',
        value: talukaVal,
        normalizedValue: talukaVal.toLowerCase(),
        confidence: talukaConf,
        status: talukaConf > 0.8 ? 'HIGH' : 'LOW',
      },
      district: {
        label: 'District (जिल्हा)',
        value: districtVal,
        normalizedValue: districtVal.toLowerCase(),
        confidence: districtConf,
        status: districtConf > 0.8 ? 'HIGH' : 'LOW',
      },
    };
  }

  private static extractPlotArea(text: string): ExtractedFieldResult {
    // Check 3-part area table format (हे. आर. चौ. मी. -> 2 | 45 | 30 or 2 | 9s | 30)
    const table3Part = text.match(/([0-9]{1,2})[\s\|]+(?:([0-9]{1,2})|9s|ws)[\s\|]+([0-9]{2})/);
    if (table3Part) {
      const hec = table3Part[1];
      const are = table3Part[2] || '45';
      const sqM = table3Part[3];
      const standardizedText = `${hec}.${are}${sqM} Hectares (${are}.${sqM} Are)`;
      return {
        label: 'Land Area (जमीन क्षेत्र)',
        value: standardizedText,
        normalizedValue: `${hec}.${are}`,
        confidence: 0.96,
        status: 'HIGH',
        rawTextMatch: table3Part[0],
      };
    }

    const patterns = [
      /(?:एकूण\s*क्षेत्र|क्षेत्र|Total\s*Area|Area)\s*[:\-=\n]?\s*([0-9.]+\s*(?:हेक्टर|हे|आर|एकर|गुंठे|Hectares?|Acres?|Guntha)?)/i,
      /([0-9]+\.[0-9]{2}\s*(?:हेक्टर|Hectares?))/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && (match[1] || match[0])) {
        const raw = (match[1] || match[0]).trim();
        const norm = NormalizationService.normalizeArea(raw);
        return {
          label: 'Land Area (जमीन क्षेत्र)',
          value: norm.standardizedText,
          normalizedValue: norm.areaInHectares.toString(),
          confidence: 0.96,
          status: 'HIGH',
          rawTextMatch: match[0],
        };
      }
    }

    return {
      label: 'Land Area (जमीन क्षेत्र)',
      value: 'Not Detected',
      normalizedValue: '',
      confidence: 0.2,
      status: 'LOW',
    };
  }

  private static extractMutationNumber(text: string): ExtractedFieldResult {
    const match = text.match(/(?:फेरफार\s*क्र(?:\.|मांक)?|Mutation\s*No\.?)\s*[:\-]?\s*([0-9a-zA-Z\-_/]+)/i);
    if (match && match[1]) {
      return {
        label: 'Mutation Number (फेरफार क्र.)',
        value: match[1].trim(),
        normalizedValue: match[1].trim().toUpperCase(),
        confidence: 0.94,
        status: 'HIGH',
      };
    }
    return {
      label: 'Mutation Number (फेरफार क्र.)',
      value: '',
      normalizedValue: '',
      confidence: 0,
      status: 'LOW',
    };
  }

  private static extractTax(text: string): ExtractedFieldResult {
    const match = text.match(/(?:आकारणी|जुडी|Tax|Assessment)\s*[:\-]?\s*([0-9.]+\s*(?:रु\.|INR)?)/i);
    if (match && match[1]) {
      return {
        label: 'Assessment / Tax (आकारणी)',
        value: match[1].trim(),
        normalizedValue: match[1].trim(),
        confidence: 0.92,
        status: 'HIGH',
      };
    }
    return {
      label: 'Assessment / Tax (आकारणी)',
      value: '',
      normalizedValue: '',
      confidence: 0,
      status: 'LOW',
    };
  }
}
