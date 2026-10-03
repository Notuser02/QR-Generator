import React from 'react';
import type { QRType, QRFormData, URLFormData, TextFormData, EmailFormData, PhoneFormData, WifiFormData } from '../types/qr';
import { AlertCircle, Eye, EyeOff, Lock, Globe, Mail, Phone, Wifi, FileText } from 'lucide-react';

interface FormInputsProps {
  type: QRType;
  formData: QRFormData;
  onChange: (updated: QRFormData) => void;
  errors: Record<string, string>;
}

export const FormInputs: React.FC<FormInputsProps> = ({ type, formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const updateField = (field: string, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="form-inputs-container">
      {type === 'url' && (
        <div className="input-group">
          <label htmlFor="input-url" className="field-label">
            <Globe size={16} /> Destination Website URL
          </label>
          <div className="input-with-icon">
            <input
              id="input-url"
              type="text"
              className={`text-input ${errors.url ? 'has-error' : ''}`}
              placeholder="e.g. https://yourwebsite.com/landing"
              value={(formData as URLFormData).url || ''}
              onChange={e => updateField('url', e.target.value)}
            />
          </div>
          {errors.url ? (
            <span className="error-text">
              <AlertCircle size={14} /> {errors.url}
            </span>
          ) : (
            <span className="helper-text">Include http:// or https:// for direct web navigation</span>
          )}
        </div>
      )}

      {type === 'text' && (
        <div className="input-group">
          <label htmlFor="input-text" className="field-label">
            <FileText size={16} /> Content Text
          </label>
          <textarea
            id="input-text"
            className={`textarea-input ${errors.text ? 'has-error' : ''}`}
            rows={4}
            placeholder="Type or paste any text, discount codes, or notes here..."
            value={(formData as TextFormData).text || ''}
            onChange={e => updateField('text', e.target.value)}
          />
          <div className="field-footer">
            {errors.text ? (
              <span className="error-text">
                <AlertCircle size={14} /> {errors.text}
              </span>
            ) : (
              <span className="helper-text">Supports markdown snippets, plain sentences, or code keys</span>
            )}
            <span className="char-count">{((formData as TextFormData).text || '').length} chars</span>
          </div>
        </div>
      )}

      {type === 'email' && (
        <div className="input-fields-stack">
          <div className="input-group">
            <label htmlFor="input-email" className="field-label">
              <Mail size={16} /> Recipient Email Address *
            </label>
            <input
              id="input-email"
              type="email"
              className={`text-input ${errors.email ? 'has-error' : ''}`}
              placeholder="contact@company.com"
              value={(formData as EmailFormData).email || ''}
              onChange={e => updateField('email', e.target.value)}
            />
            {errors.email && (
              <span className="error-text">
                <AlertCircle size={14} /> {errors.email}
              </span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="input-subject" className="field-label">
              Subject (Optional)
            </label>
            <input
              id="input-subject"
              type="text"
              className="text-input"
              placeholder="e.g. Special Offer Inquiry"
              value={(formData as EmailFormData).subject || ''}
              onChange={e => updateField('subject', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="input-body" className="field-label">
              Message Body (Optional)
            </label>
            <textarea
              id="input-body"
              className="textarea-input"
              rows={3}
              placeholder="Pre-filled email body content..."
              value={(formData as EmailFormData).body || ''}
              onChange={e => updateField('body', e.target.value)}
            />
          </div>
        </div>
      )}

      {type === 'phone' && (
        <div className="input-group">
          <label htmlFor="input-phone" className="field-label">
            <Phone size={16} /> Phone Number *
          </label>
          <input
            id="input-phone"
            type="tel"
            className={`text-input ${errors.phone ? 'has-error' : ''}`}
            placeholder="e.g. +1 (555) 234-5678"
            value={(formData as PhoneFormData).phone || ''}
            onChange={e => updateField('phone', e.target.value)}
          />
          {errors.phone ? (
            <span className="error-text">
              <AlertCircle size={14} /> {errors.phone}
            </span>
          ) : (
            <span className="helper-text">Scanning will prompt users to dial this phone number directly</span>
          )}
        </div>
      )}

      {type === 'wifi' && (
        <div className="input-fields-stack">
          <div className="input-group">
            <label htmlFor="input-ssid" className="field-label">
              <Wifi size={16} /> Network Name (SSID) *
            </label>
            <input
              id="input-ssid"
              type="text"
              className={`text-input ${errors.ssid ? 'has-error' : ''}`}
              placeholder="e.g. Home_WiFi_5G"
              value={(formData as WifiFormData).ssid || ''}
              onChange={e => updateField('ssid', e.target.value)}
            />
            {errors.ssid && (
              <span className="error-text">
                <AlertCircle size={14} /> {errors.ssid}
              </span>
            )}
          </div>

          <div className="grid-2col">
            <div className="input-group">
              <label htmlFor="input-encryption" className="field-label">
                <Lock size={16} /> Security Type
              </label>
              <select
                id="input-encryption"
                className="select-input"
                value={(formData as WifiFormData).encryption || 'WPA'}
                onChange={e => updateField('encryption', e.target.value)}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            {(formData as WifiFormData).encryption !== 'nopass' && (
              <div className="input-group">
                <label htmlFor="input-password" className="field-label">
                  Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`text-input ${errors.password ? 'has-error' : ''}`}
                    placeholder="Enter network password"
                    value={(formData as WifiFormData).password || ''}
                    onChange={e => updateField('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text">
                    <AlertCircle size={14} /> {errors.password}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={(formData as WifiFormData).hidden || false}
                onChange={e => updateField('hidden', e.target.checked)}
              />
              <span>This is a hidden network</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
