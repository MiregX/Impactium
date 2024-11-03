import { useEffect, useMemo, useState } from 'react';
import s from './styles/Noise.module.css';

export function Noise() {
  const [index, setIndex] = useState(0);

  const noises = useMemo(() => Array.from({ length: 8 }, (_, i) => (
    <svg key={i} className={s.noise}>
      <filter id={`noiseFilter-${i}`}>
        <feTurbulence seed={i + 1} type="fractalNoise" baseFrequency={0.3} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#noiseFilter-${i})`} />
    </svg>
  )), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % noises.length);
    }, 128);

    return () => clearInterval(interval);
  }, [noises.length]);

  return noises[index];
}
