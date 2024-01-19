import React, { useEffect, useState, useRef } from 'react';
import './Login.css';
import { useLanguage } from '../Lang';
import { useUser } from '../../class/User';

function Login() {
  const [isNextStage, setNextStage] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const stageTwo = useRef(null);
  const password = useRef(null);
  const { lang } = useLanguage();
  const { setToken } = useUser();

  useEffect(() => {
    setToken();
  }, [setToken]);

  useEffect(() => {
    isNextStage
      ? stageTwo.current.classList.add('active')
      : stageTwo.current.classList.remove('active');
  }, [isNextStage]);

  return (
    <div id="stageOne" className="stage one">
      <h1 className="center">{lang.login}</h1>
      <div className="form grid columns-1 rows-3">
        <div className="input-group">
          <label htmlFor="emailOrUsername">{lang.usernameOrEmail}</label>
          <input type="text" id="emailOrUsername" name="emailOrUsername" className="base-button" placeholder="Some username" required />
          <button className="icon center">
            <img src="/static/images/circle-user.svg" alt="user-icon" />
          </button>
        </div>
  
        <div className="input-group" ref={password}>
          <label htmlFor="password">Password:</label>
          <input type={passwordVisibility ? `text` : `password`} id="password" name="password" className="base-button" placeholder="Password" required />
          <button className="icon pointer center" onClick={() => { setPasswordVisibility(!passwordVisibility) }}>
            <img className={passwordVisibility ?? `disactive`} src="/static/images/eye-closed.svg" alt="closed-eye" />
            <img className={!passwordVisibility ?? `disactive`} src="/static/images/eye-open.svg" alt="open-eye" />
          </button>
        </div>
        <button className="submit base-button center" onClick={() => { setNextStage(!isNextStage) }}>{lang.login}</button>
      </div>
      <hr />
      <div className="buttons-wrapper flex flex-dir-column">
        <a href="/oauth2/login/google" className="base-button google-login">
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
          <p>{lang.continueWithGoogle}</p>
        </a>
        <a href="/oauth2/login/discord" className="base-button discord-login">
          <img src="/static/images/discord-mark-white.svg" alt="discord-icon" />
          <p>{lang.continueWithDiscord}</p>
        </a>
      </div>
      <p className="no-account center">{lang.dontHaveAnAccount} <button onClick={() => {setNextStage(!isNextStage)}}>{lang.register}</button></p>
      <div id="stageTwo" ref={stageTwo} className="stage two flex flex-dir-column align-center justify-center">
        <img src="/static/images/skull.png" className="skull" alt="skull-icon" />
        <h2>{lang.nuhuh}</h2>
        <p>{lang.justUseTheseTwo}</p>
        <div className="buttons-wrapper flex flex-dir-row">
          <a href="/oauth2/login/google" className="base-button google-login">
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google-icon" />
          </a>
          <a href="/oauth2/login/discord" className="base-button discord-login">
            <img src="/static/images/discord-mark-white.svg" alt="discord-icon" />
          </a>
        </div>
        <button className="closeStage center pointer" onClick={() => {setNextStage(!isNextStage)}}>
          <img src="https://api.impactium.fun/ux/close.svg" alt="close-icon" />
        </button>
      </div>
    </div>
  );
};

export default Login;