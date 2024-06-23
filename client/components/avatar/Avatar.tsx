import Image from 'next/image';
import s from './Avatar.module.css';
import { MouseEventHandler } from 'react';

interface Avatar {
  size: number | `${number}`
  src: string
  alt: string
  onClick?: MouseEventHandler
  className?: string | string[]
}

export function Avatar({ size, src, alt, onClick, className }: Avatar) {
  return (
    <div className={`${s._} ${Array.isArray(className) ? className.join(' ') : className}`} onClick={onClick || null}>
      <Image src={src} width={size} height={size} alt={alt.substring(1)} />
    </div>
  );
}
