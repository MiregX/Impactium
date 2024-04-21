'use client'
import s from '@/styles/Me.module.css';
import { useHeader } from '@/context/Header';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/Language';
import Link from 'next/link';

export function Nav() {
  const { setIsFlattenHeader } = useHeader();
  const { lang } = useLanguage();
  const [selectedButton, setSelectedButton] = useState<number>(0);
  const router = useRouter();
 
  useEffect(() => {
    setIsFlattenHeader(true);

    return () => {
      setIsFlattenHeader(false)
    }
  }, []);

  const map = {
    account: {
      image: 'https://cdn.impactium.fun/ui/user/user.svg'
    },
    settings: {
      image: 'https://cdn.impactium.fun/ui/action/settings.svg'
    }
  }

  return (
    <nav className={s.nav}>
      {['account', 'settings'].map((title, index) => (
        <Link
          key={index}
          className={(index === selectedButton && s.selected) || ''}
          onClick={() => {router.push('account'); setSelectedButton(index)}}
          href={`/me/${title}`}
        >
          <img src={map[title].image} alt='' />
          <p>{lang[title]}</p>
        </Link>
      ))}
    </nav>
  )
}