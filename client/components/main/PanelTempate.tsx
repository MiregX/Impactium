import React from 'react';
import s from '@/app/App.module.css';

interface Panel {
  children: any;
  splitter?: boolean;
  style?: string[];
}

export function PanelTemplate({ children, splitter, style }: Panel) {
  return(
    <div className={`${s.panel} ${style?.join(' ')}`} data-splitter={splitter?.toString()}>
      {children}
      <img src='https://cdn.impactium.fun/el/way.svg'/>
    </div>
  );
};