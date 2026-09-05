'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  MapPin,
  FileText,
  Download,
  ShieldCheck,
  Building2,
  ExternalLink,
  History,
  X,
  Eye,
  Check,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { citizenService } from '../../../services/citizen.service';
import { CitizenLandRecord } from '../../../types/citizen';
import { useTranslation } from 'react-i18next';

export default function CitizenLandRecordsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<CitizenLandRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CitizenLandRecord | null>(null);

  useEffect(() => {
    const list = citizenService.getLandRecords();
    setRecords(list);
  }, []);

  return (
    <PortalLayout>
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Digital Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('landRecords.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('landRecords.subtitle')}
          </p>
        </div>

        <Link href="/portal/upload">
          <Button variant="primary" size="md" className="gap-2 bg-blue-900 hover:bg-blue-800">
            <span>{t('landRecords.digitizeAnother')}</span>
          </Button>
        </Link>
      </div>

      {/* Grid of Verified Parcels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Survey / Gat No. {record.surveyNumber}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {record.status || record.recordStatus || 'VERIFIED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {record.village}, Taluka {record.taluka}, District {record.district}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              {/* ULPIN Badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 font-mono">
                <div className="text-[10px] text-slate-400 uppercase font-sans font-bold">
                  Bhu-Aadhaar / ULPIN (Unique Parcel ID)
                </div>
                <div className="text-slate-900 font-bold tracking-wider">
                  {record.ulpin || '27-25-045-00124-002'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-500">{t('upload.landArea') || 'Area'}:</span>
                  <div className="font-bold text-slate-900">{record.area}</div>
                </div>
                <div>
                  <span className="text-slate-500">{t('upload.landType') || 'Land Type'}:</span>
                  <div className="font-semibold text-slate-800">{record.landType}</div>
                </div>
                <div>
                  <span className="text-slate-500">{t('landRecords.assessmentTax')}</span>
                  <div className="font-medium text-slate-800">{record.assessment || '₹ 3.50 / year'}</div>
                </div>
                <div>
                  <span className="text-slate-500">{t('landRecords.encumbrance')}</span>
                  <div className="font-medium text-emerald-700">{record.encumbrance || 'Clear Title'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(record)}
                className="text-xs text-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t('landRecords.viewRecord')}</span>
              </button>

              <button
                onClick={() =>
                  alert(`Downloading Digitally Signed 7/12 Extract for Survey ${record.surveyNumber}...`)
                }
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('landRecords.downloadExtract')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-900 text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Survey {selectedRecord.surveyNumber} &bull; {selectedRecord.village}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ULPIN: {selectedRecord.ulpin || '27-25-045-00124-002'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ownership & Co-Owners */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('landRecords.khatedarHolders')}
              </h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                {(selectedRecord.owners || [selectedRecord.owner]).map((owner, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{owner}</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {t('landRecords.primaryKhatedar')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mutation History */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <History className="w-3.5 h-3.5" />
                <span>{t('landRecords.recordedMutations')}</span>
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                {selectedRecord.mutationHistory.map((m, i) => (
                  <div key={i} className="p-3 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-900">
                        {m.mutationNo}
                      </span>
                      <span className="text-[11px] text-slate-400">{m.date}</span>
                    </div>
                    <div className="font-medium text-slate-800">{m.type || m.nature}</div>
                    <p className="text-[11px] text-slate-500">
                      {m.details || (m.sanctionedBy ? 'Sanctioned by ' + m.sanctionedBy : '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedRecord(null)}
              >
                {t('common.close') || 'Close'}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  alert('Opening certified revenue map in cadastral GIS viewer...');
                }}
                className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{t('landRecords.viewGisBoundary')}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
