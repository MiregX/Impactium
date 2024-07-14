'use client'
import Image from 'next/image'
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { Button } from "@/ui/Button"
import s from './styles/Carousel.module.css'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(s.relative, className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className={s.wrapper}>
      <div
        ref={ref}
        className={cn(
          s.content,
          orientation === "horizontal" ? s.h : s.v,
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        s.item,
        orientation === "horizontal" ? s.h : s.v,
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "hardline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  console.log('Disabled: ', !canScrollPrev)

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        s.prev,
        orientation === "horizontal"
          ? s.h
          : s.v,
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Image src='https://cdn.impactium.fun/ui/chevron/left-md.svg' width={16} height={16} alt='' />
      <span className={s.only_sr}>Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "hardline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  console.log('Disabled: ', !canScrollNext)
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        s.next,
        orientation === "horizontal"
          ? s.h
          : s.v,
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Image width={16} height={16} src='https://cdn.impactium.fun/ui/chevron/right-md.svg' alt='' />
      <span className={s.only_sr}>Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}



// "use client"

// import * as React from "react"
// import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/ui/Button"
// import styles from './styles/Carousel.module.css'

// type CarouselApi = UseEmblaCarouselType[1]
// type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
// type CarouselOptions = UseCarouselParameters[0]
// type CarouselPlugin = UseCarouselParameters[1]

// type CarouselProps = {
//   opts?: CarouselOptions
//   plugins?: CarouselPlugin
//   orientation?: "horizontal" | "vertical"
//   setApi?: (api: CarouselApi) => void
// }

// type CarouselContextProps = {
//   carouselRef: ReturnType<typeof useEmblaCarousel>[0]
//   api: ReturnType<typeof useEmblaCarousel>[1]
//   scrollPrev: () => void
//   scrollNext: () => void
//   canScrollPrev: boolean
//   canScrollNext: boolean
// } & CarouselProps

// const CarouselContext = React.createContext<CarouselContextProps | null>(null)

// function useCarousel() {
//   const context = React.useContext(CarouselContext)

//   if (!context) {
//     throw new Error("useCarousel must be used within a <Carousel />")
//   }

//   return context
// }

// const Carousel = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & CarouselProps
// >(
//   (
//     {
//       orientation = "horizontal",
//       opts,
//       setApi,
//       plugins,
//       className,
//       children,
//       ...props
//     },
//     ref
//   ) => {
//     const [carouselRef, api] = useEmblaCarousel(
//       {
//         ...opts,
//         axis: orientation === "horizontal" ? "x" : "y",
//       },
//       plugins
//     )
//     const [canScrollPrev, setCanScrollPrev] = React.useState(false)
//     const [canScrollNext, setCanScrollNext] = React.useState(false)

//     const onSelect = React.useCallback((api: CarouselApi) => {
//       if (!api) {
//         return
//       }

//       setCanScrollPrev(api.canScrollPrev())
//       setCanScrollNext(api.canScrollNext())
//     }, [])

//     const scrollPrev = React.useCallback(() => {
//       api?.scrollPrev()
//     }, [api])

//     const scrollNext = React.useCallback(() => {
//       api?.scrollNext()
//     }, [api])

//     const handleKeyDown = React.useCallback(
//       (event: React.KeyboardEvent<HTMLDivElement>) => {
//         if (event.key === "ArrowLeft") {
//           event.preventDefault()
//           scrollPrev()
//         } else if (event.key === "ArrowRight") {
//           event.preventDefault()
//           scrollNext()
//         }
//       },
//       [scrollPrev, scrollNext]
//     )

//     React.useEffect(() => {
//       if (!api || !setApi) {
//         return
//       }

//       setApi(api)
//     }, [api, setApi])

//     React.useEffect(() => {
//       if (!api) {
//         return
//       }

//       onSelect(api)
//       api.on("reInit", onSelect)
//       api.on("select", onSelect)

//       return () => {
//         api?.off("select", onSelect)
//       }
//     }, [api, onSelect])

//     return (
//       <CarouselContext.Provider
//         value={{
//           carouselRef,
//           api: api,
//           opts,
//           orientation:
//             orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
//           scrollPrev,
//           scrollNext,
//           canScrollPrev,
//           canScrollNext,
//         }}
//       >
//         <div
//           ref={ref}
//           onKeyDownCapture={handleKeyDown}
//           className={cn(styles.carouselContainer, className)}
//           role="region"
//           aria-roledescription="carousel"
//           {...props}
//         >
//           {children}
//         </div>
//       </CarouselContext.Provider>
//     )
//   }
// )
// Carousel.displayName = "Carousel"

// const CarouselContent = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => {
//   const { carouselRef, orientation } = useCarousel()

//   return (
//     <div ref={carouselRef} className={styles.carouselContent}>
//       <div
//         ref={ref}
//         className={cn(
//           orientation === "horizontal" ? styles.carouselInnerHorizontal : styles.carouselInnerVertical,
//           className
//         )}
//         {...props}
//       />
//     </div>
//   )
// })
// CarouselContent.displayName = "CarouselContent"

// const CarouselItem = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => {
//   const { orientation } = useCarousel()

//   return (
//     <div
//       ref={ref}
//       role="group"
//       aria-roledescription="slide"
//       className={cn(
//         styles.carouselItem,
//         orientation === "horizontal" ? styles.carouselItemHorizontal : styles.carouselItemVertical,
//         className
//       )}
//       {...props}
//     />
//   )
// })
// CarouselItem.displayName = "CarouselItem"

// const CarouselPrevious = React.forwardRef<
//   HTMLButtonElement,
//   React.ComponentProps<typeof Button>
// >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
//   const { orientation, scrollPrev, canScrollPrev } = useCarousel()

//   return (
//     <Button
//       ref={ref}
//       variant={variant}
//       size={size}
//       img='https://cdn.impactium.fun/ui/chevron/left-md.svg'
//       className={cn(
//         styles.buttonCommon,
//         orientation === "horizontal"
//           ? styles.buttonHorizontalPrev
//           : styles.buttonVerticalPrev,
//         className
//       )}
//       disabled={!canScrollPrev}
//       onClick={scrollPrev}
//       {...props}
//     />
//   )
// })
// CarouselPrevious.displayName = "CarouselPrevious"

// const CarouselNext = React.forwardRef<
//   HTMLButtonElement,
//   React.ComponentProps<typeof Button>
// >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
//   const { orientation, scrollNext, canScrollNext } = useCarousel()

//   return (
//     <Button
//       ref={ref}
//       variant={variant}
//       size={size}
//       img='https://cdn.impactium.fun/ui/chevron/right-md.svg'
//       className={cn(
//         styles.buttonCommon,
//         orientation === "horizontal"
//           ? styles.buttonHorizontalNext
//           : styles.buttonVerticalNext,
//         className
//       )}
//       disabled={!canScrollNext}
//       onClick={scrollNext}
//       {...props}
//     />
//   )
// })
// CarouselNext.displayName = "CarouselNext"

// export {
//   type CarouselApi,
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// }
