import React from 'react';
import type { QRStyleOptions, DotType, CornerSquareType, CornerDotType } from '../../types/qr';
import { Grid, Eye, CircleDot } from 'lucide-react';

interface PatternsTabProps {
  style: QRStyleOptions;
  onChange: (updated: Partial<QRStyleOptions>) => void;
}

const DOT_STYLES: { id: DotType; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'extra-rounded', label: 'Soft Round' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Smooth' },
];

const CORNER_SQUARE_STYLES: { id: CornerSquareType; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'extra-rounded', label: 'Rounded' },
  { id: 'dot', label: 'Circle' },
  { id: 'classy', label: 'Classy' },
];

const CORNER_DOT_STYLES: { id: CornerDotType; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot / Circle' },
];

export const PatternsTab: React.FC<PatternsTabProps> = ({ style, onChange }) => {
  return (
    <div className="tab-pane-content">
      {/* Module / Body Dots */}
      <div className="input-group">
        <label className="field-label">
          <Grid size={15} /> Body Pattern Style
        </label>
        <div className="pattern-grid">
          {DOT_STYLES.map(dot => (
            <button
              key={dot.id}
              type="button"
              className={`pattern-card ${style.dotsType === dot.id ? 'active' : ''}`}
              onClick={() => onChange({ dotsType: dot.id })}
            >
              <span className="pattern-name">{dot.label}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Eye Outer Frame */}
      <div className="input-group">
        <label className="field-label">
          <Eye size={15} /> Corner Frame (Eye Outer)
        </label>
        <div className="pattern-grid cols-4">
          {CORNER_SQUARE_STYLES.map(corner => (
            <button
              key={corner.id}
              type="button"
              className={`pattern-card ${style.cornerSquareType === corner.id ? 'active' : ''}`}
              onClick={() => onChange({ cornerSquareType: corner.id })}
            >
              <span className="pattern-name">{corner.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eye Inner Center */}
      <div className="input-group">
        <label className="field-label">
          <CircleDot size={15} /> Corner Center (Eye Inner)
        </label>
        <div className="pattern-grid cols-2">
          {CORNER_DOT_STYLES.map(dot => (
            <button
              key={dot.id}
              type="button"
              className={`pattern-card ${style.cornerDotType === dot.id ? 'active' : ''}`}
              onClick={() => onChange({ cornerDotType: dot.id })}
            >
              <span className="pattern-name">{dot.label}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Custom Corner Eye Colors */}
      <div className="input-group">
        <label className="field-label">Eye Color Overrides</label>
        <div className="checkbox-field mb-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={style.useCustomCornerColors}
              onChange={e =>
                onChange({
                  useCustomCornerColors: e.target.checked,
                  cornerSquareColor: e.target.checked ? style.cornerSquareColor || style.foregroundColor : '',
                  cornerDotColor: e.target.checked ? style.cornerDotColor || style.foregroundColor : '',
                })
              }
            />
            <span>Use custom colors for Corner Eyes</span>
          </label>
        </div>

        {style.useCustomCornerColors && (
          <div className="grid-2col">
            <div className="input-group">
              <label className="field-label">Frame Color</label>
              <div className="color-picker-box">
                <input
                  type="color"
                  className="color-swatch-input"
                  value={style.cornerSquareColor || style.foregroundColor}
                  onChange={e => onChange({ cornerSquareColor: e.target.value })}
                />
                <input
                  type="text"
                  className="hex-text-input"
                  value={style.cornerSquareColor || style.foregroundColor}
                  onChange={e => onChange({ cornerSquareColor: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="field-label">Center Dot Color</label>
              <div className="color-picker-box">
                <input
                  type="color"
                  className="color-swatch-input"
                  value={style.cornerDotColor || style.foregroundColor}
                  onChange={e => onChange({ cornerDotColor: e.target.value })}
                />
                <input
                  type="text"
                  className="hex-text-input"
                  value={style.cornerDotColor || style.foregroundColor}
                  onChange={e => onChange({ cornerDotColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
