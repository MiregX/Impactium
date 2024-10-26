'use client'
import React, { ReactElement } from 'react';
import s from '@/app/App.module.css';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { Locale } from '@/public/locale';

interface Panel {
  children: any;
  className?: string[] | string;
  title?: string
  fullscreen?: true;
  useColumn?: true;
  center?: true;
  useAuthGuard?: true;
  useStart?: true
  prev?: ReactElement
}

export function PanelTemplate({ children, className, title, fullscreen, useColumn, center, useAuthGuard, useStart, prev }: Panel) {
  const { lang } = useLanguage();
  
  authGuard({
    useRedirect: useAuthGuard
  });

  return(
    <div className={`${s.panel} ${useClasses(className)} ${center && s.center} ${title && s.title} ${fullscreen && s.fullscreen} ${useColumn && s.useColumn} ${useStart && s.useStart}`}>
      {title && <div className={s.title_wrapper}><h3 className={s.title}>{title.startsWith('$') ? lang[title.substring(1) as keyof Locale] as string : title}</h3>{prev}</div>}
      {children}
    </div>
  );
};