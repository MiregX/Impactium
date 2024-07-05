import React, { useState } from 'react';
import input from './styles/InputMin.module.css';
import { useLanguage } from '@/context/Language.context';

interface InputMinProps {
  state: string;
  setState: (value: string) => void
  before?: string;
  regExp: {
    test: RegExp,
    message: string
  };
}

export function InputMin({ state, setState, before, regExp }: InputMinProps) {
  const [error, setError] = useState('');
  const { lang } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setError(regExp.test.test(newValue) ? '' : regExp.message);

    setState(newValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={input.wrapper}>
      {before && <p>{before}</p>}
      <input 
        className={input._} 
        value={state} 
        onChange={handleChange} 
        onFocus={handleFocus}
      />
      {error && <p className={input.error}>{error}</p>}
    </div>
  );
}
