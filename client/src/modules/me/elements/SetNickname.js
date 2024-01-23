import React, { useRef } from 'react';
import './SetNickname.css';
import { useLanguage } from '../../language/Lang';
import { usePlayer } from '../../../class/Player';

const SetNickname = () => {
  const { lang } = useLanguage();
  const { player, setNickname } = usePlayer();
  const nicknameField = useRef(null);
  const isDisabledNicknameChange = Date.now() - player.nicknameLastChangeTimestamp < 60 * 60 * 1000;

  return (
    <div className={`default_panel_style dynamic ${player.registered ? '' : 'blocked'} setNickname`}>
      <div className="flex panel-header align-center">
        <p>{lang.changeNickname}</p>

        {isDisabledNicknameChange && (
          <>
            <img src="https://api.impactium.fun/ux/timer.svg" alt="Timer" />
            <span id="nicknameTimer" timestamp={player.nicknameLastChangeTimestamp}></span>
          </>
        )}
      </div>

      <div className="flex panel-footer" style={{ gap: '8px' }}>
        <input
          ref={nicknameField}
          type="text"
          id="nicknameField"
          value={player.nickname}
          placeholder={lang.enterNickname}
          className={isDisabledNicknameChange ? 'no-pointers grayed' : ''}
        />

        <div
          onClick={() => setNickname(nicknameField.current.value)}
          className={`change_profile save-button ${isDisabledNicknameChange ? 'no-pointers grayed' : ''}`}
          tooverlayview="true"
        >
          {lang.apply}
        </div>
      </div>
    </div>
  );
};

export default SetNickname;
