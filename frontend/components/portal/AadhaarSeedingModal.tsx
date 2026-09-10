import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, Phone, Fingerprint } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LandRecord } from '../../types';
import { landRecordsService } from '../../services/land-records.service';

interface AadhaarSeedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LandRecord | null;
  onSuccess?: () => void;
}

export const AadhaarSeedingModal: React.FC<AadhaarSeedingModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  if (!record) return null;

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    // Format with dashes: XXXX-XXXX-XXXX
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1-');
    setAadhaarInput(formatted);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileInput(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanAadhaar = aadhaarInput.replace(/-/g, '');
    if (cleanAadhaar.length !== 12) {
      setError('Please provide a valid 12-digit Aadhaar number.');
      return;
    }

    if (mobileInput.length !== 10) {
      setError('Please provide a valid 10-digit mobile number for fraud alerts.');
      return;
    }

    if (!consentGiven) {
      setError('Voluntary consent is required under UIDAI & DILRMP 3.0 regulations.');
      return;
    }

    try {
      setLoading(true);
      await landRecordsService.seedAadhaar(record._id, cleanAadhaar, mobileInput, consentGiven);
      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to seed Aadhaar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bhu-Aadhaar Citizen Seeding (DILRMP 3.0)"
      description={`Parcel Survey No: ${record.surveyNumber} • Bhu-Aadhaar ULPIN: ${record.ulpin || '81LVQLD9407JH0'}`}
    >
      {isDone ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Aadhaar Successfully Seeded</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your land parcel has been securely linked to your masked Aadhaar identifier. Automated SMS fraud alerts are now active for any mutation, mortgage, or transaction attempts.
          </p>
          <div className="pt-3">
            <Button variant="primary" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              <strong>Fraud Protection Alert:</strong> DILRMP 3.0 provisions consent-based voluntary Aadhaar and contact seeding. By linking your record, unauthorized sale deeds or fraudulent mutation attempts will trigger instant SMS verification warnings.
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              12-Digit Aadhaar Number (UIDAI)
            </label>
            <div className="relative">
              <input
                type="text"
                value={aadhaarInput}
                onChange={handleAadhaarChange}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tracking-wider focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                maxLength={14}
                required
              />
              <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Only the masked format (XXXX-XXXX-1234) will be stored in compliance with Aadhaar Act 2016.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Registered Mobile Number (for Instant SMS Fraud Alerts)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={mobileInput}
                onChange={handleMobileChange}
                placeholder="9876543210"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 font-mono text-sm tracking-wider focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                maxLength={10}
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-700 leading-normal">
                I hereby grant voluntary consent to link my Aadhaar identifier and mobile number to this land record (ULPIN: {record.ulpin || '81LVQLD9407JH0'}) under DILRMP 3.0 Guidelines for fraud alert notifications, mutation status updates, and digital land title verification.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || !consentGiven}>
              {loading ? 'Seeding...' : 'Confirm & Seed Bhu-Aadhaar'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
