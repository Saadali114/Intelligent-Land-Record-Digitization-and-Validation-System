'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { DemoBanner } from '../../../components/citizen-verification/DemoBanner';
import { DemoCaseSelector } from '../../../components/citizen-verification/DemoCaseSelector';
import { StepIdentityVerification } from '../../../components/citizen-verification/StepIdentityVerification';
import { StepDocumentUpload } from '../../../components/citizen-verification/StepDocumentUpload';
import { StepPipelineProgress } from '../../../components/citizen-verification/StepPipelineProgress';
import { StepDualPaneOcrReview } from '../../../components/citizen-verification/StepDualPaneOcrReview';
import { StepDocumentConsistencyPanel } from '../../../components/citizen-verification/StepDocumentConsistencyPanel';
import { StepOfficialRecordMatch } from '../../../components/citizen-verification/StepOfficialRecordMatch';
import { StepRelationshipVerification } from '../../../components/citizen-verification/StepRelationshipVerification';
import { StepRiskAnalysisCard } from '../../../components/citizen-verification/StepRiskAnalysisCard';
import { StepApplicationTimeline } from '../../../components/citizen-verification/StepApplicationTimeline';
import {
  verificationWorkflowService,
  VerificationWorkflowData,
} from '../../../services/verificationWorkflowService';

export default function CitizenVerifyPage() {
  const { t } = useTranslation();
  const [activePreset, setActivePreset] = useState<'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED'>('CASE_1_GREEN');
  const [workflow, setWorkflow] = useState<VerificationWorkflowData>(
    verificationWorkflowService.getPreset('CASE_1_GREEN')
  );

  // Workflow steps:
  // 1: Identity
  // 2: Upload
  // 3: Pipeline Processing
  // 4: Verification Results (Full 4-Pillar Review)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPreset = (presetKey: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED') => {
    setActivePreset(presetKey);
    const newWorkflow = verificationWorkflowService.getPreset(presetKey);
    setWorkflow(newWorkflow);
  };

  const handleStartProcessing = () => {
    setActiveStep(3);
  };

  const handlePipelineComplete = () => {
    setActiveStep(4);
  };

  const handleReset = () => {
    const newWorkflow = verificationWorkflowService.getPreset(activePreset);
    setWorkflow(newWorkflow);
    setActiveStep(1);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Prototype Environment Notice */}
        <DemoBanner />

        {/* Page Header */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t('verificationWorkflow.trackingLabel')}: {workflow.trackingNumber}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">ID: {workflow.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t('verificationWorkflow.pageTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('verificationWorkflow.pageDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('verificationWorkflow.resetFlow')}</span>
            </button>
            <Link
              href={`/verification/${workflow.id}`}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-sky-950"
            >
              <span>{t('verificationWorkflow.officerWorkspace')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1-Click Preset Case Selector */}
        <DemoCaseSelector
          selectedPreset={activePreset}
          onSelectPreset={handleSelectPreset}
          disabled={activeStep === 3}
        />

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`py-2 px-3 rounded-lg text-center transition-all ${
              activeStep === 1
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t('verificationWorkflow.step1Identity')}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`py-2 px-3 rounded-lg text-center transition-all ${
              activeStep === 2
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t('verificationWorkflow.step2Upload')}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`py-2 px-3 rounded-lg text-center transition-all ${
              activeStep === 3
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t('verificationWorkflow.step3Pipeline')}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`py-2 px-3 rounded-lg text-center transition-all ${
              activeStep === 4
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t('verificationWorkflow.step4Dossier')}
          </button>
        </div>

        {/* Step 1: Identity Verification */}
        {activeStep === 1 && (
          <StepIdentityVerification
            workflow={workflow}
            onComplete={() => setActiveStep(2)}
          />
        )}

        {/* Step 2: Document Upload */}
        {activeStep === 2 && (
          <StepDocumentUpload
            workflow={workflow}
            onStartProcessing={handleStartProcessing}
            isProcessing={isProcessing}
          />
        )}

        {/* Step 3: Pipeline Execution */}
        {activeStep === 3 && (
          <StepPipelineProgress onComplete={handlePipelineComplete} speedMs={350} />
        )}

        {/* Step 4: Verification Results Dossier */}
        {activeStep === 4 && (
          <div className="space-y-6">
            {/* Pillar 2: Scan and OCR Extracted Attributes */}
            <StepDualPaneOcrReview workflow={workflow} />

            {/* Pillar 2: Document Consistency Analysis */}
            <StepDocumentConsistencyPanel workflow={workflow} />

            {/* Pillar 3: Official Land Record Matching */}
            <StepOfficialRecordMatch workflow={workflow} />

            {/* Pillar 4: User ↔ Land Relationship Verification */}
            <StepRelationshipVerification workflow={workflow} />

            {/* Rule-Based Risk Engine Score */}
            <StepRiskAnalysisCard workflow={workflow} />

            {/* Application Lifecycle Audit Trail */}
            <StepApplicationTimeline workflow={workflow} />

            {/* Bottom Actions */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">{t('verificationWorkflow.appProcessedTitle')}</h4>
                <p className="text-xs text-slate-400">
                  {t('verificationWorkflow.appProcessedDesc')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  {t('verificationWorkflow.testAnotherCase')}
                </button>
                <Link
                  href={`/verification/${workflow.id}`}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <span>{t('verificationWorkflow.openOfficerWorkspace')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
