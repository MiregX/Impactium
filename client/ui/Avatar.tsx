import Image from 'next/image';
import s from './styles/Avatar.module.css';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { cn } from '@impactium/utils';

export namespace Avatar {
  export interface Props extends HTMLAttributes<HTMLDivElement> {
    size: number | `${number}`
    src: string | null | undefined;
    alt: string
    fallback?: ReactNode;
  }
}

export function Avatar({ size, src, alt, className, style, fallback, ...props }: Avatar.Props) {
  size = parseInt(`${size}`) - 2;
  const [err, setErr] = useState<boolean>(!src);

  useEffect(() => setErr(false), [src]);

  const λfallback = fallback ?? <p style={{fontSize: typeof size === 'string' ? parseInt(size) : size / 2.5}}>{alt?.slice(0, 2) || '?'}</p>

  return (
    <div
      className={cn(s.avatar, className)}
      style={{
        ...style,
        height: size,
        width: size,
        minHeight: size,
        minWidth: size
      }}
      {...props}>
      {src && !err
        ? <Image src={src} width={size} height={size} alt={alt.slice(0, 2)} onError={() => setErr(true)} />
        : λfallback}
    </div>
  );
}
