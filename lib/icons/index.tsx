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
  from,
  size = 20,
  ...props
}: Icon.Props) {
  const Component = !from
    ? Icon.icons[name]
    : from === 'geist'
      ? custom_icons[name as keyof typeof custom_icons]
      : lucide_icons[name as keyof typeof lucide_icons]

  if (!Component) {
    return null;
  }
  
  if (from === 'geist' || name in custom_icons && !(name in lucide_icons)) {
    props.viewBox = '0 0 16 16';
    props.fill = 'none';
    props.color = props.color ?? iconVariants({ variant });
  } else {
    props.stroke = props.color ?? iconVariants({ variant });
  }

  if (name.startsWith('Acronym')) {
    props.viewBox = '0 0 20 16';
  }

  return (
    <Component
      {...props}
      width={size}
      height={size}
    />
  );
}

export namespace Icon {
  export const icons = {
    ...custom_icons,
    ...lucide_icons
  }

  export type From = 'geist' | 'lucide';
  export type Name = keyof typeof icons;
  
  export type Attributes = Record<string, string>;
  export type Node = [name: string, attrs: Attributes, ...childrens: Node[]];

  export interface Props extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
    name: Name;
    size?: number;
    from?: From;
  }

  export type Variant = Icon.Props['variant'];
}
