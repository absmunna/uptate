import { create } from 'zustand';

export type Language = 'en' | 'bn';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home',
    'marketplace': 'Market',
    'apps': 'Apps',
    'explore': 'Explore',
    'profile': 'Profile',
    'news': 'News',
    'app.search': 'Search PaikarMart...',
    'app.signIn': 'Sign In',
    'app.allApps': 'All Apps',
    'app.launcherText': 'Explore everything inside PaikarMart',
    'app.quickAccess': 'Quick Access',
    'app.recent': 'Recently Used',
    'app.logout': 'Terminate Session',
  },
  bn: {
    'home': 'হোম',
    'marketplace': 'মার্কেট',
    'apps': 'অ্যাপস',
    'explore': 'এক্সপ্লোর',
    'profile': 'প্রোফাইল',
    'news': 'নিউজ',
    'app.search': 'খুঁজুন PaikarMart...',
    'app.signIn': 'লগ ইন',
    'app.allApps': 'সকল অ্যাপস',
    'app.launcherText': 'PaikarMart এর ভিতরের সবকিছু এক্সপ্লোর করুন',
    'app.quickAccess': 'দ্রুত অ্যাক্সেস',
    'app.recent': 'সম্প্রতি ব্যবহৃত',
    'app.logout': 'সেশন শেষ করুন',
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('pm-language') as Language) || 'bn', // Default to Bengali
  setLanguage: (language) => {
    localStorage.setItem('pm-language', language);
    set({ language });
  },
  toggleLanguage: () => set((state) => {
    const newLang = state.language === 'en' ? 'bn' : 'en';
    localStorage.setItem('pm-language', newLang);
    return { language: newLang };
  }),
  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || key;
  }
}));
