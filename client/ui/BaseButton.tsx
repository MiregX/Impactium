import button from './styles/BaseButton.module.css';
import Link from 'next/link';
import React from 'react';

export enum BaseButtonTypes {
  link,
  button
}

interface BaseButton {
  type: BaseButtonTypes.button;
  action: Function;
  text: string;
  focused?: boolean
}

interface BaseLink {
  type: BaseButtonTypes.link;
  href: string;
  text: string;
  outline?: boolean;
}

export type BaseButtonOptions = BaseLink | BaseButton

export function BaseButton(options: BaseButtonOptions) {
  return (
    options.type === BaseButtonTypes.link
    ? <Link className={`${button._} ${!options.outline && button.min}`} href={options.href}>
        {options.text}
      </Link>
    : <button className={`${button._} ${options.focused && button.focus}`} onClick={() => options.action()}>
        {options.text}
      </button>
  );
}
