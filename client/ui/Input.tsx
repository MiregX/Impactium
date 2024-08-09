import React from "react"
import s from './styles/Input.module.css' 
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"; 

const inputVariants = cva(s.button, {
  variants: {
    variant: {
      default: s.default,
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
  img?: string;
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, loading, size, img, ...props }, ref) => {
    if (loading) {
      img = 'https://cdn.impactium.fun/ui/action/loading.svg'
    }
    return img ? (
      <div className={cn(
        inputVariants({ variant, size, className }),
        s.input,
        img && s.image,
        loading && s.loading
      )}>
        <img src={img} alt='' />
        <input ref={ref} {...props} />  
      </div>
    ) : (
      <input
        className={cn(
          inputVariants({ variant, size, className }),
          s.input,
          img && s.image
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
 
export { Input }
