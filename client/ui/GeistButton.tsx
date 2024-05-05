'use client'
import { useMessage } from '@/context/Message';
import button from './styles/BaseButton.module.css';
import Link from 'next/link';
import React from 'react';

export enum GeistButtonTypes {
  Link = 'link',
  Button = 'button'
}

export type GeistButton = {
  type: GeistButtonTypes.Button;
  action?: () => void;
  text: string;
  focused?: boolean;
  minimized?: boolean;
  style?: string[];
} | {
  type: GeistButtonTypes.Link;
  href: string;
  text: string;
  minimized?: boolean;
  focused?: boolean;
  style?: string[];
};

export function GeistButton({ options }: { options: GeistButton }) {
  const { destroyBanner } = useMessage();
  options.type === GeistButtonTypes.Button
    ? options.action = options.action || destroyBanner
    : null;

  return (
    options.type === GeistButtonTypes.Link ? (
      <Link className={`${button._} ${options.focused && button.focus} ${options.minimized && button.min} ${options.style?.join(' ')}`} href={options.href}>
        {options.text}
      </Link>
    ) : (
      <button className={`${button._} ${options.focused && button.focus} ${options.minimized && button.min} ${options.style?.join(' ')}`} onClick={options.action}>
        {options.text}
      </button>
    )
  );
}
