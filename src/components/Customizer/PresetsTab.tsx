import React from 'react';
import { VISUAL_PRESETS } from '../../utils/presets';
import type { QRStyleOptions } from '../../types/qr';
import { Sparkles, Check } from 'lucide-react';

interface PresetsTabProps {
  currentStyle: QRStyleOptions;
  onApplyPreset: (presetStyle: Partial<QRStyleOptions>) => void;
}

export const PresetsTab: React.FC<PresetsTabProps> = ({ currentStyle, onApplyPreset }) => {
  return (
    <div className="tab-pane-content">
      <div className="input-group">
        <label className="field-label">
          <Sparkles size={15} /> Curated Design Presets
        </label>
        <span className="helper-text mb-3">
          Select a visual theme to transform your QR code look immediately. All data will be preserved.
        </span>

        <div className="preset-cards-grid">
          {VISUAL_PRESETS.map(preset => {
            const isMatch =
              preset.style.foregroundColor === currentStyle.foregroundColor &&
              preset.style.backgroundColor === currentStyle.backgroundColor &&
              preset.style.dotsType === currentStyle.dotsType;

            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-card ${isMatch ? 'active' : ''}`}
                onClick={() => onApplyPreset(preset.style)}
              >
                <div className="preset-card-top">
                  <span className={`preset-badge badge-${preset.category}`}>
                    {preset.previewBadge}
                  </span>
                  {isMatch && <Check size={16} className="active-check-icon" />}
                </div>

                <div
                  className="preset-mini-preview"
                  style={{
                    background: preset.style.isTransparentBg
                      ? '#FFFFFF'
                      : preset.style.backgroundColor,
                  }}
                >
                  <div
                    className="preset-mini-dots"
                    style={{
                      background: preset.style.gradient?.type === 'linear'
                        ? `linear-gradient(135deg, ${preset.style.gradient.color1}, ${preset.style.gradient.color2})`
                        : preset.style.foregroundColor,
                    }}
                  />
                </div>

                <div className="preset-card-body">
                  <h4 className="preset-title">{preset.name}</h4>
                  <p className="preset-desc">{preset.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
