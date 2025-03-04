import React, { forwardRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import s from './styles/Separator.module.css';
import { cn } from '@impactium/utils';

type SeparatorPrimitive = React.ElementRef<typeof SeparatorPrimitive.Root>;
type ComponentPropsWithoutRef = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

const Separator = forwardRef<SeparatorPrimitive, ComponentPropsWithoutRef>(({ className, orientation = 'horizontal', decorative = true, color, ...props }, ref) => (
  <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        s.separator,
        s[orientation],
        className
      )}
      style={{ color }}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
