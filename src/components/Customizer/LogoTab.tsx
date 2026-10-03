import React from 'react';
import type { QRStyleOptions } from '../../types/qr';
import { Image, Upload, Trash2, Globe, Mail, Wifi, Phone, Github, MessageCircle, Star } from 'lucide-react';

interface LogoTabProps {
  style: QRStyleOptions;
  onChange: (updated: Partial<QRStyleOptions>) => void;
}

// Built-in vector SVG Data URIs for crisp logos
const createSvgDataUrl = (svgContent: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

const PRESET_LOGOS = [
  {
    id: 'web',
    name: 'Website',
    icon: Globe,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`),
  },
  {
    id: 'mail',
    name: 'Email',
    icon: Mail,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#EA4335" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    icon: Wifi,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/></svg>`),
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`),
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#0F172A"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.887-9.885 9.887m0-18.067C6.065 3.718 1.155 8.627 1.153 14.717c0 2.41.776 4.764 2.247 6.708l-2.387 8.72 8.922-2.34a10.957 10.957 0 005.217 1.321h.005c6.088 0 10.999-4.909 11.002-11c0-2.937-1.144-5.698-3.223-7.778-2.079-2.079-4.84-3.224-7.781-3.224"/></svg>`),
  },
  {
    id: 'star',
    name: 'Star',
    icon: Star,
    url: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`),
  },
];

export const LogoTab: React.FC<LogoTabProps> = ({ style, onChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange({
          logoUrl: dataUrl,
          errorCorrectionLevel: style.errorCorrectionLevel === 'L' ? 'Q' : style.errorCorrectionLevel,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChange({ logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tab-pane-content">
      <div className="input-group">
        <label className="field-label">
          <Image size={15} /> Preset Logos
        </label>
        <div className="preset-logo-grid">
          {PRESET_LOGOS.map(logo => {
            const Icon = logo.icon;
            const isSelected = style.logoUrl === logo.url;
            return (
              <button
                key={logo.id}
                type="button"
                className={`preset-logo-btn ${isSelected ? 'active' : ''}`}
                onClick={() =>
                  onChange({
                    logoUrl: isSelected ? undefined : logo.url,
                    errorCorrectionLevel: style.errorCorrectionLevel === 'L' ? 'Q' : style.errorCorrectionLevel,
                  })
                }
                title={logo.name}
              >
                <Icon size={20} />
                <span className="logo-btn-label">{logo.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="divider" />

      {/* Custom Upload */}
      <div className="input-group">
        <label className="field-label">Upload Custom Image / Logo</label>
        <div className="upload-box">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="file-input-hidden"
            onChange={handleFileUpload}
            id="custom-logo-upload"
          />
          <label htmlFor="custom-logo-upload" className="upload-dropzone">
            <Upload size={24} className="upload-icon" />
            <span className="upload-title">Choose image file</span>
            <span className="upload-subtitle">PNG, SVG, JPG, WebP up to 5MB</span>
          </label>
        </div>

        {style.logoUrl && (
          <div className="active-logo-preview">
            <div className="logo-img-wrapper">
              <img src={style.logoUrl} alt="Active Logo" />
            </div>
            <span className="active-logo-text">Logo active</span>
            <button type="button" className="remove-logo-btn" onClick={removeLogo} title="Remove logo">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {style.logoUrl && (
        <>
          <hr className="divider" />

          {/* Logo Options */}
          <div className="input-group">
            <div className="slider-header">
              <label className="field-label">Logo Size Scale</label>
              <span className="slider-value">{Math.round(style.logoSize * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.35}
              step={0.02}
              className="range-slider"
              value={style.logoSize}
              onChange={e => onChange({ logoSize: parseFloat(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <div className="slider-header">
              <label className="field-label">Logo Border Margin</label>
              <span className="slider-value">{style.logoMargin}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              className="range-slider"
              value={style.logoMargin}
              onChange={e => onChange({ logoMargin: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className="checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={style.hideDotsBehindLogo}
                onChange={e => onChange({ hideDotsBehindLogo: e.target.checked })}
              />
              <span>Clear QR modules behind logo</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};
