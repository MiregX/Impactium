import React from 'react';
import input from './styles/Input.module.css'

interface Input {
  placeholder?: string
  image?: string
  label?: string
  type?: string
  value?: any
  onChange?: (value: any) => void
  accept?: string
  style?: string | string[]
}

export function Input({ accept, image, label, placeholder, style, value, type, onChange }: Input) {
  return (
    <div className={`${input._} ${typeof style === 'object' ? style.join(' ') : style}`}>
      {image && <span><img src={image} /></span>
      }
      <input
        placeholder={!label && placeholder}
        id={label}
        aria-label="Search"
        aria-invalid="false"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        accept={accept}
        value={value}
        type={type || 'default'}
        onChange={onChange}
        name='q' />
      {label && <label htmlFor={label}>
      {label && type !== 'file'
          ? placeholder
          : (<React.Fragment>
              <span><img src='https://cdn.impactium.fun/ui/cloud/upload.svg'/></span>
              <p>{placeholder}</p>
          </React.Fragment>)
        }</label>}
    </div>
  );
};
