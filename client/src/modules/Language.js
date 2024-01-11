import React, { useState } from 'react';
import './Language.css'; // Подключите стили для этого компонента

function Language() {
  const [isPanelActive, setPanelActive] = useState(false);

  const availableLanguages = ['en', 'uk', 'ru', 'it'];

  const toggleLanguageChoosePanel = () => {
    setPanelActive(!isPanelActive);
  };

  return (
    <div className={`language ${isPanelActive ? 'active' : ''}`}>
      <div className="list">
        {availableLanguages.map((langCode) => (
          <a key={langCode} href={`/lang/${langCode}`}>
            <img src={`https://api.impactium.fun/langs/${langCode}.png`} alt={`Language ${langCode}`} />
          </a>
        ))}
      </div>
      <button className="toggler center" id="toggleLanguageChooseButton" onClick={toggleLanguageChoosePanel}>
        <img src="https://api.impactium.fun/svg/earth-globe.svg" alt="Toggle Language Choose Panel" />
      </button>
    </div>
  );
}

export default Language;
