'use client';
import locale, { _Locale, Locale } from '@/public/locale';
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
  lang: Locale;
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

function validate(languageCode?: string) {
  return !languageCode || !['us', 'ua', 'ru', 'it', 'pl'].includes(languageCode) ? 'us' : languageCode;
}

const LanguageProvider: React.FC<{ children: React.ReactNode, predefinedLanguage?: string }> = ({ children, predefinedLanguage }) => {
  const cookie = new Cookies();
  const [language, setLanguage] = useState<string>(cookie.get('_language') || validate(predefinedLanguage));

  useEffect(() => cookie.set('_language', language, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }), [language]);

  const refreshLanguage = () => { setLanguage(cookie.get('_language')) };

  function getLanguagePack(languageCode: string = 'us') {
    const translations: any = {};
    languageCode = validate(languageCode);
  
    for (const key in locale) {
      const prop: any = locale[key as keyof Locale];
  
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

  const props: ILanguageContext = {
    lang: getLanguagePack(language),
    setLanguage,
    refreshLanguage,
    language
  };

  return (
    <LanguageContext.Provider value={props}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
