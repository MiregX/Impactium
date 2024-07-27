'use client'
import React from 'react';
import s from '@/app/App.module.css';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { useUser } from '@/context/User.context';

interface Panel {
  children: any;
  // Можно передать стили в масиве или один стиль стрингой
  className?: string[] | string;
  // Ставит заголовок страницы как у /account
  title?: string;
  // Разворачивает панель на весь екран
  fullscreen?: true;
  // Ставит контент в колонну
  useColumn?: true;
  // Центрирует контент
  center?: true;
  // Включить AuthGuard?
  useAuthGuard?: true;
  // Смещает контент в левый верхний угол
  useStart?: true
}

export function PanelTemplate({ children, className, title, fullscreen, useColumn, center, useAuthGuard, useStart }: Panel) {
  const { lang } = useLanguage();
  const { user } = useUser();
  
  authGuard({
    useRedirect: useAuthGuard
  });

  return(
    <div className={`${s.panel} ${useClasses(className)} ${center && s.center} ${title && s.title} ${fullscreen && s.fullscreen} ${useColumn && s.useColumn} ${useStart && s.useStart}`}>
      {title && <div className={s.title_wrapper}><h3 className={s.title}>{title.startsWith('$') ? lang[title.substring(1)] : title}</h3></div>}
      {children}
      <img src='https://cdn.impactium.fun/el/way.svg'/>
    </div>
  );
};