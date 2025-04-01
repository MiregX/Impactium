'use client'
import { useLanguage } from '@/context/Language.context';
import s from './Language.module.css';
import { Banner } from '@/ui/Banner';
import { Button, Stack } from '@impactium/components';

export function LanguageChooser() {
  const { lang, language, setLanguage } = useLanguage();

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
            variant={key === language ? 'glass' : 'secondary'}
            key={key}
            onClick={() => setLanguage(key)}>
            {availableLanguages[key].target}
          </Button>
        ))}
      </Stack>
    </Banner>
  );
};
