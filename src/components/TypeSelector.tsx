import React from 'react';
import type { QRType } from '../types/qr';
import { Link2, FileText, Mail, Phone, Wifi, type LucideIcon } from 'lucide-react';

interface TypeSelectorProps {
  activeType: QRType;
  onSelectType: (type: QRType) => void;
}

const TYPES: { id: QRType; label: string; description: string; icon: LucideIcon }[] = [
  { id: 'url', label: 'Website URL', description: 'Websites, social profiles, links', icon: Link2 },
  { id: 'text', label: 'Plain Text', description: 'Notes, messages, raw text', icon: FileText },
  { id: 'email', label: 'Email', description: 'Recipient, subject, body', icon: Mail },
  { id: 'phone', label: 'Phone', description: 'Dial numbers directly', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi Network', description: 'Instant network connection', icon: Wifi },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ activeType, onSelectType }) => {
  return (
    <div className="type-selector-wrapper">
      <label className="section-label">Select Data Type</label>
      <div className="type-grid">
        {TYPES.map(type => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              className={`type-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectType(type.id)}
            >
              <div className="type-icon-box">
                <Icon size={20} />
              </div>
              <div className="type-info">
                <span className="type-name">{type.label}</span>
                <span className="type-desc">{type.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
