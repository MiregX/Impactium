import React, { useEffect, useState } from 'react';
import nav from './Nav.module.css';
import { useLanguage } from '@/context/Language'
import Link from 'next/link';

export function Nav() {
  const { lang } = useLanguage();

  return (
    <React.Fragment>
      <div className={nav.background} />
      <div className={nav._}>
        <Link href={'/me/account'}>{lang.account}</Link>
      </div>
    </React.Fragment>
  );
};
