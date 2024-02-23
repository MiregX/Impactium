import locale from '@/public/locale';
import cookie from './Cookie';
import { effect, signal, Signal } from '@preact/signals-react';

interface Translations {
  [key: string]:
    | string
    | string[]
    | Record<string, string>;
}

class Language {
  code: Signal;
  translations: any;

  constructor() {
    this.code = signal<string>(cookie.get('language') || 'us');
    this.translations = signal<Translations>(this.process(this.code.value));
  }

  setLanguage(languageCode: string) {
    this.code.value = languageCode;
  }

  process(languagePack: string = 'us'): Translations {
    const translations: Translations = {};

    const isLanguagePackValid = ['us', 'ua', 'ru', 'it'].includes(languagePack);

    if (!isLanguagePackValid) {
      languagePack = 'us';
    }

    for (const key in locale) {
      const prop: any = locale[key];

      if (Array.isArray(prop)) {
        translations[key] = prop.map((item: any) => item[languagePack]);
      } else if (typeof prop === 'string') {
        translations[key] = prop;
      } else if (typeof prop === 'object' && prop?.[languagePack]) {
        translations[key] = prop[languagePack];
      } else {
        const nestedTranslations: Record<string, string> = {};
        for (const nestedKey in prop) {
          if (prop?.[nestedKey]?.[languagePack]) {
            nestedTranslations[nestedKey] = prop[nestedKey][languagePack];
          }
        }
        translations[key] = nestedTranslations;
      }
    }
    return translations;
  }
}

export const language = new Language();
export const lang = language.translations.value;

effect(() => {
  const possibleLangs = ['ua', 'ru', 'us', 'it'];
  const currentLanguage = language.code.value;

  if (possibleLangs.includes(currentLanguage)) {
    cookie.set('language', currentLanguage);
    language.translations.value = language.process(currentLanguage);
  } else {
    language.setLanguage('us');
  }
});