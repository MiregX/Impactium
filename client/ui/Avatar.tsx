import Image from 'next/image';
import s from './styles/Avatar.module.css';
import { HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  size: number | `${number}`
  src: string | null | undefined;
  alt: string
}

export function Avatar({ size, src, alt, className, style, ...props }: AvatarProps) {
  size = parseInt(`${size}`) - 2;
  const [err, setErr] = useState<boolean>(!src);

  useEffect(() => setErr(false), [src]);

  const fallback = <p style={{fontSize: typeof size === 'string' ? parseInt(size) : size / 2.5}}>{alt?.slice(0, 2) || '?'}</p>

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
        : fallback}
    </div>
  );
}
