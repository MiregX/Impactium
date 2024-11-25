import { createElement, forwardRef, RefAttributes, SVGProps } from 'react';
import { Icon } from './index';

export const renderChildren = ([name, attrs, ...children]: Icon.Node): React.ReactNode => createElement(
  name,
  attrs,
  children.map(renderChildren)
)

export const create = (name: string, children: Icon.Node[]) => {
  const Component = forwardRef<SVGSVGElement, RefAttributes<SVGSVGElement> & Partial<SVGProps<SVGSVGElement>>>(
    (props, ref) => createElement('svg', {
      ref,
      name,
      ...props,
      children: children.map(renderChildren),
    })
  );
  
  Component.displayName = name;
  return Component;
};