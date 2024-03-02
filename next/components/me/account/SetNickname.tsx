'use client'
import React, { useRef } from 'react';
import s from '@/styles/me/Account.module.css';
import { useLanguage } from '@/context/Language';
import { usePlayer } from '@/context/Player';

export function SetNickname() {
  const { lang } = useLanguage();
  const { player, setNickname, isPlayerLoaded } = usePlayer();
  const nicknameField = useRef(null);

  return (
    <div
      className={`${s.panel} ${isPlayerLoaded && !player.registered && s.blocked} ${s.setNickname}`}
      itemType='dynamic'>
      <div className={s.head}>
        <p>{lang.changeNickname}</p>
      </div>

      <div className={s.bottom}>
        <div>
          <input
            ref={nicknameField}
            type="text"
            id="nicknameField"
            defaultValue={player.nickname}
            placeholder={lang.enterNickname}
            autoComplete="new-password"
          />
        </div>
        <div
          onClick={() => setNickname(nicknameField.current.value)}
          className={`${s.button} ${s.saveButton}`}
          itemType='view'
        >
          {lang.apply}
        </div>
      </div>
    </div>
  );
};

export default SetNickname;
