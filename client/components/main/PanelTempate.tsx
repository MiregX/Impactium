'use client'
import React from 'react';
import s from '@/app/App.module.css';
import { useLanguage } from '@/context/Language';

interface Panel {
  children: any;
  // Можно передать стили в масиве или один стиль стрингой
  style?: string[] | string;
  // Ставит заголовок страницы как у /account
  title?: string;
  // Разворачивает панель на весь екран
  fullscreen?: true;
  // Ставит контент в колонну
  useColumn?: true
}

export function PanelTemplate({ children, style, title, fullscreen, useColumn }: Panel) {
  const { lang } = useLanguage();
  return(
    <div className={`${s.panel} ${typeof style === 'string' ? style : style?.join(' ')} ${title && s.hasTitle} ${fullscreen && s.fullscreen} ${useColumn && s.isColumn}`}>
      {title && <div className={s.title_wrapper}><h3 className={s.title}>{title.startsWith('$') ? lang[title.substring(1)] : title}</h3></div>}
      {children}
      <img src='https://cdn.impactium.fun/el/way.svg'/>
    </div>
  );
};