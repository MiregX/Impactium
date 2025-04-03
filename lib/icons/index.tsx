import { cva, VariantProps } from 'class-variance-authority';
import { icons as custom_icons } from './compilation';
import { icons as lucide_icons } from 'lucide-react';

export const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'currentColor',
      white: '#e8e8e8',
      dimmed: '#a1a1a1',
      black: '#0d0d0d',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Icon({
  name,
  variant,
  fromGeist,
  size = 16,
  ...props
}: Icon.Props) {
  const Component = typeof fromGeist === 'undefined'
    ? Icon.icons[name]
    : fromGeist
      ? custom_icons[name as keyof typeof custom_icons]
      : lucide_icons[name as keyof typeof lucide_icons]

  if (!Component) return null;

  if (!props.fill)
    props.fill = 'none';

  return (
    <Component
      width={size}
      height={size}
      {...props}
    />
  );
}

export namespace Icon {
  export const icons = {
    ...lucide_icons,
    ...custom_icons
  }

  export type Name = keyof typeof icons;

  export type Attributes = Record<string, string | Record<string, string>>;
  export type Node = [name: string, attrs: Attributes, ...childrens: Node[]];


  export interface Props extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
    name: Name;
    size?: number;
    fromGeist?: boolean;
  }

  export type Variant = Icon.Props['variant'];

  export type Size = Icon.Props['size'];
}
