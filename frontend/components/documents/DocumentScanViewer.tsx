import React, { useState, useEffect } from 'react';
import { DocumentRecord } from '../../types';
import { getBackendFileUrl } from '../../lib/cadastral-utils';
import { FileText, ZoomIn, ZoomOut, RotateCcw, ExternalLink, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

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
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fileUrl = getBackendFileUrl(doc);
  const isImage =
    doc.mimeType?.startsWith('image/') ||
    Boolean(doc.fileName?.match(/\.(jpg|jpeg|png|webp|tiff)$/i));

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [fileUrl, reloadKey]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="lg:col-span-6 flex flex-col space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-900" />
          Original Archival Scan
        </span>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls for images */}
          {isImage && !hasError && (
            <>
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
            </>
          )}

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-blue-800 hover:bg-blue-50 rounded ml-1 transition-colors"
              title="Open full resolution file in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-300 bg-slate-900/95 min-h-[460px] max-h-[560px] overflow-auto p-3 flex items-center justify-center relative shadow-inner">
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-xs z-10 text-slate-300 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-medium">Loading document scan...</span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300 max-w-sm space-y-3">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Document Scan File Not Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                The archival file could not be fetched from server storage. The file may have been uploaded on a different instance or storage reset.
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50 break-all">
                {doc.fileName || doc.originalName}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Loading
              </button>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Direct Link
                </a>
              )}
            </div>
          </div>
        ) : isImage ? (
          <div className="flex items-center justify-center min-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${fileUrl}-${reloadKey}`}
              src={fileUrl}
              alt={doc.originalName}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              style={{
                transform: `scale(${imageZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                display: isLoading ? 'none' : 'block',
              }}
              className="max-w-full rounded shadow-xl object-contain cursor-grab"
            />
          </div>
        ) : (
          <iframe
            key={`${fileUrl}-${reloadKey}`}
            src={fileUrl}
            className="w-full h-[520px] rounded-lg bg-white border-0"
            title="Archival Document Scan PDF"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>
      <div className="text-[10px] text-slate-400 text-right pr-1">
        File: {doc.fileName}
      </div>
    </div>
  );
};
