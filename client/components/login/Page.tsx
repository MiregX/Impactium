'use client'
import s from '@/styles/Login.module.css';
import { useLanguage } from "@/context/Language";
import { useState } from "react";

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
          <a href="https://impactium.fun/oauth2/login/google" className={`${s.baseButton} ${s.googleLogin}`}>
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
            <p>{lang.continueWithGoogle}</p>
          </a>
          <a href="https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&response_type=code&redirect_uri=https%3A%2F%2Fimpactium.fun%2Flogin%2Fcallback&scope=identify+email" className={`${s.baseButton} ${s.discordLogin}`}>
            <img src="https://cdn.impactium.fun/ux/discord-mark-white.svg" alt="discord-icon" />
            <p>{lang.continueWithDiscord}</p>
          </a>
        </div>
        <p className={`${s.noAccount} ${s.center}`}>{lang.dontHaveAnAccount} <button onClick={() => { setNextStage(!isNextStage) }}>{lang._register}</button></p>
        <div className={`${s.loginBlock} ${s.two} ${isNextStage && s.active}`}>
          <img src="https://cdn.impactium.fun/ux/skull.png" className={s.skull} alt="skull-icon" />
          <h2>{lang.nuhuh}</h2>
          <p>{lang.justUseTheseTwo}</p>
          <div className={`${s.buttonsWrapper}`}>
            <a href="https://impactium.fun/oauth2/login/google" className={`${s.baseButton} ${s.googleLogin}`}>
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
            </a>
            <a href="https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&response_type=code&redirect_uri=https%3A%2F%2Fimpactium.fun%2Flogin%2Fcallback&scope=identify+email" className={`${s.baseButton} ${s.discordLogin}`}>
              <img src="https://cdn.impactium.fun/ux/discord-mark-white.svg" alt="discord-icon" />
            </a>
          </div>
          <button className={`${s.closeStage}`} onClick={() => { setNextStage(!isNextStage) }}>
            <img src="https://cdn.impactium.fun/ux/close.svg" alt="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};