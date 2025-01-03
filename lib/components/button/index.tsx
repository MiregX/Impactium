import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@impactium/utils";
import s from "./button.module.css";
import { Loading } from "../loading";
import { Icon } from "@impactium/icons";

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
    rounded?: boolean;
  }

  export type Variant = Props['variant'];

  export type Size = Props['size'];
}

const Button = React.forwardRef<HTMLButtonElement, Button.Props>(
  ({ className, variant, rounded, size, img, revert, disabled, loading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const paddingClass = img ? (props.children ? (revert ? s.revert : s.withImage) : s.onlyImage) : null;

    const children = !asChild && props.children;

    if (!size && img && !children) {
      size = 'icon'
    }

    const λvariant = convertButtonVariantToImageVariant(variant);
    const λsize = convertButtonVariantToIconSize(size);

    return (
      <Comp
        className={cn(buttonVariants({ variant: disabled ? 'disabled' : variant, size, className }), paddingClass, loading && s.loading, rounded && s.rounded)}
        ref={ref}
        {...props}>
        {asChild ? props.children : (loading
          ? <Loading variant={λvariant} size={size} />
          : <>
              {img && <Icon name={img} size={λsize} />}
              {children}
            </>
        )}
      </Comp>
    )
  }
);
Button.displayName = "Button";

const convertButtonVariantToImageVariant = (variant: Button.Variant): Icon.Variant => ({
  default: 'black',
  destructive: 'white',
  outline: 'dimmed',
  secondary: 'white',
  ghost: 'dimmed',
  link: 'white',
  disabled: 'dimmed',
  hardline: 'white',
  glass: 'dimmed'
} as Record<NonNullable<Button.Variant>, Icon.Variant>)[variant!] ?? 'black';

const convertButtonVariantToIconSize = (size: Button.Size): Icon.Size => ({
  default: 16,
  sm: 12,
  lg: 20,
  icon: 16,
} as Record<NonNullable<Button.Size>, Icon.Size>)[size || 'default'];


export { Button, buttonVariants };
