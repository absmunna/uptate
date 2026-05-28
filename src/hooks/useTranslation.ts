import { useAppStore } from '../store/appStore';
import { en } from '../i18n/locales/en';
import { bn } from '../i18n/locales/bn';

export const useTranslation = () => {
  const { lang } = useAppStore();
  const translations = lang === 'EN' ? en : bn;

  const t = (key: keyof typeof en) => {
    return translations[key] || en[key] || key;
  };

  return { t, lang };
};
