export type CardTheme =
  | 'luxury-dark'
  | 'emerald-glass'
  | 'royal-indigo'
  | 'sunset-rose'
  | 'minimalist';

export interface CardSocials {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  whatsapp?: string;
  youtube?: string;
  telegram?: string;
}

export interface DigitalCard {
  _id?: string;
  slug: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  theme?: CardTheme;
  socials?: CardSocials;
  badges?: string[];
  createdAt?: string | Date;
}
