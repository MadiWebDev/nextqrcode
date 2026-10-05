export type QRType =
  | 'text'
  | 'url'
  | 'pdf'
  | 'audio'
  | 'whatsapp'
  | 'phone'
  | 'sms'
  | 'email'
  | 'address'
  | 'wifi'
  | 'vcard'
  | 'social'
  | 'video'
  | 'image'
  | 'menu'
  | 'app'
  | 'coupon'
  | 'event'
  | 'business_card'
  | 'freelance'
  | 'ecommerce'
  | 'cleaning'
  | 'logistics'
  | 'finance'
  | 'cv'
  | 'mecard'
  | 'geo'
  | 'telegram'
  | 'zoom'
  | 'google_meet'
  | 'teams'
  | 'youtube'
  | 'linkedin'
  | 'spotify'
  | 'paypal'
  | 'upi'
  | 'bitcoin'
  | 'ethereum'
  | 'sepa'
  | 'google_review';

export type QRCategory = 'popular' | 'social' | 'payments' | 'business' | 'utilities';

export interface QRField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'select' | 'date' | 'time' | 'color';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
}

export interface QRTypeConfig {
  type: QRType;
  label: string;
  icon: string;
  description: string;
  fields: QRField[];
  category: QRCategory;
}

export interface QRData {
  [key: string]: string;
}

export type TemplateName = 'classic' | 'modern' | 'vibrant' | 'glassmorphism' | 'minimal' | 'corporate';

export interface TemplateStyle {
  name: TemplateName;
  label: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  qrBg: string;
  qrColor: string;
  accentColor: string;
  textColor: string;
  subtitleColor: string;
  iconColor: string;
}

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type EyeOuterStyle = 'square' | 'rounded' | 'circle';
export type EyeInnerStyle = 'square' | 'dot' | 'diamond';
export type FrameStyle = 'none' | 'simple' | 'rounded' | 'badge' | 'banner' | 'ticket';
export type ECLevel = 'L' | 'M' | 'Q' | 'H';

export interface CustomizationOptions {
  fgColor: string;
  bgColor: string;
  transparent: boolean;
  dotStyle: DotStyle;
  eyeOuterStyle: EyeOuterStyle;
  eyeInnerStyle: EyeInnerStyle;
  eyeColor: string;
  logoUrl: string | null;
  logoSize: number;
  logoPadding: number;
  logoShape: 'square' | 'circle';
  ecLevel: ECLevel;
  outputSize: number;
  frameStyle: FrameStyle;
  frameCta: string;
  frameColor: string;
  frameFontSize: number;
}

export type ExportFormat = 'png' | 'png-hd' | 'svg' | 'jpeg' | 'pdf' | 'copy-image' | 'copy-datauri' | 'copy-embed';

export interface QRState {
  type: QRType;
  data: QRData;
  template: TemplateName;
  customColor: string;
  customization: CustomizationOptions;
}
