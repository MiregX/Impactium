'use client';
import locale, { _Locale, Locale } from '@/public/locale';
import { Parent } from '@/types';
import { Banner } from '@/ui/Banner';
import { Button, Stack } from '@impactium/components';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';
import s from './Language.module.css';

export function LanguageProvider({ children, predefinedLanguage }: Language.Provider.Props) {
  const cookie = new Cookies();
  const [language, setLanguage] = useState<string>(cookie.get('_language') || Language.validate(predefinedLanguage));

  useEffect(() => cookie.set('_language', language, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }), [language]);

  const refreshLanguage = () => { setLanguage(cookie.get('_language')) };

  function getLanguagePack(languageCode: string = 'us') {
    const translations: any = {};
    languageCode = Language.validate(languageCode);

    for (const key in locale) {
      const prop: any = locale[key as keyof Locale];

      if (Array.isArray(prop)) {
        translations[key] = prop.map((item: any) => item[languageCode]);
      } else if (typeof prop === 'string') {
        translations[key] = prop;
      } else if (typeof prop === 'object' && prop?.[languageCode]) {
        translations[key] = prop[languageCode];
      } else {
        const nestedTranslations: Record<string, string> = {};
        for (const nestedKey in prop) {
          if (prop?.[nestedKey]?.[languageCode]) {
            nestedTranslations[nestedKey] = prop[nestedKey][languageCode];
          }
        }
        translations[key] = nestedTranslations;
      }
    }
    return translations;
  }

  const lang = useMemo(() => getLanguagePack(language), [language]);

  const props: Language.Export = {
    lang,
    setLanguage,
    refreshLanguage,
    language
  };

  return (
    <Language.Context.Provider value={props}>
      {children}
    </Language.Context.Provider>
  );
}


export namespace Language {
  export interface Export {
    lang: Locale;
    setLanguage: (language: string) => void;
    language: string;
    refreshLanguage: () => void;
  }

  export const Context = createContext<Language.Export | undefined>(undefined);

  export const use = () => useContext<Language.Export | undefined>(Context)!;

  export function validate(languageCode?: string) {
    return !languageCode || !['us', 'ua', 'ru', 'it', 'pl'].includes(languageCode) ? 'us' : languageCode;
  }

  export namespace Provider {
    export interface Props extends Parent {
      predefinedLanguage?: string;
    }
  }

  export function Chooser() {
    const { lang, language, setLanguage } = Language.use();

    const availableLanguages: { [key: string]: { code: string; target: string; } } = {
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
      }
    };

    return (
      <Banner title={lang.choose.language}>
        <Stack className={s._}>
          {Object.keys(availableLanguages).map((key: string) => (
            <Button
              variant={key === language ? 'hardline' : 'outline'}
              key={key}
              onClick={() => setLanguage(key)}>
              {availableLanguages[key].target}
            </Button>
          ))}
        </Stack>
      </Banner>
    );
  };
}