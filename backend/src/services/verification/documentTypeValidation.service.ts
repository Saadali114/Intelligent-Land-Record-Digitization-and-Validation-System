export type DocumentTypeValidationStatus = 'PASS' | 'REVIEW_REQUIRED';

export interface DocumentTypeValidationResult {
  detectedType: '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER';
  declaredType: string;
  isMatching: boolean;
  status: DocumentTypeValidationStatus;
  confidence: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  notes: string;
}

export class DocumentTypeValidationService {
  private static KEYWORD_MAP: Record<'7_12' | '8A' | 'FERFAR' | 'SALE_DEED', string[]> = {
    '7_12': [
      'गाव नमुना सात',
      '७/१२',
      '7/12',
      'अधिकार अभिलेख पत्रक',
      'भोगवटादार',
      'पिकांची नोंदवही',
      'गाव नमुना बारा',
      'खाते क्रमांक',
      'गट क्रमांक',
    ],
    '8A': [
      'गाव नमुना आठ',
      '८-अ',
      '८ अ',
      'खातेनिहाय',
      'जमीन महसूल',
      'आकारणी',
      'एकंदर क्षेत्र',
    ],
    'FERFAR': [
      'गाव नमुना सहा',
      'फेरफार नोंदवही',
      'हक्क नोंदणी पत्रक',
      'फेरफार',
      'mutation',
      'मंजूर',
      'नोंद क्रमांक',
    ],
    'SALE_DEED': [
      'खरेदी खत',
      'विक्री पत्र',
      'sale deed',
      'conveyance deed',
      'दुय्यम निबंधक',
      'मुद्रांक शुल्क',
      'नोंदणी',
      'पक्षाकार',
    ],
  };

  /**
   * Validate that document structure corresponds to the declared document type
   */
  public static validate(
    rawText: string,
    declaredType: string
  ): DocumentTypeValidationResult {
    const textLower = rawText.toLowerCase();

    let detectedType: '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER' = 'OTHER';
    let highestCount = 0;
    let matchedKeywords: string[] = [];
    let bestMatchedKeywords: string[] = [];

    // Evaluate keyword frequency for each document type
    for (const [docType, keywords] of Object.entries(this.KEYWORD_MAP) as Array<
      ['7_12' | '8A' | 'FERFAR' | 'SALE_DEED', string[]]
    >) {
      const currentMatches = keywords.filter((kw) => textLower.includes(kw.toLowerCase()));
      if (currentMatches.length > highestCount) {
        highestCount = currentMatches.length;
        detectedType = docType;
        bestMatchedKeywords = currentMatches;
      }
    }

    // Check if declared type matches detected type
    const normalizedDeclared = this.normalizeDeclaredType(declaredType);
    const isMatching = detectedType === normalizedDeclared || detectedType === 'OTHER';

    const requiredKeywords =
      normalizedDeclared !== 'OTHER' ? this.KEYWORD_MAP[normalizedDeclared] || [] : [];
    const missingKeywords = requiredKeywords.filter(
      (kw) => !textLower.includes(kw.toLowerCase())
    );

    const confidence =
      highestCount >= 3 ? 0.95 : highestCount >= 1 ? 0.8 : 0.5;

    let status: DocumentTypeValidationStatus = 'PASS';
    let notes = `Document structure aligns with ${detectedType} standards.`;

    if (!isMatching) {
      status = 'REVIEW_REQUIRED';
      notes = `Document type mismatch: User uploaded document declared as "${declaredType}", but structure corresponds to "${detectedType}".`;
    } else if (highestCount === 0) {
      status = 'REVIEW_REQUIRED';
      notes = 'Standard government form headers and register markers could not be conclusively identified.';
    }

    return {
      detectedType,
      declaredType,
      isMatching,
      status,
      confidence,
      matchedKeywords: bestMatchedKeywords,
      missingKeywords: missingKeywords.slice(0, 3),
      notes,
    };
  }

  private static normalizeDeclaredType(
    declared: string
  ): '7_12' | '8A' | 'FERFAR' | 'SALE_DEED' | 'OTHER' {
    const d = (declared || '').toLowerCase();
    if (d.includes('7/12') || d.includes('7_12') || d.includes('satbara')) return '7_12';
    if (d.includes('8a') || d.includes('8-a') || d.includes('8_a')) return '8A';
    if (d.includes('ferfar') || d.includes('mutation')) return 'FERFAR';
    if (d.includes('sale') || d.includes('deed') || d.includes('kharidi')) return 'SALE_DEED';
    return 'OTHER';
  }
}
