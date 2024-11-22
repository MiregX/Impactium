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
  name,
  variant,
  size = 20,
  ...props
}: Icon.Props) {
  const Component = Icon.icons[name];

  if (!Component) {
    return null;
  }
  
  if (name in custom_icons && !(name in lucide_icons)) {
    props.viewBox = '0 0 16 16';
    props.style = {
      ...props.style,
      color: props.color ?? iconVariants({ variant })}
  }

  return (
    <Component
      {...props}
      width={size}
      height={size}
      stroke={props.color ?? iconVariants({ variant })}
    />
  );
}

export namespace Icon {
  export const icons = {
    ...custom_icons,
    ...lucide_icons
  }

  export type Name = keyof typeof icons;

  export interface Props extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
    name: Name;
    size?: number;
  }

  export type Variant = Icon.Props['variant'];
}
