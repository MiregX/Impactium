'use client';
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
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) throw new Error();
  
  return context;
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cookie = new Cookies();
  const [language, setLanguage] = useState<string>(checkIsLanguageCodeIsValid(cookie.get('language')) || 'us');

  function checkIsLanguageCodeIsValid(languageCode: string) {
    const isLanguagePackValid = ['us', 'ua', 'ru', 'it'].includes(languageCode);

    return !languageCode || !isLanguagePackValid ? 'us' : languageCode;
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
    cookie.set('language', l);
    setLanguage(l);
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
