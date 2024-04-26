import React, { useEffect, useState } from 'react';
import s from '@/components/header/Nav.module.css';
import { useLanguage } from '@/context/Language'

export function Nav() {
  const { lang } = useLanguage();

  return (
    <div className={s.nav}>
    </div>
  );
};
