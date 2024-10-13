import { Skeleton } from '@/ui/Skeleton';
import { Avatar } from './Avatar'
import s from './styles/Combination.module.css'
import { cva, VariantProps } from 'class-variance-authority';

const { heading, combination, full } = s;

const combinationVariants = cva(combination, {
  variants: {
    variant: {
      default: s.default
    },
    size: {
      default: undefined,
      heading,
      full
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type CombinationProps = CombinationSkeletonProps & {
  src: string | null | undefined;
  name: string;
  id: string;
};

interface CombinationSkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof combinationVariants> {
  button?: boolean
};

export function Combination({ src, name, className, onClick, size, id, children, ...props }: CombinationProps) {
  return (
    <div className={combinationVariants({ className, size })} {...props}>
      <Avatar size={size === 'heading' ? 64 : 36} onClick={onClick} src={src} alt={name} />
      <div className={s.group}>
        <p className={s.name}>{name}</p>
        {id && <p className={s.id}>@{id}</p>}
      </div>
    </div>
  )
}

export function CombinationSkeleton({children, button, className, size, ...props}: CombinationSkeletonProps) {
  return (
    <div className={combinationVariants({ className, size })} {...props}>
      <Skeleton variant='avatar' />
      <div className={s.group}>
        <Skeleton className={s.name} />
        <Skeleton className={s.id} size='short' />
      </div>
      {button && <Skeleton className={s.button} variant='button' />}
    </div>
  )
}