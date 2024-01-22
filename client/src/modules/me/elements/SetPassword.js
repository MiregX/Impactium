import React, { useRef } from 'react';
import './SetPassword.css'; // Замените на фактический файл CSS
import { useLanguage } from '../../language/Lang';
import { usePlayer } from '../../../class/Player';

const SetPassword = () => {
  const { lang } = useLanguage();
  const { player, setPassword } = usePlayer();
  const passwordField = useRef(null) 

  return (
    <div className={`default_panel_style dynamic ${player.registered ? '' : 'blocked'} setPassword`}>
      <div className="flex panel-header align-center">
        <p>{lang.changePassword}</p>
      </div>

      <p id="passwordUpdateOnErrorMessageContainer"></p>

      <div className="flex panel-footer" style={{ gap: '8px' }}>
        <input
          ref={passwordField}
          type="password"
          id="passwordField"
          value={player.password}
          placeholder={lang.enterNewPassword}
        />

        <div onClick={() => {setPassword(passwordField.current.value)}} className="change_profile save-button" tooverlayview="true">
          {lang.confirm}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
