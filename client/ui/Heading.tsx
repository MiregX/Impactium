import _ from './styles/Heading.module.css';

export function Heading({ children, ...opt }) {
  return (
    <div className={`${_._} ${opt?.style?.join(' ')}`}>
      {children}
    </div>
  );
};
