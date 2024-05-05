'use client'
import { useLanguage } from '@/context/Language';
import _language from './Language.module.css';
import { Banner } from '@/ui/Banner';
import Cookies from 'universal-cookie';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';

export function LanguageChooser() {
  const { lang, language, setLanguage } = useLanguage();
  const cookie = new Cookies();

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

  const rightButton: GeistButton = {
    type: GeistButtonTypes.Button,
    text: lang._save,
    focused: true
  }

  const footer = {
    left: [
      {
        type: GeistButtonTypes.Link,
        minimized: true,
        text: lang.found_a_translation_error,
        href: 'https://t.me/impactium'
      } as GeistButton
    ],
    right: [ rightButton ]
  };
  

  return (
    <Banner title={lang.chooseLanguages} footer={footer} onClose={rightButton.action}>
      <div className={_language._}>
        {Object.keys(availableLanguages).map((key) => (
          <div
            className={key === language ? _language.active : undefined}
            key={key}
            onClick={() => setLanguage(key)}>
            <img
              src={`https://cdn.impactium.fun/lang/${availableLanguages[key].code}.webp`}
              alt=''/>
            <p>{availableLanguages[key].target}</p>
            {key === language && <span>{lang._selected}</span>}
          </div>
        ))}
      </div>
    </Banner>
  );
};
