import React, { useState } from 'react';
import { useLanguage } from '@/context/Language';
import _language from './Language.module.css';
import { Banner } from '@/ui/Banner';

export function LanguageChooser() {
  const { setLanguage, lang, language } = useLanguage();

  const availableLanguages = {
    us: {
      code: 'english',
      target: 'English'
    },
    ua: {
      code: 'ucraine',
      target: 'Українська'
    },
    ru: {
      code: 'russia',
      target: 'Русский'
    },
    it: {
      code: 'italy',
      target: 'Italiano'
    },
    pl: {
      code: 'poland',
      target: 'Polska'
    }
  };

  return (
    <Banner title={lang.chooseLanguages} warner='Некоторые языки могут иметь неправильный перевод'>
      <div className={_language._}>
        {Object.keys(availableLanguages).map((key) => (
          <div
            className={key === language && _language.active}
            key={key}
            onClick={() => setLanguage(key)}
          >
            <img
              src={`https://cdn.impactium.fun/lang/${availableLanguages[key].code}.webp`}
              alt=''
            />
            <p>{availableLanguages[key].target}</p>
          </div>
        ))}
      </div>
    </Banner>
  );
};
