import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@impactium/utils';
import s from './button.module.css';
import { Icon } from '@impactium/icons';
import { Spinner } from './spinner';

const buttonVariants = cva(s.button, {
  variants: {
    variant: {
      default: s.default,
      destructive: s.destructive,
      outline: s.outline,
      secondary: s.secondary,
      ghost: s.ghost,
      link: s.link,
      disabled: s.disabled,
      hardline: s.hardline,
      glass: s.glass
    },
    size: {
      default: s.defaultSize,
      sm: s.sm,
      lg: s.lg,
      icon: s.icon,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export namespace Button {
  export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    img?: Icon.Name;
    revert?: boolean;
    loading?: boolean;
    placeholder?: string;
    rounded?: boolean;
  }

  export type Variant = Props['variant'];

  export type Size = Props['size'];
}

const Button = React.forwardRef<HTMLButtonElement, Button.Props>(
  ({ className, variant, rounded, size, img, revert, disabled, loading, asChild = false, placeholder, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const paddingClass = img ? (props.children ? (revert ? s.revert : s.withImage) : s.onlyImage) : null;

    const children = !asChild && props.children;

    if (!size && img && !children) {
      size = 'icon'
    }

    const color = convertButtonVariantToSpinnerColor(variant);
    const λsize = convertButtonVariantToIconSize(size);

    return (
      <Comp
        className={cn(buttonVariants({ variant: disabled ? 'disabled' : variant, size, className }), paddingClass, loading && s.loading, rounded && s.rounded)}
        ref={ref}
        {...props}>
        {asChild ? props.children : (loading
          ? (
            <>
              <Spinner color={color} size={λsize + 4} />
              {size !== 'icon' ? placeholder ?? 'Loading...' : null}
            </>
          )
          : <>
            {img && <Icon name={img} size={λsize} />}
            {children}
          </>
        )}
      </Comp>
    )
  }
);
Button.displayName = 'Button';

const convertButtonVariantToSpinnerColor = (variant: Button.Variant): string => ({
  default: 'black',
  destructive: 'white',
  outline: 'var(--gray-700)',
  secondary: 'white',
  ghost: 'var(--gray-700)',
  link: 'white',
  disabled: 'var(--gray-700)',
  hardline: 'white',
  glass: 'var(--gray-700)'
})[variant ?? 'default'];

const convertButtonVariantToIconSize = (size: Button.Size): NonNullable<Icon.Size> => ({
  default: 16,
  sm: 12,
  lg: 20,
  icon: 16,
})[size ?? 'default'];


export { Button, buttonVariants };
