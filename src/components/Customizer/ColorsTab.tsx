import React from 'react';
import type { QRStyleOptions, GradientType } from '../../types/qr';
import { Sparkles } from 'lucide-react';

interface ColorsTabProps {
  style: QRStyleOptions;
  onChange: (updated: Partial<QRStyleOptions>) => void;
}

const PALETTES = [
  { label: 'Classic Black', fg: '#0F172A', bg: '#FFFFFF' },
  { label: 'Neon Cyber', fg: '#00F2FE', bg: '#0F172A', g2: '#4FACFE' },
  { label: 'Sunset Glow', fg: '#F97316', bg: '#FAF5FF', g2: '#EC4899' },
  { label: 'Emerald Gold', fg: '#059669', bg: '#064E3B', g2: '#F59E0B' },
  { label: 'Royal Amethyst', fg: '#818CF8', bg: '#1E1B4B', g2: '#C084FC' },
  { label: 'Midnight Blue', fg: '#38BDF8', bg: '#0B1329', g2: '#818CF8' },
];

export const ColorsTab: React.FC<ColorsTabProps> = ({ style, onChange }) => {
  const updateGradient = (key: string, value: any) => {
    onChange({
      gradient: {
        ...style.gradient,
        [key]: value,
      },
    });
  };

  const applyPalette = (p: typeof PALETTES[0]) => {
    if (p.g2) {
      onChange({
        foregroundColor: p.fg,
        backgroundColor: p.bg,
        isTransparentBg: false,
        gradient: {
          type: 'linear',
          color1: p.fg,
          color2: p.g2,
          rotation: 45,
        },
      });
    } else {
      onChange({
        foregroundColor: p.fg,
        backgroundColor: p.bg,
        isTransparentBg: false,
        gradient: {
          ...style.gradient,
          type: 'none',
          color1: p.fg,
        },
      });
    }
  };

  return (
    <div className="tab-pane-content">
      <div className="quick-palettes-section">
        <label className="field-label">
          <Sparkles size={15} /> Quick Color Schemes
        </label>
        <div className="palette-grid">
          {PALETTES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="palette-chip"
              onClick={() => applyPalette(p)}
              title={`Apply ${p.label}`}
            >
              <div
                className="palette-swatch"
                style={{
                  background: p.g2
                    ? `linear-gradient(135deg, ${p.fg}, ${p.g2})`
                    : p.fg,
                  borderColor: p.bg,
                }}
              />
              <span className="palette-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Fill Type */}
      <div className="input-group">
        <label className="field-label">Foreground Style</label>
        <div className="segmented-control">
          {(['none', 'linear', 'radial'] as GradientType[]).map(gType => (
            <button
              key={gType}
              type="button"
              className={`segmented-btn ${style.gradient.type === gType ? 'active' : ''}`}
              onClick={() => updateGradient('type', gType)}
            >
              {gType === 'none' ? 'Solid Color' : gType === 'linear' ? 'Linear Gradient' : 'Radial Gradient'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div className="grid-2col">
        <div className="input-group">
          <label className="field-label">
            {style.gradient.type !== 'none' ? 'Gradient Start Color' : 'Foreground Color'}
          </label>
          <div className="color-picker-box">
            <input
              type="color"
              className="color-swatch-input"
              value={style.gradient.type !== 'none' ? style.gradient.color1 : style.foregroundColor}
              onChange={e => {
                const hex = e.target.value;
                onChange({ foregroundColor: hex });
                updateGradient('color1', hex);
              }}
            />
            <input
              type="text"
              className="hex-text-input"
              value={style.gradient.type !== 'none' ? style.gradient.color1 : style.foregroundColor}
              onChange={e => {
                const hex = e.target.value;
                onChange({ foregroundColor: hex });
                updateGradient('color1', hex);
              }}
            />
          </div>
        </div>

        {style.gradient.type !== 'none' && (
          <div className="input-group">
            <label className="field-label">Gradient End Color</label>
            <div className="color-picker-box">
              <input
                type="color"
                className="color-swatch-input"
                value={style.gradient.color2}
                onChange={e => updateGradient('color2', e.target.value)}
              />
              <input
                type="text"
                className="hex-text-input"
                value={style.gradient.color2}
                onChange={e => updateGradient('color2', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {style.gradient.type === 'linear' && (
        <div className="input-group">
          <div className="slider-header">
            <label className="field-label">Gradient Angle</label>
            <span className="slider-value">{style.gradient.rotation}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            className="range-slider"
            value={style.gradient.rotation}
            onChange={e => updateGradient('rotation', parseInt(e.target.value, 10))}
          />
        </div>
      )}

      <hr className="divider" />

      {/* Background Section */}
      <div className="input-group">
        <label className="field-label">Background Settings</label>
        <div className="checkbox-field mb-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={style.isTransparentBg}
              onChange={e => onChange({ isTransparentBg: e.target.checked })}
            />
            <span>Transparent Background (PNG/SVG export only)</span>
          </label>
        </div>

        {!style.isTransparentBg && (
          <div className="color-picker-box">
            <input
              type="color"
              className="color-swatch-input"
              value={style.backgroundColor}
              onChange={e => onChange({ backgroundColor: e.target.value })}
            />
            <input
              type="text"
              className="hex-text-input"
              value={style.backgroundColor}
              onChange={e => onChange({ backgroundColor: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
