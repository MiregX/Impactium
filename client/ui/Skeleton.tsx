import s from './styles/Skeleton.module.css'
import { cva, VariantProps } from "class-variance-authority";

const { avatar, short, icon } = s;

const skeletonVariants = cva(s.skeleton, {
  variants: {
    variant: {
      default: s.default,
      avatar
    },
    size: {
      default: s.defaultSize,
      short
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants> & {
  height?: number | `${number}`;
  width?: number | `${number}`
};

const Skeleton = ({
  className,
  variant,
  size,
  height = 14,
  width = 256,
  ...props
}: SkeletonProps) => {
  return (
    <div
    style={{ maxHeight: `${height}px`, maxWidth: `${width}px`}}
      className={skeletonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Skeleton }
