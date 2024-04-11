import React from 'react';
import s from '@/styles/Index.module.css';

export function PanelTemplate({ children }) {
  return(
    <div className={s.panel}>
      {children}
    </div>
  );
};