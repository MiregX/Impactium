'use client'
import s from '@/styles/Login.module.css';
import { useLanguage } from "@/context/Language";
import { useState } from "react";
import { RedirectButton } from './RedirectButton';

export type LoginMethod = 'google' | 'discord';


export function LoginPage() {
  const { lang } = useLanguage();
  const [isNextStage, setNextStage] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  return (
    <div className={s.loginWrapper}>
      <div className={`${s.loginBlock} ${s.one} ${s.login}`}>
        <h1 className={s.center}>{lang.login}</h1>
        <div className={`${s.form} ${s.grid} ${s.columns1} ${s.rows3}`}>
          <div className={s.inputGroup}>
            <label htmlFor="emailOrUsername">{lang.usernameOrEmail}</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              className={s.baseButton}
              placeholder="Some username"
              required
              autoComplete='new-password'
            />
            <button className={`${s.icon} ${s.center}`}>
              <img src="https://cdn.impactium.fun/ux/circle-user.svg" alt="user-icon" />
            </button>
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="password">{lang.passWord}</label>
            <input
              type={passwordVisibility ? 'text' : 'password'}
              id="password"
              name="password"
              className={s.baseButton}
              placeholder="Password"
              required
              autoComplete='new-password'
            />
            <button className={`${s.icon} ${s.pointer} ${s.center}`} onClick={() => { setPasswordVisibility(!passwordVisibility) }}>
              <img className={passwordVisibility ? s.disactive : ''} src="https://cdn.impactium.fun/ux/eye-closed.svg" alt="closed-eye" />
              <img className={!passwordVisibility ? s.disactive : ''} src="https://cdn.impactium.fun/ux/eye-open.svg" alt="open-eye" />
            </button>
          </div>
          <button className={`${s.submit} ${s.baseButton} ${s.center}`} onClick={() => {setNextStage(true)}}>{lang.login}</button>
        </div>
        <div className={s.line} />
        <div className={`${s.buttonsWrapper}`}>
          <RedirectButton type='google' />
          <RedirectButton type='discord' />
        </div>
        <p className={`${s.noAccount} ${s.center}`}>{lang.dontHaveAnAccount} <button onClick={() => { setNextStage(!isNextStage) }}>{lang._register}</button></p>
        <div className={`${s.loginBlock} ${s.two} ${isNextStage && s.active}`}>
          <img src="https://cdn.impactium.fun/ux/skull.png" className={s.skull} alt="skull-icon" />
          <h2>{lang.nuhuh}</h2>
          <p>{lang.justUseTheseTwo}</p>
          <div className={`${s.buttonsWrapper}`}>
            <RedirectButton type='google' />
            <RedirectButton type='discord' />
          </div>
          <button className={`${s.closeStage}`} onClick={() => { setNextStage(!isNextStage) }}>
            <img src="https://cdn.impactium.fun/ux/close.svg" alt="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};