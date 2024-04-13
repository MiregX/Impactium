import React from 'react';
import s from '@/styles/main/Main.module.css';

interface Panel {
  children: any,
  splitter?: boolean
}

export function PanelTemplate({ children, splitter }: Panel) {
  return(
    <div className={s.panel} data-splitter={splitter}>
      {children}
      <img src='https://cdn.impactium.fun/el/way.svg'/>
    </div>
  );
};