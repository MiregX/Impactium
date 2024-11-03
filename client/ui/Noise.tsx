import { HTMLAttributes, useCallback } from 'react';
import s from './styles/Noise.module.css';
import { cn } from '@/lib/utils';

export interface NoiseProps extends HTMLAttributes<SVGSVGElement> {
  enable?: boolean;
}

export function Noise({ className, enable, ...props }: NoiseProps) {
  const Noise = useCallback(() => enable ? (
    <svg className={cn(className, s.noise)} {...props}>
      <filter id='noise'>
        <feTurbulence seed={128} type='fractalNoise' baseFrequency={0.8} />
      </filter>
      <rect width='100%' height='100%' filter={`url(#noise)`} />
    </svg>
  ) : null, [enable]);

  return <Noise />;
}
