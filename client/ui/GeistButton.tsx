import button from './styles/BaseButton.module.css';
import Link from 'next/link';
import React from 'react';

export enum GeistButtonTypes {
  Link = 'link',
  Button = 'button'
}

export type GeistButton = {
  type: GeistButtonTypes.Button;
  action: () => void;
  text: string;
  focused?: boolean;
} | {
  type: GeistButtonTypes.Link;
  href: string;
  text: string;
  minimized?: boolean;
};

export function GeistButton({ options }: { options: GeistButton }) {
  return (
    options.type === GeistButtonTypes.Link ? (
      <Link className={`${button._} ${options.minimized && button.min}`} href={options.href}>
        {options.text}
      </Link>
    ) : (
      <button className={`${button._} ${options.focused && button.focus}`} onClick={options.action}>
        {options.text}
      </button>
    )
  );
}
