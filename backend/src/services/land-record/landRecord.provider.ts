import { LandRecord, ILandRecord } from '../../models/LandRecord.js';
import { NormalizationService } from '../extraction/normalization.service.js';

export interface LandRecordQuery {
  surveyNumber?: string;
  gatNumber?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  ownerName?: string;
}

export interface CadastralRecordResult {
  recordId: string;
  ownerName: string;
  surveyNumber: string;
  gatNumber?: string;
  khasraNumber: string;
  khataNumber: string;
  plotArea: string;
  village: string;
  tehsil: string;
  district: string;
  landClassification: string;
  mutationNumber?: string;
  sourceType: 'DEMO_REFERENCE_RECORD' | 'GOVERNMENT_REGISTRY';
  isOfficialRecord: boolean;
}

export interface ILandRecordProvider {
  findMatchingRecord(query: LandRecordQuery): Promise<CadastralRecordResult | null>;
  getRecordById(recordId: string): Promise<CadastralRecordResult | null>;
  listDemoRecords(limit?: number): Promise<CadastralRecordResult[]>;
}

export class DemoLandRecordProvider implements ILandRecordProvider {
  /**
   * Search for official land record matching extracted fields from database
   */
  public async findMatchingRecord(query: LandRecordQuery): Promise<CadastralRecordResult | null> {
    try {
      const normalizedSurvey = query.surveyNumber
        ? NormalizationService.normalizeSurveyNumber(query.surveyNumber)
        : '';
      const normalizedName = query.ownerName
        ? NormalizationService.normalizeName(query.ownerName)
        : '';

      // 1. Try matching by Survey / Gat number in MongoDB
      if (normalizedSurvey) {
        const doc = await LandRecord.findOne({
          $or: [
            { surveyNumber: new RegExp(normalizedSurvey.replace(/\//g, '[\/-]?'), 'i') },
            { gatNumber: new RegExp(normalizedSurvey.replace(/\//g, '[\/-]?'), 'i') },
            { recordId: query.surveyNumber },
          ],
        });

        if (doc) {
          return this.mapMongoDocToCadastral(doc);
        }
      }

      // 2. Try matching by Owner Name if provided
      if (normalizedName) {
        const nameRegex = new RegExp(normalizedName.split(' ')[0] || normalizedName, 'i');
        const docByName = await LandRecord.findOne({
          ownerName: nameRegex,
        });

        if (docByName) {
          return this.mapMongoDocToCadastral(docByName);
        }
      }

      return null;
    } catch (err) {
      console.warn('Error querying LandRecord from database:', err);
      return null;
    }
  }

  public async getRecordById(recordId: string): Promise<CadastralRecordResult | null> {
    try {
      const doc = await LandRecord.findOne({
        $or: [{ recordId }, { _id: recordId.match(/^[0-9a-fA-F]{24}$/) ? recordId : undefined }],
      });
      if (doc) return this.mapMongoDocToCadastral(doc);
      return null;
    } catch (err) {
      console.warn('Error fetching LandRecord by ID:', err);
      return null;
    }
  }

  public async listDemoRecords(limit = 50): Promise<CadastralRecordResult[]> {
    try {
      const records = await LandRecord.find().limit(limit);
      if (records.length > 0) {
        return records.map((r) => this.mapMongoDocToCadastral(r));
      }
    } catch (err) {
      console.warn('Error fetching land records from DB:', err);
    }
    return [];
  }

  private mapMongoDocToCadastral(doc: ILandRecord): CadastralRecordResult {
    return {
      recordId: doc.recordId || doc._id.toString(),
      ownerName: doc.ownerName,
      surveyNumber: doc.surveyNumber,
      gatNumber: doc.gatNumber || doc.surveyNumber,
      khasraNumber: doc.khasraNumber,
      khataNumber: doc.khataNumber,
      plotArea: doc.plotArea,
      village: doc.village,
      tehsil: doc.tehsil,
      district: doc.district,
      landClassification: doc.landClassification,
      mutationNumber: doc.mutationNumber || undefined,
      sourceType: (doc.sourceType as any) || 'DEMO_REFERENCE_RECORD',
      isOfficialRecord: true,
    };
  }
}
