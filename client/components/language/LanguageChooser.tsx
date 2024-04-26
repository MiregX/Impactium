'use client'
import { useLanguage } from '@/context/Language';
import _language from './Language.module.css';
import { Banner } from '@/ui/Banner';
import Cookies from 'universal-cookie';
import { BaseButton, BaseButtonTypes } from '@/ui/BaseButton';

export function LanguageChooser() {
  const { lang, language, setLanguage, toggleIsLanguageChooserVisible } = useLanguage();
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
    left: [
      {
        type: BaseButtonTypes.link,
        outline: false,
        text: lang.found_a_translation_error,
        href: 'https://t.me/impactium'
      }
    ],
    right: [
      {
        type: BaseButtonTypes.button,
        text: lang._save,
        action: () => toggleIsLanguageChooserVisible(),
        focused: true
      }
    ]
  };

  return (
    <Banner title={lang.chooseLanguages} footer={footer}>
      <div className={_language._}>
        {Object.keys(availableLanguages).map((key) => (
          <div
            className={key === language ? _language.active : undefined}
            key={key}
            onClick={() => setLanguage(key)}
          >
            <img
              src={`https://cdn.impactium.fun/lang/${availableLanguages[key].code}.webp`}
              alt=''
            />
            <p>{availableLanguages[key].target}</p>
            {key === language && <span>{lang._selected}</span>}
          </div>
        ))}
      </div>
    </Banner>
  );
};
