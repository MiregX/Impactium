import { useCallback, useEffect, useState } from "react";

export function Noise() {
  const [seed, setSeed] = useState<number>(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(Math.round(Math.random() * 10));
    }, 128);
    return () => clearInterval(interval);
  }, []);

  const Noise = useCallback(() => (
    <svg style={{
      position: 'absolute',
      height: '100%',
      width: '100%',
      mixBlendMode: 'overlay',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      opacity: 0.1,
      filter: 'brightness(0.3)',
    }}>
      <filter id="noiseFilter">
        <feTurbulence seed={seed} type="fractalNoise" baseFrequency={0.3} />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  ), [seed]);
  
  return <Noise />
}
