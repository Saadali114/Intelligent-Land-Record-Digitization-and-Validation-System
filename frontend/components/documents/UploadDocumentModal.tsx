import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UploadCloud } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
  isUploading: boolean;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('Marathi');
  const [fileType, setFileType] = useState('7/12 Extract');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a document file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('fileType', fileType);

    await onUpload(formData);
    setFile(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('officerDocuments.uploadModalTitle', { defaultValue: 'Ingest Land Document' })}
      description={t('officerDocuments.uploadModalDesc', { defaultValue: 'Upload historical scan or PDF into the registry pipeline.' })}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-700 transition-colors bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <div className="text-xs font-semibold text-slate-700 mb-1">
            {file ? file.name : t('officerDocuments.selectOrDrag', { defaultValue: 'Select or drag document to upload' })}
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            {t('officerDocuments.supportedFormats', { defaultValue: 'Supports PDF, JPEG, PNG, WEBP, TIFF (Max 25MB)' })}
          </p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('officerDocuments.chooseLanguage', { defaultValue: 'Document Language' })}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900"
            >
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="English">English</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('officerDocuments.chooseType', { defaultValue: 'Record Category' })}
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900"
            >
              <option value="7/12 Extract (Satbara)">7/12 Extract (Satbara)</option>
              <option value="Sale Deed (Kharidi Khat)">Sale Deed (Kharidi Khat)</option>
              <option value="Mutation Register (Ferfar)">Mutation Register (Ferfar)</option>
              <option value="Property Card (Milkat Patra)">Property Card (Milkat Patra)</option>
              <option value="Survey Map (Tippan)">Survey Map (Tippan)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button type="submit" isLoading={isUploading}>
            {t('officerDocuments.uploadButton', { defaultValue: 'Ingest Document' })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
