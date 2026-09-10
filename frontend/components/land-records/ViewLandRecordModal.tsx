import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LandRecord } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import { MapPin, TrendingUp, Layers, Info, ShieldCheck, Building2, Scale, Lock } from 'lucide-react';
import { LandStackMultiLayerViewer } from '../land-stack/LandStackMultiLayerViewer';
import { AadhaarSeedingModal } from '../portal/AadhaarSeedingModal';
import { UrbanPropertyCardModal } from '../portal/UrbanPropertyCardModal';

interface ViewLandRecordModalProps {
  selectedRecord: LandRecord | null;
  onClose: () => void;
}

export const ViewLandRecordModal: React.FC<ViewLandRecordModalProps> = ({
  selectedRecord,
  onClose,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'land_stack' | 'overview'>('land_stack');
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [showPropertyCardModal, setShowPropertyCardModal] = useState(false);

  if (!selectedRecord) return null;

  return (
    <>
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={onClose}
        title={t('officerLandRecords.viewModalTitle', { defaultValue: 'Cadastral Record & Land Stack' })}
        description={`Survey No: ${selectedRecord.surveyNumber} • Bhu-Aadhaar: ${selectedRecord.ulpin || '81LVQLD9407JH0'}`}
        maxWidth="4xl"
      >
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('land_stack')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'land_stack'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              DILRMP 3.0 Land Stack (8 Layers)
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Cadastral Overview
            </button>
          </div>

          {activeTab === 'land_stack' ? (
            <LandStackMultiLayerViewer
              record={selectedRecord}
              onOpenAadhaarSeeding={() => setShowAadhaarModal(true)}
              onOpenPropertyCard={() => setShowPropertyCardModal(true)}
            />
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    {t('officerVerification.reviewQueue', { defaultValue: 'Verification Status' })}
                  </span>
                  <div className="mt-1">
                    <Badge status={selectedRecord.verificationStatus} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    {t('officerDashboard.avgOcrConfidence', { defaultValue: 'AI Confidence Score' })}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold text-slate-800">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {(selectedRecord.confidenceScore * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.primaryOwner', { defaultValue: 'Owner Name' })}</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedRecord.ownerName}</div>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.plotArea', { defaultValue: 'Plot Area' })}</span>
                  <div className="font-bold text-emerald-800 mt-0.5">{selectedRecord.plotArea}</div>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.khasra', { defaultValue: 'Khasra Number' })}</span>
                  <div className="font-mono text-slate-800 mt-0.5">{selectedRecord.khasraNumber}</div>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.classification', { defaultValue: 'Classification' })}</span>
                  <div className="text-slate-800 mt-0.5">{selectedRecord.landClassification}</div>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.ownershipType', { defaultValue: 'Ownership Type' })}</span>
                  <div className="text-slate-800 mt-0.5">{selectedRecord.ownershipType}</div>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">{t('officerLandRecords.village', { defaultValue: 'Location' })}</span>
                  <div className="text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedRecord.village}, {selectedRecord.district}
                  </div>
                </div>
              </div>

              {/* DILRMP 3.0 Highlights */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Circle Rate Valuation</span>
                  <span className="font-bold text-slate-800">
                    ₹{(selectedRecord.circleRatePerSqm || 3200).toLocaleString('en-IN')}/sq.m • Assessed: ₹{(selectedRecord.calculatedValuation || 4800000).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bhu-Aadhaar Status</span>
                  <span className="font-bold text-indigo-700">
                    {selectedRecord.isAadhaarSeeded ? `Seeded (${selectedRecord.aadhaarMasked || 'XXXX-XXXX-9124'})` : 'Pending Seeding'}
                  </span>
                </div>
              </div>

              {selectedRecord.sourceDocument && (
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-950 block">{t('officerDocuments.originalScan', { defaultValue: 'Source Archival Scan' })}</span>
                    <span className="text-[11px] text-blue-800">
                      {typeof selectedRecord.sourceDocument === 'object'
                        ? selectedRecord.sourceDocument.originalName
                        : 'Document Record Attached'}
                    </span>
                  </div>
                  <Link
                    href="/documents"
                    className="text-xs font-bold text-blue-900 hover:underline bg-white px-2.5 py-1 rounded border border-blue-300"
                  >
                    {t('common.view', { defaultValue: 'View' })}
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            <span>{formatDate(selectedRecord.createdAt)}</span>
            <Button variant="outline" size="sm" onClick={onClose}>
              {t('common.close', { defaultValue: 'Close' })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Aadhaar Seeding Modal */}
      <AadhaarSeedingModal
        isOpen={showAadhaarModal}
        onClose={() => setShowAadhaarModal(false)}
        record={selectedRecord}
      />

      {/* Urban Property Card Modal */}
      <UrbanPropertyCardModal
        isOpen={showPropertyCardModal}
        onClose={() => setShowPropertyCardModal(false)}
        record={selectedRecord}
      />
    </>
  );
};
