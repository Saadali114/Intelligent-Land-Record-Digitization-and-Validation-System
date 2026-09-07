import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { DocumentRecord } from '../../types';
import { documentsService } from '../../services/documents.service';
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
  document: initialDoc,
  isOpen,
  onClose,
  onRunExtraction,
  isExtracting,
}) => {
  const { t } = useTranslation();
  const [imageZoom, setImageZoom] = useState(1);

  // Live query for the document to keep inspection modal automatically updated
  const { data: freshDoc } = useQuery({
    queryKey: ['documents', 'detail', initialDoc?._id],
    queryFn: () => documentsService.getDocumentById(initialDoc!._id),
    enabled: isOpen && !!initialDoc?._id,
    refetchInterval: (query) => {
      // Auto-poll if landRecord not yet available or extraction in progress
      if (isExtracting) return 1500;
      if (query.state.data?.landRecord) return false;
      return 2000;
    },
    initialData: initialDoc || undefined,
  });

  const doc = freshDoc || initialDoc;

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
      description={`${doc.documentId} • ${doc.language || 'Marathi'} (${doc.fileType}) • Uploaded ${formatDate(doc.uploadedAt)}`}
      maxWidth="6xl"
    >
      <div className="space-y-4">
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
