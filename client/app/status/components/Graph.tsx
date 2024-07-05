import React from 'react';
import s from '../Status.module.css';
import { useLanguage } from '@/context/Language.context';

export function Graph({ array }: { array: number[] }) {
  const { lang } = useLanguage();
  const max = Math.max(...array);
  const min = Math.min(...array);

  return (
    <div className={s.graph}>
      <s>{lang.min} {min}ms</s>
      {array.map((number, index) => (
        <code
          key={index}
          className={s.code}
          style={{ height: `${(number / max) * 100}%`, background: number < 50
          ? 'var(--geist-green)'
          : (number < 250
            ? 'var(--geist-yellow)'
            : 'var(--geist-red)'
          )}}
        ></code>
      ))}
      <s>{lang.max} {max}ms</s>
    </div>
  );
}
