import Image from 'next/image';
import s from './styles/Avatar.module.css';
import { MouseEventHandler, useState } from 'react';

interface Avatar {
  size: number | `${number}`
  src: string | null | undefined;
  alt: string
  onClick?: MouseEventHandler
  className?: string | string[]
}

export function Avatar({ size, src, alt, onClick, className }: Avatar) {
  const [err, setErr] = useState<boolean>(!src);
  const fallback = <p style={{fontSize: typeof size === 'string' ? parseInt(size) : size / 2.5}}>{alt.slice(0, 2)}</p>
  
  return (
    <div
      className={`${s._} ${Array.isArray(className) ? className.join(' ') : className}`}
      onClick={onClick || undefined}
      style={{
        height: size,
        width: size
      }}>
      {src && !err
        ? <Image src={src} width={size} height={size} alt={alt.slice(0, 2)} onError={() => setErr(true)} />
        : fallback}
    </div>
  );
}
