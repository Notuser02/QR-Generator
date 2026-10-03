export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface URLFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export type QRFormData = URLFormData | TextFormData | EmailFormData | PhoneFormData | WifiFormData;

export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareType = 'square' | 'extra-rounded' | 'dot' | 'classy';
export type CornerDotType = 'square' | 'dot';
export type GradientType = 'none' | 'linear' | 'radial';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRGradientOptions {
  type: GradientType;
  color1: string;
  color2: string;
  rotation: number; // in degrees
}

export interface QRStyleOptions {
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  isTransparentBg: boolean;
  
  // Gradient
  gradient: QRGradientOptions;
  
  // Patterns
  dotsType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  
  // Custom Corner Colors (Optional override)
  useCustomCornerColors: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  
  // Logo
  logoUrl?: string;
  logoSize: number; // 0.1 to 0.4 of QR size
  logoMargin: number;
  hideDotsBehindLogo: boolean;
}

export interface QRPreset {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'gradient' | 'vibrant' | 'dark' | 'brand';
  previewBadge: string;
  style: Partial<QRStyleOptions>;
}

export interface HistoryItem {
  id: string;
  title: string;
  type: QRType;
  rawPayload: string;
  formData: QRFormData;
  style: QRStyleOptions;
  timestamp: number;
  previewDataUrl?: string;
}

export interface ReliabilityResult {
  score: number; // 0 to 100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  contrastRatio: number;
  warnings: string[];
  tips: string[];
}
