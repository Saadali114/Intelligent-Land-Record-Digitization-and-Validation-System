import React from 'react';
import { VerificationAction } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface VerificationActionModalProps {
  action: VerificationAction | null;
  onClose: () => void;
  onExecute: () => Promise<void>;
  isSubmitting: boolean;
  remarks: string;
  onRemarksChange: (remarks: string) => void;
  correctedData: Record<string, string>;
  onCorrectedDataChange: (data: Record<string, string>) => void;
}

export const VerificationActionModal: React.FC<VerificationActionModalProps> = ({
  action,
  onClose,
  onExecute,
  isSubmitting,
  remarks,
  onRemarksChange,
  correctedData,
  onCorrectedDataChange,
}) => {
  if (!action) return null;

  const handleFieldChange = (key: string, value: string) => {
    onCorrectedDataChange({
      ...correctedData,
      [key]: value,
    });
  };

  return (
    <Modal
      isOpen={Boolean(action)}
      onClose={onClose}
      title={`Confirm Action: ${action}`}
      description="Official verification requires mandatory inspection remarks."
    >
      <div className="space-y-4 text-xs">
        {action === 'CORRECTED' && (
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block">Edit Extracted Cadastral Values:</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={correctedData.ownerName || ''}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Survey Number
                </label>
                <input
                  type="text"
                  value={correctedData.surveyNumber || ''}
                  onChange={(e) => handleFieldChange('surveyNumber', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Khasra Number
                </label>
                <input
                  type="text"
                  value={correctedData.khasraNumber || ''}
                  onChange={(e) => handleFieldChange('khasraNumber', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Khata Number
                </label>
                <input
                  type="text"
                  value={correctedData.khataNumber || ''}
                  onChange={(e) => handleFieldChange('khataNumber', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Plot Area
                </label>
                <input
                  type="text"
                  value={correctedData.plotArea || ''}
                  onChange={(e) => handleFieldChange('plotArea', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Village
                </label>
                <input
                  type="text"
                  value={correctedData.village || ''}
                  onChange={(e) => handleFieldChange('village', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Tehsil
                </label>
                <input
                  type="text"
                  value={correctedData.tehsil || ''}
                  onChange={(e) => handleFieldChange('tehsil', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  District
                </label>
                <input
                  type="text"
                  value={correctedData.district || ''}
                  onChange={(e) => handleFieldChange('district', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mandatory Inspector Remarks <span className="text-rose-600">*</span>
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            placeholder="Document verified against original physical revenue registry copy..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onExecute} isLoading={isSubmitting}>
            Submit Verification
          </Button>
        </div>
      </div>
    </Modal>
  );
};
