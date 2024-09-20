import { cva, VariantProps } from 'class-variance-authority';
import NextImage from 'next/image';
import React from 'react';

export const imageVariants = cva('', {
  variants: {
    variant: {
      white: '#e8e8e8',
      dimmed: '#a1a1a1',
      black: '#0d0d0d'
    }
  },
  defaultVariants: {
    variant: 'white'
  },
});

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLOrSVGImageElement>, 'src'>, VariantProps<typeof imageVariants> {
  src?: React.ReactElement | string;
  size?: number;
}

export function Image({ src, variant, className, size = 20, ...props }: ImageProps) {
  if (!src) return null;

  return typeof src === 'string'
    ? <NextImage
        {...props}
        className={imageVariants({ variant, className })}
        src={src}
        height={size}
        width={size}
        alt=''
      />
    : React.cloneElement(src, {
      ...props,
      width: size,
      height: size,
      stroke: imageVariants({ variant })
    });
}
