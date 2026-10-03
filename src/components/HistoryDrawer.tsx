import React from 'react';
import type { HistoryItem } from '../types/qr';
import { X, Trash2, RotateCcw, Copy, Check, Clock, QrCode } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onDelete,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-box">
            <Clock size={20} />
            <h3>Recent QR Codes</h3>
            <span className="drawer-count">{history.length}</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="drawer-empty-state">
            <QrCode size={48} className="empty-icon" />
            <p className="empty-title">No history yet</p>
            <p className="empty-subtitle">
              Generated QR codes will automatically save here so you can reuse or export them anytime.
            </p>
          </div>
        ) : (
          <>
            <div className="drawer-body-list">
              {history.map(item => (
                <div key={item.id} className="history-card">
                  <div className="history-card-left">
                    {item.previewDataUrl ? (
                      <img src={item.previewDataUrl} alt={item.title} className="history-thumb" />
                    ) : (
                      <div className="history-thumb-placeholder">
                        <QrCode size={24} />
                      </div>
                    )}
                  </div>

                  <div className="history-card-info">
                    <div className="history-title-row">
                      <span className="history-title">{item.title}</span>
                      <span className={`type-tag tag-${item.type}`}>{item.type.toUpperCase()}</span>
                    </div>
                    <p className="history-payload">{item.rawPayload}</p>
                    <span className="history-date">{formatDate(item.timestamp)}</span>
                  </div>

                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="history-action-btn restore-btn"
                      onClick={() => {
                        onRestore(item);
                        onClose();
                      }}
                      title="Load style and data into generator"
                    >
                      <RotateCcw size={16} />
                      <span>Use</span>
                    </button>

                    <button
                      type="button"
                      className="history-action-btn icon-only-btn"
                      onClick={() => handleCopy(item.id, item.rawPayload)}
                      title="Copy payload"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    </button>

                    <button
                      type="button"
                      className="history-action-btn icon-only-btn delete-btn"
                      onClick={() => onDelete(item.id)}
                      title="Delete from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <button type="button" className="clear-all-btn" onClick={onClearAll}>
                <Trash2 size={16} />
                <span>Clear All History</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
