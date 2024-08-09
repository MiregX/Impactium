import _ from './styles/Panel.module.css'

interface Panel {
  heading: string;
  children: React.ReactNode | React.ReactNode[]
  className?: string[] | string;
}

export function Panel({ heading, children, className }: Panel) {
  return (
    <div className={`${_._} ${useClasses(className)}`}>
      <h4>{heading}</h4>
      <div className={_.content}>
        {children}
      </div>
    </div>
  );
}
