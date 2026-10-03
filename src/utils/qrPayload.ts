import type { QRType, QRFormData, URLFormData, TextFormData, EmailFormData, PhoneFormData, WifiFormData } from '../types/qr';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function generateQRPayload(type: QRType, data: QRFormData): string {
  switch (type) {
    case 'url': {
      const urlData = data as URLFormData;
      let url = (urlData.url || '').trim();
      if (!url) return '';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }
    case 'text': {
      const textData = data as TextFormData;
      return textData.text || '';
    }
    case 'email': {
      const emailData = data as EmailFormData;
      const email = (emailData.email || '').trim();
      if (!email) return '';
      const params: string[] = [];
      if (emailData.subject) {
        params.push(`subject=${encodeURIComponent(emailData.subject)}`);
      }
      if (emailData.body) {
        params.push(`body=${encodeURIComponent(emailData.body)}`);
      }
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${email}${queryString}`;
    }
    case 'phone': {
      const phoneData = data as PhoneFormData;
      const phone = (phoneData.phone || '').trim();
      if (!phone) return '';
      return `tel:${phone.replace(/\s+/g, '')}`;
    }
    case 'wifi': {
      const wifiData = data as WifiFormData;
      const ssid = escapeWifiString(wifiData.ssid || '');
      if (!ssid) return '';
      const encryption = wifiData.encryption || 'WPA';
      const password = escapeWifiString(wifiData.password || '');
      const hidden = wifiData.hidden ? 'true' : 'false';
      
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
    }
    default:
      return '';
  }
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1');
}

export function validateQRInput(type: QRType, data: QRFormData): ValidationResult {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const urlData = data as URLFormData;
      const val = (urlData.url || '').trim();
      if (!val) {
        errors.url = 'URL is required';
      } else {
        const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=#]*)?$/i;
        if (!pattern.test(val) && !val.includes('localhost')) {
          errors.url = 'Please enter a valid URL (e.g. example.com or https://site.com)';
        }
      }
      break;
    }
    case 'text': {
      const textData = data as TextFormData;
      if (!textData.text || !textData.text.trim()) {
        errors.text = 'Content text cannot be empty';
      }
      break;
    }
    case 'email': {
      const emailData = data as EmailFormData;
      const email = (emailData.email || '').trim();
      if (!email) {
        errors.email = 'Recipient email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email address format';
      }
      break;
    }
    case 'phone': {
      const phoneData = data as PhoneFormData;
      const phone = (phoneData.phone || '').trim();
      if (!phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^[+]?[\d\s\-()]{5,20}$/.test(phone)) {
        errors.phone = 'Invalid phone number format';
      }
      break;
    }
    case 'wifi': {
      const wifiData = data as WifiFormData;
      if (!wifiData.ssid || !wifiData.ssid.trim()) {
        errors.ssid = 'Network name (SSID) is required';
      }
      if (wifiData.encryption !== 'nopass' && (!wifiData.password || wifiData.password.length < 8)) {
        errors.password = 'WPA/WEP passwords must be at least 8 characters';
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getDefaultFormData(type: QRType): QRFormData {
  switch (type) {
    case 'url':
      return { url: 'https://example.com' };
    case 'text':
      return { text: 'Hello! Welcome to QR Studio.' };
    case 'email':
      return { email: 'hello@example.com', subject: 'Inquiry from QR Code', body: 'Hi, I scanned your QR code!' };
    case 'phone':
      return { phone: '+91 1234567891' };
    case 'wifi':
      return { ssid: 'MyHomeWiFi', password: 'SuperSecretPassword123', encryption: 'WPA', hidden: false };
  }
}
