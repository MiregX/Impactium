import { cn } from '@impactium/utils';
import s from './styles/Graph.module.css';
import { HTMLAttributes } from 'react';
import { Loading, Stack } from '@impactium/components';

export namespace Graph {
  export interface Props extends HTMLAttributes<HTMLDivElement> {
    loading?: boolean;
  }
}

export function Graph({ className, loading, children, ...props }: Graph.Props) {
  return (
    <div className={s.graph} {...props}>
      <Stack className={cn(s.content, className)} data-content dir='column' ai='flex-start'>
        {loading ? <Loading jc='center' className={s.loading} size='icon' variant='white' /> : children}
      </Stack>
    </div>
  )
}