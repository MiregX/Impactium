"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import s from './styles/slider.module.css';
import { cn } from "@impactium/utils";

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      s.root,
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={s.track}>
      <SliderPrimitive.Range className={s.range} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={s.thumb} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
