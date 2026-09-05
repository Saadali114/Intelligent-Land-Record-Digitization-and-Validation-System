import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';
import {
  VerificationWorkflow,
  OfficerDecisionType,
} from '../models/VerificationWorkflow.js';
import { LandRecord } from '../models/LandRecord.js';
import { DocumentModel } from '../models/Document.js';
import { AuditLog } from '../models/AuditLog.js';
import { VerificationOrchestrator } from '../services/verification/verificationOrchestrator.service.js';
import { DemoLandRecordProvider } from '../services/land-record/landRecord.provider.js';

const landRecordProvider = new DemoLandRecordProvider();

export class VerificationModuleController {
  /**
   * Citizen initiates document upload and AI verification
   */
  public static async uploadAndVerify(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const file = req.file;
      const declaredDocType = req.body.documentType || '7/12';
      const casePreset = req.body.casePreset;

      let fileBuffer: Buffer;
      let originalName: string;
      let mimeType: string;

      if (file) {
        fileBuffer = file.buffer;
        originalName = file.originalname;
        mimeType = file.mimetype;
      } else {
        // Fallback for preset testing if no file uploaded
        fileBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
        originalName = `${declaredDocType.replace(/\//g, '_')}_Document.pdf`;
        mimeType = 'application/pdf';
      }

      const workflow = await VerificationOrchestrator.processDocument({
        fileBuffer,
        originalName,
        mimeType,
        declaredDocType,
        casePreset,
        user: {
          _id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
        },
      });

      sendSuccess(res, 'Document uploaded and analyzed successfully', workflow, 201);
    } catch (error: any) {
      console.error('Error in uploadAndVerify:', error);
      sendError(res, error.message || 'Failed to process document verification', 500);
    }
  }

  /**
   * Get application workflow details by applicationId or Mongo ID
   */
  public static async getWorkflowDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const workflow = await VerificationWorkflow.findOne({
        $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });

      if (!workflow) {
        sendError(res, 'Verification application not found', 404);
        return;
      }

      sendSuccess(res, 'Verification details retrieved successfully', workflow);
    } catch (error: any) {
      console.error('Error in getWorkflowDetail:', error);
      sendError(res, 'Failed to retrieve verification details', 500);
    }
  }

  /**
   * Citizen views their submitted verification applications
   */
  public static async getCitizenWorkflows(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const query: any = {
        $or: [{ userId: req.user._id }, { 'applicant.email': req.user.email }],
      };

      const total = await VerificationWorkflow.countDocuments(query);
      const workflows = await VerificationWorkflow.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      sendSuccess(
        res,
        'Citizen applications retrieved successfully',
        workflows,
        200,
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      );
    } catch (error: any) {
      console.error('Error in getCitizenWorkflows:', error);
      sendError(res, 'Failed to retrieve applications', 500);
    }
  }

  /**
   * Officer views pending review queue
   */
  public static async getOfficerQueue(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 15;
      const skip = (page - 1) * limit;

      const { status, riskLevel, search } = req.query;

      const query: any = {};
      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (riskLevel && riskLevel !== 'ALL') {
        query['riskAssessment.level'] = riskLevel;
      }
      if (search) {
        query.$or = [
          { applicationId: new RegExp(search as string, 'i') },
          { 'applicant.name': new RegExp(search as string, 'i') },
          { 'document.fileName': new RegExp(search as string, 'i') },
          { 'officialRecordMatch.matchedSurveyNumber': new RegExp(search as string, 'i') },
        ];
      }

      const total = await VerificationWorkflow.countDocuments(query);
      const items = await VerificationWorkflow.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      sendSuccess(res, 'Officer queue retrieved successfully', items, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      console.error('Error in getOfficerQueue:', error);
      sendError(res, 'Failed to fetch verification queue', 500);
    }
  }

  /**
   * Officer submits authoritative decision: [APPROVE], [REQUEST CLARIFICATION], [REJECT]
   */
  public static async submitOfficerDecision(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const { id } = req.params;
      const { decision, remarks, clarificationMessage } = req.body;

      if (!['APPROVED', 'CLARIFICATION_REQUESTED', 'REJECTED'].includes(decision)) {
        sendError(res, 'Invalid decision. Must be APPROVED, CLARIFICATION_REQUESTED, or REJECTED.', 400);
        return;
      }

      if (decision === 'CLARIFICATION_REQUESTED' && (!clarificationMessage || !clarificationMessage.trim())) {
        sendError(res, 'Clarification message to citizen is mandatory when requesting clarification.', 400);
        return;
      }

      if (decision === 'REJECTED' && (!remarks || !remarks.trim())) {
        sendError(res, 'Reason for rejection is mandatory.', 400);
        return;
      }

      const workflow = await VerificationWorkflow.findOne({
        $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });

      if (!workflow) {
        sendError(res, 'Verification application not found', 404);
        return;
      }

      const now = new Date();
      workflow.officerDecision = {
        status: decision as OfficerDecisionType,
        officerId: req.user._id.toString(),
        officerName: req.user.name,
        remarks: remarks || clarificationMessage,
        decidedAt: now,
      };

      if (decision === 'APPROVED') {
        workflow.status = 'VERIFIED';
        workflow.auditTimeline.push({
          timestamp: now.toISOString(),
          action: 'OFFICER_APPROVED',
          actor: req.user.name,
          actorRole: 'OFFICER',
          description: `Verification application approved. Remarks: ${remarks || 'Approved without caveat.'}`,
        });
      } else if (decision === 'CLARIFICATION_REQUESTED') {
        workflow.status = 'ACTION_REQUIRED';
        if (!workflow.clarificationHistory) {
          workflow.clarificationHistory = [];
        }
        workflow.clarificationHistory.push({
          requestedAt: now,
          officerMessage: clarificationMessage.trim(),
        });
        workflow.auditTimeline.push({
          timestamp: now.toISOString(),
          action: 'CLARIFICATION_REQUESTED',
          actor: req.user.name,
          actorRole: 'OFFICER',
          description: `Clarification requested from applicant: "${clarificationMessage.trim()}"`,
        });
      } else if (decision === 'REJECTED') {
        workflow.status = 'REJECTED';
        workflow.auditTimeline.push({
          timestamp: now.toISOString(),
          action: 'OFFICER_REJECTED',
          actor: req.user.name,
          actorRole: 'OFFICER',
          description: `Verification application rejected. Reason: "${remarks.trim()}"`,
        });
      }

      await workflow.save();

      // Update related DocumentModel status
      if (workflow.documentId) {
        await DocumentModel.findByIdAndUpdate(workflow.documentId, {
          processingStatus: workflow.status,
        });
      }

      // Log to Audit Log
      await AuditLog.create({
        userId: req.user._id,
        action: `DECISION_${decision}`,
        resourceType: 'VerificationWorkflow',
        resourceId: workflow.applicationId,
        description: `Officer ${req.user.name} submitted decision: ${decision} on application ${workflow.applicationId}`,
        timestamp: now,
      });

      sendSuccess(res, `Officer decision recorded: ${decision}`, workflow);
    } catch (error: any) {
      console.error('Error in submitOfficerDecision:', error);
      sendError(res, 'Failed to record officer decision', 500);
    }
  }

  /**
   * Citizen responds to officer clarification request
   */
  public static async respondToClarification(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const { id } = req.params;
      const { responseText } = req.body;

      if (!responseText || !responseText.trim()) {
        sendError(res, 'Clarification response text is required', 400);
        return;
      }

      const workflow = await VerificationWorkflow.findOne({
        $or: [{ applicationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });

      if (!workflow) {
        sendError(res, 'Verification application not found', 404);
        return;
      }

      const now = new Date();
      if (workflow.clarificationHistory && workflow.clarificationHistory.length > 0) {
        const latestClarification = workflow.clarificationHistory[workflow.clarificationHistory.length - 1];
        latestClarification.respondedAt = now;
        latestClarification.responseText = responseText.trim();
      }

      workflow.status = 'PENDING_OFFICER_REVIEW';
      workflow.officerDecision.status = 'PENDING';

      workflow.auditTimeline.push({
        timestamp: now.toISOString(),
        action: 'CITIZEN_CLARIFICATION_SUBMITTED',
        actor: req.user.name,
        actorRole: 'CITIZEN',
        description: `Citizen submitted clarification: "${responseText.trim()}"`,
      });

      await workflow.save();

      sendSuccess(res, 'Clarification submitted successfully. Application returned to officer review queue.', workflow);
    } catch (error: any) {
      console.error('Error in respondToClarification:', error);
      sendError(res, 'Failed to submit clarification', 500);
    }
  }

  /**
   * List demo reference records (Admin / Officer view)
   */
  public static async listDemoLandRecords(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const records = await landRecordProvider.listDemoRecords(50);
      sendSuccess(res, 'Demo land records retrieved successfully', records);
    } catch (error: any) {
      console.error('Error in listDemoLandRecords:', error);
      sendError(res, 'Failed to retrieve demo land records', 500);
    }
  }

  /**
   * Admin creates new demo reference record
   */
  public static async createDemoLandRecord(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
      }

      const {
        recordId,
        ownerName,
        surveyNumber,
        gatNumber,
        khasraNumber,
        khataNumber,
        plotArea,
        village,
        tehsil,
        district,
        landClassification,
        mutationNumber,
      } = req.body;

      if (!ownerName || !surveyNumber || !village || !tehsil || !district || !plotArea) {
        sendError(res, 'Missing required land record fields', 400);
        return;
      }

      const record = await LandRecord.create({
        recordId: recordId || `LR-${Date.now().toString().slice(-4)}`,
        ownerName,
        surveyNumber,
        gatNumber: gatNumber || surveyNumber,
        khasraNumber: khasraNumber || `KH-${Date.now().toString().slice(-4)}`,
        khataNumber: khataNumber || `KT-${Date.now().toString().slice(-3)}`,
        plotArea,
        village,
        tehsil,
        district,
        landClassification: landClassification || 'Agricultural (Jirayat)',
        ownershipType: 'Single Owner',
        mutationNumber,
        sourceType: 'DEMO_REFERENCE_RECORD',
        verificationStatus: 'VERIFIED',
        createdBy: req.user._id,
        confidenceScore: 0.99,
        remarks: 'Official Cadastral Reference Record (Demo Environment)',
      });

      sendSuccess(res, 'Demo reference record created successfully', record, 201);
    } catch (error: any) {
      console.error('Error in createDemoLandRecord:', error);
      sendError(res, error.message || 'Failed to create demo land record', 500);
    }
  }

  /**
   * Admin updates demo reference record
   */
  public static async updateDemoLandRecord(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await LandRecord.findOneAndUpdate(
        { $or: [{ recordId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }] },
        { ...req.body },
        { new: true }
      );

      if (!updated) {
        sendError(res, 'Land record not found', 404);
        return;
      }

      sendSuccess(res, 'Demo reference record updated successfully', updated);
    } catch (error: any) {
      console.error('Error in updateDemoLandRecord:', error);
      sendError(res, 'Failed to update demo land record', 500);
    }
  }

  /**
   * Admin deletes demo reference record
   */
  public static async deleteDemoLandRecord(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await LandRecord.findOneAndDelete({
        $or: [{ recordId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });

      if (!deleted) {
        sendError(res, 'Land record not found', 404);
        return;
      }

      sendSuccess(res, 'Demo reference record deleted successfully', deleted);
    } catch (error: any) {
      console.error('Error in deleteDemoLandRecord:', error);
      sendError(res, 'Failed to delete demo land record', 500);
    }
  }
}
