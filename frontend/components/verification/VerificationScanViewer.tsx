import React from 'react';
import { DocumentRecord } from '../../types';
import { getBackendFileUrl } from '../../lib/cadastral-utils';
import { FileText, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';

interface VerificationScanViewerProps {
  sourceDocument?: DocumentRecord | string | null;
  scanZoom: number;
  onZoomChange: (newZoom: number | ((prev: number) => number)) => void;
  showScanPreview: boolean;
  onToggleScanPreview: () => void;
}

export const VerificationScanViewer: React.FC<VerificationScanViewerProps> = ({
  sourceDocument,
  scanZoom,
  onZoomChange,
  showScanPreview,
  onToggleScanPreview,
}) => {
  const doc = typeof sourceDocument === 'object' ? sourceDocument : null;
  const fileUrl = getBackendFileUrl(doc);

  return (
    <div className="gov-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-900" />
          Original Document Scan
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleScanPreview}
            className="text-xs text-blue-900 hover:underline font-semibold"
          >
            {showScanPreview ? 'Hide Scan' : 'Show Scan'}
          </button>

          {showScanPreview && fileUrl && (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={() => onZoomChange((z) => Math.max(0.6, z - 0.2))}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-500 w-9 text-center">
                {(scanZoom * 100).toFixed(0)}%
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
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {showScanPreview && (
        <div className="rounded-xl border border-slate-300 bg-slate-900/95 min-h-[360px] max-h-[480px] overflow-auto p-3 flex items-center justify-center relative shadow-inner">
          {fileUrl ? (
            <div className="flex items-center justify-center min-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt="Original archival document scan"
                style={{
                  transform: `scale(${scanZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full rounded shadow-xl object-contain cursor-grab"
              />
            </div>
          ) : (
            <div className="text-slate-400 text-xs text-center p-8">
              No archival scan image attached to this digital record.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
