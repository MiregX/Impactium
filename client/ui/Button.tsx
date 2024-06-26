'use client'
import { useApplication } from '@/context/Application';
import button from './styles/Button.module.css';
import Link from 'next/link';
import React from 'react';
import { redirect } from 'next/navigation';

export enum ButtonTypes {
  Link = 'link',
  Button = 'button'
}

export type Button = {
  type: ButtonTypes;
  text: string;
  do?: string | (() => void);
  img?: string;
  focused?: boolean;
  minimized?: boolean;
  className?: string | string[] | false;
  loading?: boolean;
  disabled?: boolean; 
}

export function Button({ options }: { options: Button }) {
  const { destroyBanner } = useApplication();
  options.do = options.do || destroyBanner

  return (
    options.type === ButtonTypes.Link ? (
      <Link
        className={`
          ${button._}
          ${useOptionStyling(options, button)}
          ${useClasses(options.className)}`}
        href={typeof options.do === 'string' ? options.do : '#'}>
        {options.img && <img src={options.img} />} 
        {options.text}
      </Link>
    ) : (
      <button
        className={`
          ${button._}
          ${useOptionStyling(options, button)}
          ${useClasses(options.className)}`}
        onClick={typeof options.do === 'function' ? options.do : redirect(options.do)}>
        {options.img && <img src={options.img} />} 
        {options.text}
      </button>
    )
  );
}
