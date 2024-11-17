import { cva, VariantProps } from 'class-variance-authority';
import { icons as custom_icons } from './compilation';
import { icons as lucide_icons } from 'lucide-react';

export const iconVariants = cva('', {
  variants: {
    variant: {
      white: '#e8e8e8',
      dimmed: '#a1a1a1',
      black: '#0d0d0d',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
});

export function Icon({
  name = 'Box',
  variant,
  color,
  size = 20,
  ...props
}: Icon.Props) {
  const Component = Icon.icons[name];

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...props}
      width={size}
      height={size}
      viewBox={name in custom_icons && '0 0 16 16' || undefined}
      stroke={color || iconVariants({ variant })}
    />
  );
}

export namespace Icon {
  export const icons = Object.assign(custom_icons, lucide_icons);

  export type Name = keyof typeof icons;

  export interface Props extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
    name: Name;
    size?: number;
  }

  export type Variant = Icon.Props['variant'];
}
