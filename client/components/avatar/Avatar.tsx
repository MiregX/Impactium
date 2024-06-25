import Image from 'next/image';
import s from './Avatar.module.css';
import { MouseEventHandler } from 'react';

interface Avatar {
  size: number | `${number}`
  src: string | null
  alt: string
  onClick?: MouseEventHandler
  className?: string | string[]
}

export function Avatar({ size, src, alt, onClick, className }: Avatar) {
  return (
    <div className={`${s._} ${Array.isArray(className) ? className.join(' ') : className}`} onClick={onClick || undefined}>
      {src && <Image src={src} width={size} height={size} alt={alt.substring(1)} />}
      {alt.substring(1)}
    </div>
  );
}
