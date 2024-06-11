'use client'
import { useApplication } from '@/context/Application';
import button from './styles/Button.module.css';
import Link from 'next/link';
import React from 'react';
import { redirect } from 'next/navigation';

export enum GeistButtonTypes {
  Link = 'link',
  Button = 'button'
}

export type GeistButton = {
  type: GeistButtonTypes;
  text: string;
  do?: string | (() => void);
  img?: string;
  focused?: boolean;
  minimized?: boolean;
  style?: string[];
}

export function GeistButton({ options }: { options: GeistButton }) {
  const { destroyBanner } = useApplication();
  options.do = options.do || destroyBanner

  return (
    options.type === GeistButtonTypes.Link ? (
      <Link
        className={`
          ${button._}
          ${options.focused && button.focus}
          ${options.minimized && button.min}
          ${options.style?.join(' ')}`}
        href={typeof options.do === 'string' ? options.do : '#'}>
        {options.img && <img src={options.img} />} 
        {options.text}
      </Link>
    ) : (
      <button
        className={`
          ${button._}
          ${options.focused && button.focus}
          ${options.minimized && button.min}
          ${options.style?.join(' ')}`}
        onClick={typeof options.do === 'function' ? options.do : redirect(options.do)}>
        {options.img && <img src={options.img} />} 
        {options.text}
      </button>
    )
  );
}
