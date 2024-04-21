'use client';
import { LanguageChooser } from '@/components/LanguageChooser';
import locale from '@/public/locale';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

interface Translations {
  [key: string]:
    | string
    | string[]
    | Record<string, string>
    | any;
}

interface ILanguageContext {
  lang: Translations;
  setLanguage: (language: string) => void;
  language: string;
  refreshLanguage: () => void;
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) throw new Error();
  
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cookie = new Cookies();
  const [language, setLanguage] = useState<string>(checkIsLanguageCodeIsValid(cookie.get('_language')) || 'us');

  function checkIsLanguageCodeIsValid(languageCode: string) {
    const isLanguagePackValid = ['us', 'ua', 'ru', 'it'].includes(languageCode);

    return !languageCode || !isLanguagePackValid ? 'us' : languageCode;
  }

  async function refreshLanguage() {
    setLanguage(cookie.get('_language'));
  }

  function getLanguagePack(languageCode: string = 'us'): Translations {
    const translations: Translations = {};
    languageCode = checkIsLanguageCodeIsValid(languageCode);
  
    for (const key in locale) {
      const prop: any = locale[key];
  
      if (Array.isArray(prop)) {
        translations[key] = prop.map((item: any) => item[languageCode]);
      } else if (typeof prop === 'string') {
        translations[key] = prop;
      } else if (typeof prop === 'object' && prop?.[languageCode]) {
        translations[key] = prop[languageCode];
      } else {
        const nestedTranslations: Record<string, string> = {};
        for (const nestedKey in prop) {
          if (prop?.[nestedKey]?.[languageCode]) {
            nestedTranslations[nestedKey] = prop[nestedKey][languageCode];
          }
        }
        translations[key] = nestedTranslations;
      }
    }
    return translations;
  }

  useEffect(() => {
    const l = checkIsLanguageCodeIsValid(language);
    cookie.remove('_language');
    cookie.set('_language', l, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: '/'
    });
    setLanguage(l);
  }, [language]);

  const props: ILanguageContext = {
    lang: getLanguagePack(language),
    setLanguage,
    refreshLanguage,
    language,
  };
  return (
    <LanguageContext.Provider value={props}>
      {children}
      <LanguageChooser />
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
