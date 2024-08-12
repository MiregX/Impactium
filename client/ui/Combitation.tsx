import { Skeleton } from '@/ui/Skeleton';
import { Avatar } from './Avatar'
import s from './styles/Combination.module.css'
import { cva, VariantProps } from 'class-variance-authority';

const { heading, combination } = s;

const combinationVariants = cva(combination, {
  variants: {
    variant: {
      default: s.default
    },
    size: {
      default: undefined,
      heading
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type CombinationProps = CombinationSkeletonProps & {
  src: string | null | undefined;
  name: string;
  id: string
};

type CombinationSkeletonProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof combinationVariants>;

export function Combination({ src, name, className, size, id, children, ...props }: CombinationProps) {
  return (
    <div className={combinationVariants({ className, size })} {...props}>
      <Avatar size={size === 'heading' ? 64 : 36} src={src} alt={name} />
      <div className={s.group}>
        <p className={s.name}>{name}</p>
        {id && <p className={s.id}>@{id}</p>}
      </div>
    </div>
  )
}

export function CombinationSkeleton({children, className, size, ...props}: CombinationSkeletonProps) {
  return (
    <div className={combinationVariants({ className, size })} {...props}>
      <Skeleton variant='avatar' />
      <div className={s.group}>
        <Skeleton className={s.name} />
        <Skeleton className={s.id} size='short' />
      </div>
    </div>
  )
}