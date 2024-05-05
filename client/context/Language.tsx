'use client';
import { LanguageChooser } from '@/banners/language/LanguageChooser';
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

function validate(languageCode: string) {
  return !languageCode || !['us', 'ua', 'ru', 'it'].includes(languageCode) ? 'us' : languageCode;
}

const LanguageProvider: React.FC<{ children: React.ReactNode, predefinedLanguage: string }> = ({ children, predefinedLanguage }) => {
  const cookie = new Cookies();
  const [language, setLanguage] = useState<string>(validate(predefinedLanguage));
  const [isLanguageChooserVisible, setIsLanguageChooserVisible] = useState<boolean>(false);

  const refreshLanguage = () => { setLanguage(cookie.get('_language')) };

  const toggleIsLanguageChooserVisible = () => setIsLanguageChooserVisible(!isLanguageChooserVisible);

  function getLanguagePack(languageCode: string = 'us'): Translations {
    const translations: Translations = {};
    languageCode = validate(languageCode);
  
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
