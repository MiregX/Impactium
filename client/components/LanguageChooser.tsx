import React, { useState } from 'react';
import { useLanguage } from '@/context/Language';
import s from '@/styles/Language.module.css';

export function LanguageChooser() {
  const { setLanguage, language } = useLanguage();
  const [isPanelActive, setPanelActive] = useState<boolean>(false);

  const availableLanguages = {
    us:'english',
    ua: 'ucraine',
    ru: 'russia',
    it: 'italy'
  };
  return (
    <div className={`${s.language} ${isPanelActive && s.active}`}>
      <div className={s.list}>
        {Object.values(availableLanguages).map((langKey) => (
          <div key={langKey} onClick={() => setLanguage(langKey)}>
            <img
              src={`https://cdn.impactium.fun/lang/${availableLanguages[langKey]}.png`}
              alt=''
              className={langKey === language  ? s.active : ''}
            />
          </div>
        ))}
      </div>
      <button className={s.toggler} onClick={() => setPanelActive(!isPanelActive)}>
        <img src='https://cdn.impactium.fun/ui/specific/globe.svg' alt='' />
      </button>
    </div>
  );
};
