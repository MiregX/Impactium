import React, { useState } from 'react';
import { useLanguage } from '@/context/Language';
import s from '@/styles/Language.module.css';

export function Language() {
  const { setLanguage, language } = useLanguage();
  const [isPanelActive, setPanelActive] = useState<boolean>(false);

  const availableLanguages = ['us', 'ua', 'ru', 'it'];
  return (
    <div className={`${s.language} ${isPanelActive && s.active}`}>
      <div className={s.list}>
        {availableLanguages.map((langCode) => (
          <div key={langCode} onClick={() => setLanguage(langCode)}>
            <img
              src={`https://cdn.impactium.fun/langs/${langCode}.png`}
              alt=''
              className={langCode === language && s.active}
            />
          </div>
        ))}
      </div>
      <button className={s.toggler} onClick={() => setPanelActive(!isPanelActive)}>
        <img src="https://cdn.impactium.fun/svg/earth-globe.svg" alt="" />
      </button>
    </div>
  );
};
