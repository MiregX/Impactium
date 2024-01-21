import React, { useState } from 'react';
import { useLanguage } from './Lang';
import './Language.css'; // Import your styles

function Language() {
  const { setLanguage, getActiveLanguage } = useLanguage();
  const [isPanelActive, setPanelActive] = useState(false);

  const availableLanguages = ['en', 'uk', 'ru', 'it'];

  const toggleLanguageChoosePanel = () => {
    setPanelActive(!isPanelActive);
  };

  return (
    <div className={`language${isPanelActive ? ' active' : ''}`}>
      <div className="list">
        {availableLanguages.map((langCode) => (
          <div key={langCode} onClick={() => setLanguage(langCode)}>
            <img
              src={`https://api.impactium.fun/langs/${langCode}.png`}
              alt={`Language ${langCode}`}
              className={langCode === getActiveLanguage() ? 'active' : ''}
            />
          </div>
        ))}
      </div>
      <button className="toggler center" id="toggleLanguageChooseButton" onClick={toggleLanguageChoosePanel}>
        <img src="https://api.impactium.fun/svg/earth-globe.svg" alt="Toggle Language Choose Panel" />
      </button>
    </div>
  );
}

export default Language;
