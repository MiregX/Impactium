import React, { useEffect, useState, useRef } from 'react';
import './Login.css';
import { useLanguage } from '../language/Lang';
import { useUser } from '../../class/User';
import { Outlet } from 'react-router-dom';

function Login() {
  const [isNextStage, setNextStage] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [previousPage, setPreviousPage] = useState(localStorage.getItem('previousPage') || false);
  const stageTwo = useRef(null);
  const password = useRef(null);
  const { lang } = useLanguage();
  const { token, setToken } = useUser();

  useEffect(() => {
    if (token) {
      setToken(false);
    }
  }, [setToken]);

  useEffect(() => {
    if (document.referrer.startsWith('https://impactium.fun')) {
      setPreviousPage(document.referrer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('previousPage', previousPage);
  }, [previousPage]);

  useEffect(() => {
    isNextStage
      ? stageTwo.current.classList.add('active')
      : stageTwo.current.classList.remove('active');
  }, [isNextStage]);

  return (
    <div id="stageOne" className="login_block one login">
      <h1 className="center">{lang.login}</h1>
      <div className="form grid columns-1 rows-3">
        <div className="input-group">
          <label htmlFor="emailOrUsername">{lang.usernameOrEmail}</label>
          <input type="text" id="emailOrUsername" name="emailOrUsername" className="base-button" placeholder="Some username" required />
          <button className="icon center">
            <img src="https://cdn.impactium.fun/ux/circle-user.svg" alt="user-icon" />
          </button>
        </div>
  
        <div className="input-group" ref={password}>
          <label htmlFor="password">{lang.password}</label>
          <input type={passwordVisibility ? `text` : `password`} id="password" name="password" className="base-button" placeholder="Password" required />
          <button className="icon pointer center" onClick={() => { setPasswordVisibility(!passwordVisibility) }}>
            <img className={passwordVisibility ? `disactive` : ""} src="https://cdn.impactium.fun/ux/eye-closed.svg" alt="closed-eye" />
            <img className={!passwordVisibility ? `disactive` : ""} src="https://cdn.impactium.fun/ux/eye-open.svg" alt="open-eye" />
          </button>
        </div>
        <button className="submit base-button center" onClick={() => { setNextStage(!isNextStage) }}>{lang.login}</button>
      </div>
      <div className='line'/>
      <div className="buttons-wrapper flex flex-dir-column">
        <a href="https://impactium.fun/api/oauth2/login/google" className="base-button google-login">
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
          <p>{lang.continueWithGoogle}</p>
        </a>
        <a href="https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&response_type=code&redirect_uri=https%3A%2F%2Fimpactium.fun%2Flogin%2Fcallback&scope=identify+email" className="base-button discord-login">
          <img src="https://cdn.impactium.fun/ux/discord-mark-white.svg" alt="discord-icon" />
          <p>{lang.continueWithDiscord}</p>
        </a>
      </div>
      <p className="no-account center">{lang.dontHaveAnAccount} <button onClick={() => {setNextStage(!isNextStage)}}>{lang.register}</button></p>
      <div id="stageTwo" ref={stageTwo} className="login_block two flex flex-dir-column align-center justify-center">
        <img src="https://cdn.impactium.fun/ux/skull.png" className="skull" alt="skull-icon" />
        <h2>{lang.nuhuh}</h2>
        <p>{lang.justUseTheseTwo}</p>
        <div className="buttons-wrapper flex flex-dir-row">
          <a href="https://impactium.fun/api/oauth2/login/google" className="base-button google-login">
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
          </a>
          <a href="https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&response_type=code&redirect_uri=https%3A%2F%2Fimpactium.fun%2Flogin%2Fcallback&scope=identify+email" className="base-button discord-login">
            <img src="https://cdn.impactium.fun/ux/discord-mark-white.svg" alt="discord-icon" />
          </a>
        </div>
        <button className="closeStage center pointer" onClick={() => {setNextStage(!isNextStage)}}>
          <img src="https://cdn.impactium.fun/ux/close.svg" alt="close-icon" />
        </button>
      </div>
      <Outlet previousPage={previousPage} />
    </div>
  );
};

export default Login;