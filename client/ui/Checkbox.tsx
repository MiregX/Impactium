'use client'
import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import s from './styles/Checkbox.module.css';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      s.root,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={s.indicator}
    >
      <Icon name='Check' variant='black' className={s.icon} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
