import React from 'react';
import type { ReliabilityResult } from '../types/qr';
import { ShieldCheck, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ScanReliabilityMeterProps {
  reliability: ReliabilityResult;
}

export const ScanReliabilityMeter: React.FC<ScanReliabilityMeterProps> = ({ reliability }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusBadge = () => {
    switch (reliability.status) {
      case 'excellent':
        return { label: '100% Scannable', className: 'status-excellent' };
      case 'good':
        return { label: 'Good Readability', className: 'status-good' };
      case 'warning':
        return { label: 'Scan Risks Detected', className: 'status-warning' };
      case 'critical':
        return { label: 'Poor Readability', className: 'status-critical' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className={`reliability-card ${reliability.status}`}>
      <div className="reliability-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="reliability-left">
          <div className="status-icon-wrapper">
            {reliability.status === 'excellent' || reliability.status === 'good' ? (
              <ShieldCheck size={22} className="icon-success" />
            ) : (
              <AlertTriangle size={22} className="icon-warning" />
            )}
          </div>
          <div className="reliability-titles">
            <div className="reliability-headline">
              <span className="score-number">{reliability.score}%</span>
              <span className="score-label">Scan Reliability</span>
              <span className={`status-pill ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>
            <div className="contrast-subtext">
              Contrast Ratio: <strong>{reliability.contrastRatio}:1</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="toggle-expand-btn"
          title="Toggle scan details"
          aria-label="Toggle details"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Health Meter Bar */}
      <div className="meter-track">
        <div
          className={`meter-fill meter-fill-${reliability.status}`}
          style={{ width: `${reliability.score}%` }}
        />
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="reliability-details-pane">
          {reliability.warnings.length > 0 && (
            <div className="details-section warnings-section">
              <h5 className="details-heading text-warning">
                <AlertTriangle size={14} /> Warnings & Readability Risks
              </h5>
              <ul className="details-list">
                {reliability.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {reliability.tips.length > 0 && (
            <div className="details-section tips-section">
              <h5 className="details-heading text-info">
                <Info size={14} /> Optimization Tips
              </h5>
              <ul className="details-list">
                {reliability.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
