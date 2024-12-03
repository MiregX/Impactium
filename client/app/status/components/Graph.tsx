import { cn } from '@/lib/utils';
import s from './styles/Graph.module.css';
import { HTMLAttributes } from 'react';

export namespace Graph {
  export interface Props extends HTMLAttributes<HTMLDivElement> {
    
  }
}

export function Graph({ className, ...props }: Graph.Props) {
  return (
    <div className={cn(className, s.graph)}>

    </div>
  )
}