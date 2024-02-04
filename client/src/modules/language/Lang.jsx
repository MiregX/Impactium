import React, { createContext, useContext, useEffect, useState } from 'react';

const locale = require('./locale.json');

function getLanguagePack(languagePack = 'en') {
  const translations = {};
  const isLanguagePackValid = ['en', 'uk', 'ru', 'it'].includes(languagePack);

  if (!languagePack || !isLanguagePackValid)
    languagePack = 'en';

  for (const key in locale) {
    const prop = locale[key];

    if (Array.isArray(prop)) {
      translations[key] = prop.map((item) => item[languagePack]);
    } else if (typeof prop === 'string') {
      translations[key] = prop;
    } else if (typeof prop?.[languagePack] === 'string') {
      translations[key] = prop[languagePack];
    } else {
      const nestedTranslations = {};
      for (const nestedKey in prop) {
        if (prop?.[nestedKey]?.[languagePack]) {
          nestedTranslations[nestedKey] = prop[nestedKey][languagePack];
        }
      }
      translations[key] = nestedTranslations;
    }
  }
  return translations;
}


const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language'));

  const getActiveLanguage = () => {
    return language;
  };

  useEffect(() => {
    const possibleLangs = ['uk', 'ru', 'en', 'it']
    if (possibleLangs.includes(language)) {
      localStorage.setItem('language', language);
    } else {
      setLanguage('en')
    }
  }, [language]);

  const lang = getLanguagePack(language);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, getActiveLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
