'use client'
import s from '@/styles/Me.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/Language.context';
import Link from 'next/link';
import { Icon } from '@/ui/Icon';
import { λIcon } from '@/lib/utils';

interface MapType {
  [key: string]: { image: λIcon };
}

export function Nav() {
  const { lang } = useLanguage();
  const [selectedButton, setSelectedButton] = useState<number>(0);
  const router = useRouter();

  const map: MapType = {
    account: {
      image: 'User'
    },
    settings: {
      image: 'Settings'
    }
  };

  return (
    <nav className={s.nav}>
      {['account', 'settings'].map((title, index) => (
        <Link
          key={index}
          className={(index === selectedButton && s.selected) || ''}
          onClick={() => { router.push('account'); setSelectedButton(index) }}
          href={`/me/${title}`}
        >
          <Icon name={map[title].image} />
          <p>{lang[title]}</p>
        </Link>
      ))}
    </nav>
  );
}
