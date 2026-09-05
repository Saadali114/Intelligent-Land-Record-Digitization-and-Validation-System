import React from 'react';
import { DocumentRecord } from '../../types';
import { getBackendFileUrl } from '../../lib/cadastral-utils';
import { FileText, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';

interface DocumentScanViewerProps {
  document: DocumentRecord;
  imageZoom: number;
  onZoomChange: (newZoom: number | ((prev: number) => number)) => void;
}

export const DocumentScanViewer: React.FC<DocumentScanViewerProps> = ({
  document: doc,
  imageZoom,
  onZoomChange,
}) => {
  const fileUrl = getBackendFileUrl(doc);
  const isImage =
    doc.mimeType?.startsWith('image/') ||
    Boolean(doc.fileName?.match(/\.(jpg|jpeg|png|webp|tiff)$/i));

  return (
    <div className="lg:col-span-6 flex flex-col space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-900" />
          Original Archival Scan
        </span>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls for images */}
          <button
            type="button"
            onClick={() => onZoomChange((z) => Math.max(0.6, z - 0.2))}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-500 w-9 text-center">
            {(imageZoom * 100).toFixed(0)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange((z) => Math.min(3.0, z + 0.2))}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1 text-blue-800 hover:bg-blue-50 rounded ml-1 transition-colors"
            title="Open full resolution file in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-slate-300 bg-slate-900/95 min-h-[460px] max-h-[560px] overflow-auto p-3 flex items-center justify-center relative shadow-inner">
        {isImage ? (
          <div className="flex items-center justify-center min-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={doc.originalName}
              style={{
                transform: `scale(${imageZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="max-w-full rounded shadow-xl object-contain cursor-grab"
            />
          </div>
        ) : (
          <iframe
            src={fileUrl}
            className="w-full h-[520px] rounded-lg bg-white border-0"
            title="Archival Document Scan PDF"
          />
        )}
      </div>
      <div className="text-[10px] text-slate-400 text-right pr-1">
        File: {doc.fileName}
      </div>
    </div>
  );
};
