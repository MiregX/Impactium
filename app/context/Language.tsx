'use client'
import locale from '@/public/locale';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Translations {
  [key: string]: string | string[] | Record<string, string>;
}

function getLanguagePack(languagePack: string | null = 'us'): Translations {
  const translations: Translations = {};
  const isLanguagePackValid = ['us', 'ua', 'ru', 'it'].includes(languagePack as string);

  if (!isLanguagePackValid) {
    languagePack = 'us';
  }

  for (const key in locale) {
    const prop: any = locale[key];

    if (Array.isArray(prop)) {
      translations[key] = prop.map((item: any) => item[languagePack as string]);
    } else if (typeof prop === 'string') {
      translations[key] = prop;
    } else if (typeof prop === 'object' && prop?.[languagePack as string]) {
      translations[key] = prop[languagePack as string];
    } else {
      const nestedTranslations: Record<string, string> = {};
      for (const nestedKey in prop) {
        if (prop?.[nestedKey]?.[languagePack as string]) {
          nestedTranslations[nestedKey] = prop[nestedKey][languagePack as string];
        }
      }
      translations[key] = nestedTranslations;
    }
  }
  return translations;
}

interface LanguageContextProps {
  lang: Translations;
  setLanguage: (language: string) => void;
  language: string | null;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  return useContext(LanguageContext);
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string | null>(() => window.localStorage.getItem('language'));

  useEffect(() => {
    const possibleLangs = ['uk', 'ru', 'en', 'it'];
    if (possibleLangs.includes(language as string)) {
      window.localStorage.setItem('language', language as string);
    } else {
      setLanguage('en');
    }
  }, [language]);

  const lang = getLanguagePack(language);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
