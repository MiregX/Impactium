import * as React from "react"
import s from './styles/card.module.css';
import { cn } from "@impactium/utils"

export namespace Card {
  export const Root = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        s.card,
        className
      )}
      {...props}
    />
  ));
  Root.displayName = 'Root'

  export const Header = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(s.header, className)}
      {...props}
    />
  ))
  Header.displayName = "Header"

  export const Title = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        s.title,
        className
      )}
      {...props}
    />
  ))
  Title.displayName = "Title"

  export const Description = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(s.description, className)}
      {...props}
    />
  ))
  Description.displayName = "Description"

  export const Content = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(s.content, className)} {...props} />
  ))
  Content.displayName = "Content"

  export const Footer = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(s.footer, s.content, className)}
      {...props}
    />
  ))
  Footer.displayName = "Footer"
}
