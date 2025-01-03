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

  if (!Component) {
    return null;
  }
  
  if (fromGeist || name in custom_icons && !(name in lucide_icons)) {
    props.viewBox = '0 0 16 16';
    props.fill = 'none';
    props.color = props.color ?? iconVariants({ variant });
  } else {
    props.stroke = props.color ?? iconVariants({ variant });
  }

  if (name.startsWith('Acronym')) {
    props.viewBox = '0 0 20 16';
    if (name === 'AcronymPage') {
      props.viewBox = '0 0 28 16';
      props.width = '28px'
    }
  }

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
    ...custom_icons,
    ...lucide_icons
  }

  export type Name = keyof typeof icons;
  
  export type Attributes = Record<string, string>;
  export type Node = [name: string, attrs: Attributes, ...childrens: Node[]];

  export interface Props extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
    name: Name;
    size?: number;
    fromGeist?: boolean;
  }

  export type Variant = Icon.Props['variant'];

  export type Size = Icon.Props['size'];
}
