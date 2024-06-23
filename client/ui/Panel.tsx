import _ from './styles/Panel.module.css'

interface Panel {
  heading: string;
  children: React.JSX.Element
  className?: string[] | string;
}

export function Panel({ heading, children, className }: Panel) {
  return (
    <div className={`${_._} ${UseClasses(className)}`}>
      <h4>{heading}</h4>
      <div className={_.content}>
        {children}
      </div>
    </div>
  );
}
