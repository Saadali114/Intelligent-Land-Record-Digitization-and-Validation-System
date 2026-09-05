import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentRecord } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate, formatFileSize } from '../../lib/utils';
import { DocumentScanViewer } from './DocumentScanViewer';
import { CadastralRecordView } from './CadastralRecordView';
import { Sparkles } from 'lucide-react';

interface DocumentInspectionModalProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRunExtraction: (id: string) => void;
  isExtracting: boolean;
}

export const DocumentInspectionModal: React.FC<DocumentInspectionModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onRunExtraction,
  isExtracting,
}) => {
  const { t } = useTranslation();
  const [imageZoom, setImageZoom] = useState(1);

  if (!doc) return null;

  const handleClose = () => {
    setImageZoom(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('officerDocuments.inspectionModalTitle', { defaultValue: 'Cadastral Dual-Pane Inspection' })}
      description={`Record ID: ${doc.documentId} • ${doc.originalName}`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Top Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t('officerDocuments.chooseType', { defaultValue: 'File Type' })}
            </span>
            <div className="font-semibold text-slate-800 truncate">{doc.fileType}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t('officerDocuments.chooseLanguage', { defaultValue: 'Language' })}
            </span>
            <div className="font-semibold text-slate-800">{doc.language}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t('common.size', { defaultValue: 'File Size' })}
            </span>
            <div className="font-semibold text-slate-800">{formatFileSize(doc.fileSize)}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t('status.uploaded', { defaultValue: 'Uploaded' })}
            </span>
            <div className="font-semibold text-slate-800">{formatDate(doc.uploadedAt)}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              {t('officerProfile.accountStatus', { defaultValue: 'Status' })}
            </span>
            <div className="mt-0.5">
              <Badge status={doc.processingStatus} />
            </div>
          </div>
        </div>

        {/* Main Dual-Pane Section: Scan Viewer (Left) + Digital Record (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <DocumentScanViewer
            document={doc}
            imageZoom={imageZoom}
            onZoomChange={setImageZoom}
          />
          <CadastralRecordView
            document={doc}
            onRunExtraction={onRunExtraction}
            isExtracting={isExtracting}
          />
        </div>

        {/* Bottom Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRunExtraction(doc._id)}
            isLoading={isExtracting}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            {t('officerDocuments.runOcr', { defaultValue: 'Re-run AI Extraction' })}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClose}>
            {t('common.close', { defaultValue: 'Close' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
