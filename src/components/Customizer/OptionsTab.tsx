import React from 'react';
import type { QRStyleOptions, ErrorCorrectionLevel } from '../../types/qr';
import { Maximize2, Shield, Layout } from 'lucide-react';

interface OptionsTabProps {
  style: QRStyleOptions;
  onChange: (updated: Partial<QRStyleOptions>) => void;
}

const ECL_OPTIONS: { level: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { level: 'L', label: 'L - Low', desc: '7% data recovery (small file, clean print)' },
  { level: 'M', label: 'M - Medium', desc: '15% data recovery (balanced default)' },
  { level: 'Q', label: 'Q - Quartile', desc: '25% data recovery (recommended with small logo)' },
  { level: 'H', label: 'H - High', desc: '30% data recovery (maximum reliability & custom logo)' },
];

export const OptionsTab: React.FC<OptionsTabProps> = ({ style, onChange }) => {
  return (
    <div className="tab-pane-content">
      {/* Canvas Display Size */}
      <div className="input-group">
        <div className="slider-header">
          <label className="field-label">
            <Maximize2 size={15} /> Render Resolution / Size
          </label>
          <span className="slider-value">{style.size} x {style.size} px</span>
        </div>
        <input
          type="range"
          min={200}
          max={800}
          step={20}
          className="range-slider"
          value={style.size}
          onChange={e => onChange({ size: parseInt(e.target.value, 10) })}
        />
      </div>

      <hr className="divider" />

      {/* Margin / Quiet Zone */}
      <div className="input-group">
        <div className="slider-header">
          <label className="field-label">
            <Layout size={15} /> Quiet Zone (Outer Padding)
          </label>
          <span className="slider-value">{style.margin} modules</span>
        </div>
        <input
          type="range"
          min={0}
          max={6}
          step={1}
          className="range-slider"
          value={style.margin}
          onChange={e => onChange({ margin: parseInt(e.target.value, 10) })}
        />
        <span className="helper-text">Standard scanners perform best with at least 1-2 modules of quiet zone.</span>
      </div>

      <hr className="divider" />

      {/* Error Correction Level */}
      <div className="input-group">
        <label className="field-label">
          <Shield size={15} /> Error Correction Level (ECL)
        </label>
        <div className="ecl-grid">
          {ECL_OPTIONS.map(opt => {
            const isSelected = style.errorCorrectionLevel === opt.level;
            return (
              <button
                key={opt.level}
                type="button"
                className={`ecl-card ${isSelected ? 'active' : ''}`}
                onClick={() => onChange({ errorCorrectionLevel: opt.level })}
              >
                <div className="ecl-header">
                  <span className="ecl-title">{opt.label}</span>
                </div>
                <span className="ecl-desc">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
