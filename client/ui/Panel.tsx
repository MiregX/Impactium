import { cn } from '@/lib/utils';
import _ from './styles/Panel.module.css'

interface Panel {
  heading: string | React.ReactNode;
  children: React.ReactNode | React.ReactNode[]
  className?: string[] | string;
}

export function Panel({ heading, children, className }: Panel) {
  return (
    <div className={cn(_.panel, className)}>
      {typeof heading === 'string' ? <h4>{heading}</h4> : heading}
      <div className={_.content}>
        {children}
      </div>
    </div>
  );
}
