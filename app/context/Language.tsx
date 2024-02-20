'use client'
import locale from '@/public/locale';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Translations {
  [key: string]:
    | string
    | string[]
    | Record<string, string>
    | any;
}

function getLanguagePack(languagePack: string = 'us'): Translations {
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

interface ILanguageContext {
  lang: Translations;
  setLanguage: (language: string) => void;
  language: string;
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context)
    throw new Error();
  
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => window.localStorage.getItem('language') || 'us');
  

  useEffect(() => {
    const possibleLangs = ['ua', 'ru', 'us', 'it'];
    if (possibleLangs.includes(language as string)) {
      window.localStorage.setItem('language', language as string);
    } else {
      setLanguage('en');
    }
  }, [language]);

  const props: ILanguageContext = {
    lang: getLanguagePack(language),
    setLanguage,
    language,
  };
  return (
    <LanguageContext.Provider value={props}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
