import React from "react"
import s from './styles/Input.module.css' 
import { cva, type VariantProps } from "class-variance-authority"; 
import { ui } from "@impactium/utils";
import { cn, λIcon } from "@/lib/utils";
import { icons } from "lucide-react";
import { Icon } from "./Icon";

const inputVariants = cva(s.button, {
  variants: {
    variant: {
      default: s.default,
      color: s.color
    },
    size: {
      default: s.defaultSize,
      sm: s.sm
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  img?: λIcon
  revert?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, revert, variant, type, itemRef, size, img, ...props }, ref) => {
    return img || type === 'file' ? (
      <div className={cn(
        inputVariants({ variant, size, className }),
        s.input,
        s.image,
        revert && s.revert
      )}
      ref={ref}>
        <Icon variant='dimmed' name={img || 'ImageUp'} />
        <input ref={ref} type={variant === 'color' ? 'color' : type} {...props} />
      </div>
    ) : (
      <input
        className={cn(
          inputVariants({ variant, size, className }),
          s.input,
          img && s.image
        )}
        type={variant === 'color' ? 'color' : type}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
 
export { Input }