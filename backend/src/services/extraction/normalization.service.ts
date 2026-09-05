/**
 * Normalization Service for Indian Land Documents
 * Handles Devanagari numerals, abbreviations, honorifics, and area units.
 */

export class NormalizationService {
  private static DEVANAGARI_DIGITS_MAP: Record<string, string> = {
    '०': '0',
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
  };

  /**
   * Convert any Devanagari numerals in the text to standard Arabic numerals (0-9)
   */
  public static convertDevanagariNumerals(text: string): string {
    if (!text) return '';
    return text.replace(/[०-९]/g, (digit) => this.DEVANAGARI_DIGITS_MAP[digit] || digit);
  }

  /**
   * General text cleaning: normalize spaces, strip zero-width characters, strip artifacts
   */
  public static cleanText(text: string): string {
    if (!text) return '';
    return text
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width characters
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  /**
   * Normalize an Indian name:
   * Strips prefixes like श्री, श्रीमती, सौ, Shri, Shrimati, Smt, Mr, Mrs, Late, स्व.
   * Cleans punctuation and returns lowercase trimmed tokens for comparison.
   */
  public static normalizeName(name: string): string {
    if (!name) return '';
    let normalized = this.cleanText(name);

    // Remove common prefixes
    const prefixRegex =
      /^(श्री\.|श्रीमान|श्रीमती|सौ\.|कै\.|स्व\.|shri|mr\.|mrs\.|ms\.|smt\.|late)\s+/i;
    normalized = normalized.replace(prefixRegex, '');

    // Remove titles like (मयत) or (वारस)
    normalized = normalized.replace(/\((मयत|वारस|नाबालिग|खरेदीदार|विक्रेता)\)/gi, '');

    // Replace dots and special characters with spaces
    normalized = normalized.replace(/[.,\-_/\\()]/g, ' ');

    return normalized.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /**
   * Normalize land area to Hectares (float) and standardized label
   * Handles formats:
   * - "1.25 Hectares" / "१.२५ हेक्टर"
   * - "0 हे. 45 आर" / "0 He 45 R" (1 R = 0.01 Ha)
   * - "2.5 Acres" (1 Acre ≈ 0.404686 Ha)
   * - "20 Guntha" (1 Guntha ≈ 0.010117 Ha)
   */
  public static normalizeArea(rawArea: string): {
    areaInHectares: number;
    standardizedText: string;
    raw: string;
  } {
    if (!rawArea) {
      return { areaInHectares: 0, standardizedText: '0.00 Ha', raw: '' };
    }

    const cleaned = this.convertDevanagariNumerals(rawArea).toLowerCase();

    // Check for "Hectare - Are - Sq.m" pattern common in 7/12 (e.g., "1-25-0" or "1 हेक्टर 25 आर")
    const heAreMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:हेक्टर|हे|he|h)\s*(?:व\s*)?(\d+(?:\.\d+)?)\s*(?:आर|r)?/);
    if (heAreMatch) {
      const he = parseFloat(heAreMatch[1]) || 0;
      const are = parseFloat(heAreMatch[2]) || 0;
      const totalHa = he + are * 0.01;
      return {
        areaInHectares: parseFloat(totalHa.toFixed(4)),
        standardizedText: `${totalHa.toFixed(2)} Hectares`,
        raw: rawArea,
      };
    }

    // Check for "X.XX Hectares / हेक्टर"
    const haMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:hectares?|हेक्टर|हे)/);
    if (haMatch) {
      const val = parseFloat(haMatch[1]);
      return {
        areaInHectares: parseFloat(val.toFixed(4)),
        standardizedText: `${val.toFixed(2)} Hectares`,
        raw: rawArea,
      };
    }

    // Check for Acres
    const acreMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:acres?|एकर)/);
    if (acreMatch) {
      const acres = parseFloat(acreMatch[1]);
      const ha = acres * 0.404686;
      return {
        areaInHectares: parseFloat(ha.toFixed(4)),
        standardizedText: `${ha.toFixed(2)} Hectares (${acres} Acres)`,
        raw: rawArea,
      };
    }

    // Check for Guntha
    const gunthaMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:guntha|गुंठे)/);
    if (gunthaMatch) {
      const guntha = parseFloat(gunthaMatch[1]);
      const ha = guntha * 0.010117;
      return {
        areaInHectares: parseFloat(ha.toFixed(4)),
        standardizedText: `${ha.toFixed(2)} Hectares (${guntha} Guntha)`,
        raw: rawArea,
      };
    }

    // Direct decimal number fallback
    const numericMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (numericMatch) {
      const val = parseFloat(numericMatch[1]);
      return {
        areaInHectares: parseFloat(val.toFixed(4)),
        standardizedText: `${val.toFixed(2)} Hectares`,
        raw: rawArea,
      };
    }

    return { areaInHectares: 0, standardizedText: rawArea.trim(), raw: rawArea };
  }

  /**
   * Normalize survey/gat number: e.g. "१४५/२-अ" -> "145/2A", "Gat 145 / 2 A" -> "145/2A"
   */
  public static normalizeSurveyNumber(rawSurvey: string): string {
    if (!rawSurvey) return '';
    let normalized = this.convertDevanagariNumerals(rawSurvey).toUpperCase();
    // Remove prefixes
    normalized = normalized.replace(/^(SURVEY\s*(?:NO|NUMBER)?|गट\s*क्र\.?|सर्व्हे\s*क्र\.?|GAT\s*NO\.?)\s*[:.-]?\s*/i, '');
    // Clean spaces around slashes and hyphens
    normalized = normalized.replace(/\s*[\/\-]\s*/g, '/');
    normalized = normalized.replace(/\s+/g, '');
    return normalized.trim();
  }
}
