'use client'
import s from '@/styles/Me.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/Language.context';
import Link from 'next/link';

interface MapType {
  [key: string]: { image: string }; // Index signature allowing any string key with an object containing 'image' property
}

export function Nav() {
  const { lang } = useLanguage();
  const [selectedButton, setSelectedButton] = useState<number>(0);
  const router = useRouter();

  const map: MapType = {
    account: {
      image: 'https://cdn.impactium.fun/ui/user/user.svg'
    },
    settings: {
      image: 'https://cdn.impactium.fun/ui/action/settings.svg'
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
          <img src={map[title].image} alt='' />
          <p>{lang[title]}</p>
        </Link>
      ))}
    </nav>
  );
}
