import _ from './styles/Panel.module.css'

interface Panel {
  heading: string;
  children: React.JSX.Element
  styles?: string[];
}

export function Panel({ heading, children, styles }: Panel) {
  return (
    <div className={`${_._} ${styles && styles.join(' ')}`}>
      <h4>{heading}</h4>
      <div className={_.content}>
        {children}
      </div>
    </div>
  );
}
