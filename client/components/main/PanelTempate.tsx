'use client'
import React from 'react';
import s from '@/app/App.module.css';
import { useLanguage } from '@/context/Language';

interface Panel {
  children: any;
  splitter?: boolean;
  style?: string[];
  title?: string;
}

export function PanelTemplate({ children, splitter, style, title }: Panel) {
  const { lang } = useLanguage();
  return(
    <div className={`${s.panel} ${style?.join(' ')} ${title && s.hasTitle}`} data-splitter={splitter?.toString()}>
      {title && <div className={s.title_wrapper}><h3 className={s.title}>{title.startsWith('$') ? lang[title.substring(1)] : title}</h3></div>}
      {children}
      <img src='https://cdn.impactium.fun/el/way.svg'/>
    </div>
  );
};