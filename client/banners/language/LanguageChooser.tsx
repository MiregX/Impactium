'use client'
import { useLanguage } from '@/context/Language.context';
import _language from './Language.module.css';
import { Banner } from '@/ui/Banner';
import Cookies from 'universal-cookie';
import { Button } from '@/ui/Button';
import { Badge, BadgeType } from '@/ui/Badge';
import Image from 'next/image'
import Link from 'next/link';
import { useApplication } from '@/context/Application.context';

export function LanguageChooser() {
  const { lang, language, setLanguage } = useLanguage();
  const { destroyBanner } = useApplication();
  const cookie = new Cookies();

  // Asserting type for availableLanguages
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
    },
    pl: {
      code: 'poland',
      target: 'Polska'
    }
  };

  const footer = {
    left: [<Button variant='link'><Link href='https://t.me/impactium'>{lang.found_a_Template_error}</Link></Button>],
    right: [<Button img='Check' onClick={destroyBanner}>{lang._save}</Button>]
  };
  

  return (
    <Banner title={lang.choose.language} footer={footer}>
      <div className={_language._}>
        {Object.keys(availableLanguages).map((key: string) => (
          <div
            className={key === language ? _language.active : undefined}
            key={key}
            onClick={() => setLanguage(key)}>
            <Image
              src={`https://cdn.impactium.fun/lang/${availableLanguages[key].code}.webp`}
              height={32}
              width={32}
              priority={true}
              alt=''/>
            <p>{availableLanguages[key].target}</p>
            {key === language && <Badge type={BadgeType.selected} />}
          </div>
        ))}
      </div>
    </Banner>
  );
};
