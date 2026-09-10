import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Printer, Download, QrCode, ShieldCheck, MapPin, Scale, Lock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LandRecord } from '../../types';

interface UrbanPropertyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LandRecord | null;
}

export const UrbanPropertyCardModal: React.FC<UrbanPropertyCardModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { t } = useTranslation();
  if (!record) return null;

  const ulpin = record.ulpin || '81LVQLD9407JH0';
  const circleRate = record.circleRatePerSqm || 4200;
  const valuation = record.calculatedValuation || 5250000;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NAKSHA Urban Property Card (UrPro)"
      description="Digital India Land Records Modernization Programme (DILRMP 3.0)"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Printable Property Card */}
        <div id="naksha-property-card" className="border-2 border-slate-800 rounded-xl p-5 bg-white text-slate-900 shadow-sm relative space-y-4 font-sans print:border-black">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-600 bg-amber-50 flex items-center justify-center font-serif font-black text-amber-900 text-lg">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  GOVERNMENT OF MAHARASHTRA • REVENUE & SURVEY DEPT
                </span>
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  NAKSHA URBAN PROPERTY REGISTER (UrPro)
                </h2>
                <p className="text-[11px] text-slate-600">
                  Issued under DILRMP 3.0 National Cadastral & Urban Framework
                </p>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">VERIFIED QR</span>
            </div>
          </div>

          {/* Bhu-Aadhaar Highlight Strip */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Bhu-Aadhaar (14-Digit Unique Land Parcel Identification Number - ULPIN)
              </span>
              <span className="font-mono text-lg font-black text-amber-950 tracking-widest">
                {ulpin}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Digitally Authenticated
            </div>
          </div>

          {/* Core Property Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Owner / Titleholder</span>
              <span className="font-bold text-slate-900 text-sm">{record.ownerName}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Survey / Gat / CTS No.</span>
              <span className="font-bold text-slate-900 text-sm">{record.surveyNumber}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Plot / Built-up Area</span>
              <span className="font-bold text-emerald-800 text-sm">{record.plotArea}</span>
            </div>

            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Urban Ward & Municipal Body</span>
              <span className="font-medium text-slate-800">Ward 12, {record.district} Municipal Corp</span>
            </div>
            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Location / Village</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {record.village}, {record.tehsil}
              </span>
            </div>
            <div className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Zoning / Land Use</span>
              <span className="font-medium text-slate-800">{record.landClassification}</span>
            </div>
          </div>

          {/* Financial & Legal Encumbrance Status */}
          <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/30">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              Legal & Financial Encumbrance Verification
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Lock className={`w-4 h-4 mt-0.5 ${record.hasBankCharge ? 'text-amber-600' : 'text-emerald-600'}`} />
                <div>
                  <span className="font-bold block text-slate-800">Unified Lending (ULI) Lien:</span>
                  <span className="text-[11px] text-slate-600">
                    {record.hasBankCharge
                      ? `Lien active: ${record.bankChargeDetails?.bankName || 'Commercial Bank'}`
                      : 'Clear (No bank charges registered)'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Scale className={`w-4 h-4 mt-0.5 ${record.hasActiveDispute ? 'text-rose-600' : 'text-emerald-600'}`} />
                <div>
                  <span className="font-bold block text-slate-800">RCCMS Revenue Court Dispute:</span>
                  <span className="text-[11px] text-slate-600">
                    {record.hasActiveDispute
                      ? `Contested: Case ${record.rccmsCaseNumber || 'PENDING'}`
                      : 'Clear (No pending revenue disputes)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Valuation Strip */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Circle Rate Guidance</span>
              <span className="font-bold text-slate-800">₹{circleRate.toLocaleString('en-IN')}/sq.m</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessed Govt Valuation</span>
              <span className="font-mono text-base font-extrabold text-emerald-700">
                ₹{valuation.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bhu-Aadhaar Seeding</span>
              <span className="font-bold text-indigo-700">
                {record.isAadhaarSeeded ? record.aadhaarMasked || 'Seeded & Verified' : 'Not Seeded'}
              </span>
            </div>
          </div>

          {/* Footer Watermark */}
          <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Certificate ID: UrPro-{ulpin.slice(0, 8)}-2026</span>
            <span>Generated under Section 148 of Maharashtra Land Revenue Code & DILRMP 3.0</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Property Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};
