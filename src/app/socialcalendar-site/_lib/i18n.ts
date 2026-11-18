/**
 * Internationalization scaffold (spec §14).
 *
 * English is the only complete locale. Urdu, Arabic and Hindi ship as
 * SCAFFOLDS: they translate the workspace chrome keys below as samples
 * and fall back to English for everything else. They are explicitly NOT
 * production-ready translations — the UI labels them "(preview)".
 * Adding a locale = adding a dictionary; adding a string = adding a key
 * to `en` first (other locales fall back until translated).
 */
export type Locale = 'en' | 'ur' | 'ar' | 'hi';

export const LOCALES: { code: Locale; label: string; complete: boolean }[] = [
  { code: 'en', label: 'English', complete: true },
  { code: 'ur', label: 'اردو (Urdu) — preview', complete: false },
  { code: 'ar', label: 'العربية (Arabic) — preview', complete: false },
  { code: 'hi', label: 'हिन्दी (Hindi) — preview', complete: false },
];

export const RTL_LOCALES: Locale[] = ['ur', 'ar'];

const en = {
  'tab.calendar': 'Calendar',
  'tab.manage': 'Campaigns & brand',
  'tab.library': 'Library',
  'tab.intelligence': 'Intelligence',
  'tab.analytics': 'Analytics',
  'tab.overview': 'Overview',
  'tab.workspaces': 'Workspaces',
  'tab.data': 'Data & backup',
  'workspace.title': 'Workspace',
  'action.newPost': 'New post',
  'action.search': 'Search posts…',
  'action.shortcuts': 'Keyboard shortcuts',
  'palette.placeholder': 'Type a command or search posts…',
  'onboarding.welcome': 'Welcome to your content calendar',
} as const;

export type MessageKey = keyof typeof en;

const ur: Partial<Record<MessageKey, string>> = {
  'tab.calendar': 'کیلنڈر',
  'tab.manage': 'مہمات اور برانڈ',
  'tab.library': 'لائبریری',
  'tab.intelligence': 'ذہانت',
  'tab.analytics': 'تجزیات',
  'tab.overview': 'جائزہ',
  'tab.workspaces': 'ورک اسپیسز',
  'tab.data': 'ڈیٹا اور بیک اپ',
  'workspace.title': 'ورک اسپیس',
  'action.newPost': 'نئی پوسٹ',
  'action.search': 'پوسٹس تلاش کریں…',
  'action.shortcuts': 'کی بورڈ شارٹ کٹس',
  'palette.placeholder': 'کمانڈ لکھیں یا پوسٹس تلاش کریں…',
  'onboarding.welcome': 'آپ کے مواد کیلنڈر میں خوش آمدید',
};

const ar: Partial<Record<MessageKey, string>> = {
  'tab.calendar': 'التقويم',
  'tab.manage': 'الحملات والعلامة',
  'tab.library': 'المكتبة',
  'tab.intelligence': 'الذكاء',
  'tab.analytics': 'التحليلات',
  'tab.overview': 'نظرة عامة',
  'tab.workspaces': 'مساحات العمل',
  'tab.data': 'البيانات والنسخ الاحتياطي',
  'workspace.title': 'مساحة العمل',
  'action.newPost': 'منشور جديد',
  'action.search': 'ابحث في المنشورات…',
  'action.shortcuts': 'اختصارات لوحة المفاتيح',
  'palette.placeholder': 'اكتب أمرًا أو ابحث في المنشورات…',
  'onboarding.welcome': 'مرحبًا بك في تقويم المحتوى الخاص بك',
};

const hi: Partial<Record<MessageKey, string>> = {
  'tab.calendar': 'कैलेंडर',
  'tab.manage': 'अभियान और ब्रांड',
  'tab.library': 'लाइब्रेरी',
  'tab.intelligence': 'इंटेलिजेंस',
  'tab.analytics': 'एनालिटिक्स',
  'tab.overview': 'अवलोकन',
  'tab.workspaces': 'वर्कस्पेस',
  'tab.data': 'डेटा और बैकअप',
  'workspace.title': 'वर्कस्पेस',
  'action.newPost': 'नई पोस्ट',
  'action.search': 'पोस्ट खोजें…',
  'action.shortcuts': 'कीबोर्ड शॉर्टकट',
  'palette.placeholder': 'कमांड लिखें या पोस्ट खोजें…',
  'onboarding.welcome': 'आपके कंटेंट कैलेंडर में स्वागत है',
};

const DICTIONARIES: Record<Locale, Partial<Record<MessageKey, string>>> = { en, ur, ar, hi };

export function translate(locale: Locale, key: MessageKey): string {
  return DICTIONARIES[locale][key] ?? en[key];
}
