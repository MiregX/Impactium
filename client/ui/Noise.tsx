import { useCallback } from 'react';
import s from './styles/Noise.module.css';

export function Noise() {
  const Noise = useCallback(() => (
    <svg className={s.noise}>
      <filter id='noise'>
        <feTurbulence seed={128} type='fractalNoise' baseFrequency={1} />
      </filter>
      <rect width='100%' height='100%' filter={`url(#noise)`} />
    </svg>
  ), []);

  return <Noise />;
}
