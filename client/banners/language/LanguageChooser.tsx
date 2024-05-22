'use client'
import { useLanguage } from '@/context/Language';
import _language from './Language.module.css';
import { Banner } from '@/ui/Banner';
import Cookies from 'universal-cookie';
import { GeistButton, GeistButtonTypes } from '@/ui/Button';

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

  const footer = {
    left: [<GeistButton options={{
            type: GeistButtonTypes.Link,
            minimized: true,
            text: lang.found_a_translation_error,
            do: 'https://t.me/impactium'
          }} />],
    right: [<GeistButton options={{
            type: GeistButtonTypes.Button,
            text: lang._save,
            img: 'https://cdn.impactium.fun/ui/check/all-big.svg',
            focused: true
          }} />]
  };
  

  return (
    <Banner title={lang.choose.language} footer={footer}>
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
