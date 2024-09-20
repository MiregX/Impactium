import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { icons as Icons } from 'lucide-react';

export const iconVariants = cva('', {
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

export interface IconProps extends React.ImgHTMLAttributes<SVGSVGElement>, VariantProps<typeof iconVariants> {
  name: keyof typeof Icons;
  size?: number;
}

export function Icon({ name = 'BoxSelect', color, variant, className, size = 20, ...props }: IconProps) {
  const Icon = Icons[name!];

  return <Icon {...props} size={size} stroke={color || iconVariants({ variant })} />
}
