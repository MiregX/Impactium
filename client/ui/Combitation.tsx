import { Stack } from '@impactium/components';
import { Avatar } from './Avatar'
import s from './styles/Combination.module.css'
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { Skeleton as UISkeleton } from '@impactium/components';

export function Combination({ src, name, variant, className, onClick, fallback, size, id, children, ...props }: Combination.Props) {
  return (
    <Stack className={Combination.variants({ className, variant, size })} {...props}>
      <Avatar size={size === 'heading' ? 64 : 36} onClick={onClick} src={src} alt={name} fallback={fallback} />
      <Stack dir='column' jc='space-evenly' gap={2} flex>
        <p className={s.name}>{name}</p>
        {id && <p className={s.id}>@{id}</p>}
      </Stack>
    </Stack>
  )
}

export namespace Combination {
  export const variants = cva(s.combination, {
    variants: {
      variant: {
        default: s.default
      },
      size: {
        default: undefined,
        heading: s.heading,
        full: s.full,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

  export interface Props extends Stack.Props, VariantProps<typeof Combination.variants> {
    src: string | null | undefined;
    name: string;
    id: string;
    fallback?: ReactNode;
  }

  export namespace Skeleton {
    export interface Props extends Stack.Props, VariantProps<typeof Combination.variants> {
      button?: boolean;
    }
  }

  export function Skeleton({ children, variant, button, className, size, ...props}: Combination.Skeleton.Props) {
    return (
      <Stack className={Combination.variants({ className, variant, size })} {...props}>
        <UISkeleton variant='avatar' />
        <Stack dir='column' jc='space-evenly' gap={2} flex>
          <UISkeleton className={s.name} />
          <UISkeleton className={s.id} />
        </Stack>
        {button && <UISkeleton className={s.button} variant='button' />}
      </Stack>
    )
  }
}
