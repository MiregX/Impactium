import React, { useState } from 'react';
import input from './styles/InputMin.module.css';
import { useLanguage } from '@/context/Language';

interface InputMinProps {
  value: string;
  before?: string;
  regExp: RegExp;
}

export function InputMin({ value: initialValue, before, regExp }: InputMinProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const { lang } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (regExp.test(newValue)) {
      setError('');
    } else {
      setError(lang.error.indent_invalid_format);
    }
    setValue(newValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={input.wrapper}>
      {before && <p>{before}</p>}
      <input 
        className={input._} 
        value={value} 
        onChange={handleChange} 
        onFocus={handleFocus}
      />
      {error && <p className={input.error}>{error}</p>}
    </div>
  );
}
