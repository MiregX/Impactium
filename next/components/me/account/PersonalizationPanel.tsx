'use client'
import React, { useRef } from 'react';
import s from '@/styles/me/Account.module.css';
import { useLanguage } from '@/context/Language';
import { usePlayer } from '@/context/Player';

interface IPersonalizationPanel {
  type: 'nickname' | 'password' | 'skin'
} 

export function PersonalizationPanel({ type }: IPersonalizationPanel) {
  const { lang } = useLanguage();
  const { player, setNickname, setPassword, setSkin, isPlayerLoaded } = usePlayer();
  const self = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSkin(file);
    }
  };

  const referencesMap = {
    nickname: {
      key: s.setNickname,
      heading: lang.changeNickname,
      input: {
        type: 'text',
        default: player.nickname,
        placeholder: lang.enterNickname
      },
      action: () => setNickname(self.current.value),
      button: {
        style: s.saveButton,
        title: lang.apply
      }
    },
    password: {
      key: s.setPassword,
      heading: lang.changePassword,
      input: {
        type: 'password',
        default: player.password,
        placeholder: lang.enterNewPassword
      },
      action: () => setPassword(self.current.value),
      button: {
        style: s.saveButton,
        title: lang.confirm
      }
    },
    skin: {
      key: s.setSkin,
      heading: lang.changeSkin,
      input: {
        type: 'file',
        default: null,
        placeholder: ''
      },
      action: handleFileChange,
      button: undefined
    }
  }

  const reference = referencesMap[type];

  return (
    <div
      className={`${s.panel} ${s.dynamic} ${isPlayerLoaded && !player.registered && s.blocked} ${reference.key}`}>
      <p>{reference.heading}</p>

      <div className={s.body}>
        <input
          ref={self}
          id={type}
          type={reference.input.type}
          defaultValue={reference.input.default}
          placeholder={reference.input.placeholder}
          autoComplete="new-password"
        />
        {reference.button ? (
          <div
            onClick={reference.action}
            data-overlayed={true}
            className={`${s.button} ${reference.button.style}`}
            itemType='view'>
            {reference.button.title}
          </div>
        ) : (
          <>
            <p
              className={`${s.button} ${!player.skin?.originalTitle
              }`}>
              {player.skin?.originalTitle || lang.skinNotSettled}
            </p>
            <label
              htmlFor={type}
              data-overlayed={true}
              className={`${s.button} ${s.uploadButton}`}
              onChange={reference.action}>
              <img src="https://cdn.impactium.fun/ux/uploads.svg" alt="Upload" />
            </label>
          </>
        )}
      </div>
    </div>
  );
};