'use client'
import s from '@/styles/Login.module.css';
import { useLanguage } from "@/context/Language";
import { useEffect, useState } from "react";
import { RedirectButton } from '@/components/RedirectButton';
import { useUser } from '@/context/User';
import { redirect } from 'next/navigation';

export enum LoginMethod {
  github = 'github',
  discord = 'discord'
}

export default function LoginPage() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const [isNextStage, setNextStage] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      console.log(user)
      redirect('/');
    }
  }, [user]);

  return (
    <div className={s.loginWrapper}>
      <div className={`${s.loginBlock} ${s.one} ${s.login}`}>
        <h1 className={s.center}>{lang._login}</h1>
        <div className={`${s.form} ${s.grid} ${s.columns1} ${s.rows3}`}>
          <div className={s.inputGroup}>
            <label htmlFor="emailOrUsername">{lang.login.username_or_email}</label>
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
              <img src="https://cdn.impactium.fun/ui/user/user.svg" alt="user-icon" />
            </button>
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="password">{lang._password}</label>
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
              <img className={passwordVisibility ? s.disactive : ''} src="https://cdn.impactium.fun/ui/action/hide.svg" alt='' />
              <img className={!passwordVisibility ? s.disactive : ''} src="https://cdn.impactium.fun/ui/action/show.svg" alt='' />
            </button>
          </div>
          <button className={`${s.submit} ${s.baseButton} ${s.center}`} onClick={() => {setNextStage(true)}}>{lang._login}</button>
        </div>
        <div className={s.line} data-split={lang._or.toUpperCase()} />
        <div className={`${s.buttonsWrapper}`}>
          <RedirectButton type={LoginMethod.github} />
          <RedirectButton type={LoginMethod.discord} />
        </div>
        <p className={`${s.noAccount} ${s.center}`}>{lang.login.dont_have_an_account} <button onClick={() => { setNextStage(!isNextStage) }}>{lang._register}</button></p>
        <div className={`${s.loginBlock} ${s.two} ${isNextStage && s.active}`}>
          <img src="https://cdn.impactium.fun/el/skull.png" className={s.skull} alt="skull-icon" />
          <h2>{lang.login.nuhuh}</h2>
          <p>{lang.login.just_use_these_two}</p>
          <div className={`${s.buttonsWrapper}`}>
            <RedirectButton type={LoginMethod.github} />
            <RedirectButton type={LoginMethod.discord} />
          </div>
          <button className={`${s.closeStage}`} onClick={() => { setNextStage(!isNextStage) }}>
            <img src="https://cdn.impactium.fun/ui/close/sm.svg" alt="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};