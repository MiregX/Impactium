import React, { createContext, useContext, useEffect, useState } from 'react';

const locale = require('./locale.json');

function getLanguagePack(languagePack = 'en') {
  const languageProxy = new Proxy(locale, {
    get(target, prop) {
      if (Array.isArray(target[prop])) {
        return target[prop].map((item) => item[languagePack]);
      } else if (typeof target[prop] === 'string') {
        return target[prop];
      } else if (typeof target[prop]?.[languagePack] === 'string') {
        return target[prop][languagePack];
      } else {
        const translations = {};
        for (const key in target[prop]) {
          if (target[prop]?.[key]?.[languagePack]) {
            translations[key] = target[prop]?.[key]?.[languagePack];
          }
        }
        return translations;
      }
    },
  });

  languageProxy.debugPath = __dirname;
  return languageProxy;
}

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language'));

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const getActiveLanguage = () => {
    return language;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const lang = getLanguagePack(language);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, getActiveLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
