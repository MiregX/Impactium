import React from "react"
import s from './styles/Input.module.css' 
import { cva, type VariantProps } from "class-variance-authority"; 
import { cn } from "@/lib/utils";
import { Icon } from "@impactium/icons";

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
  img?: Icon.Name
  revert?: boolean
  valid?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, revert, valid = true, variant, type, itemRef, size, img, ...props }, ref) => {
    const classes = cn(
      inputVariants({ variant, size, className }),
      s.input,
      img || type === 'file' ? s.image : null,
      revert && s.revert,
      !valid && s.invalid
    );

    return img || type === 'file' ? (
      <div className={classes} datatype='input-wrapper' ref={ref}>
        <Icon variant='dimmed' datatype='input-icon' name={img || 'ImageUp'} />
        <input ref={ref} datatype='input-content' type={variant === 'color' ? 'color' : type} {...props} />
      </div>
    ) : (
      <input
        datatype='input-wrapper'
        className={classes}
        type={variant === 'color' ? 'color' : type}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
 
export { Input }