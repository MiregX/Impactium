'use client'
import React, { useState, useEffect } from 'react';
import s from '@/styles/me/Account.module.css';
import { useLanguage } from '@/context/Language'
import { useMessage } from '@/context/Message';
import { useUser } from '@/context/User';
import { usePlayer } from '@/context/Player';

export function PlayerCredentials() {
  const { lang } = useLanguage();
  const { user } = useUser();
  const { player, isPlayerLoaded } = usePlayer();
  const { copy } = useMessage();
  const allAchievements = ['casual', 'defence', 'killer', 'event', 'donate', 'hammer'];
  const [playerSkinIconLink, setPlayerSkinIconLink] = useState(player?.skin?.iconLink || 'https://cdn.impactium.fun/minecraftPlayersSkins/steve_icon.png');

  useEffect(() => {
    if (isPlayerLoaded && player.skin) {
      setPlayerSkinIconLink(`${player.skin.iconLink}?timestamp=${Date.now()}`)
    }
  }, [player, isPlayerLoaded, setPlayerSkinIconLink]);

  return (
    <div className={`${s.panel} ${s.playerCredentials} ${s.dynamic}`} itemType='dynamic'>
      <h2>{lang.account}</h2>

      <p className={s.player}>
        <img src={playerSkinIconLink} alt="Player Icon" />

        {player.registered && player.nickname ? (
          player.nickname
        ) : (
          player.registered
            ? lang.playerHasNoNickname
            : lang.playerNotRegisteredYet
        )}
      </p>

      <ul className={s.ul}>
        {allAchievements.map((achKey) => {
          const ach = player.achievements?.[achKey];
          if (typeof ach !== 'object') return null;

          return (
            <li className={`${s[achKey]}, ${s['percentage' + ach.doneStages]}`} itemType={achKey} key={`${achKey}-${ach.doneStages}`}>
              {`${lang[`achievmentTitle_${achKey}`]} ${ach.symbol}`}
              <hr />
            </li>
          );
        })}
      </ul>

      {player.registered ? (
        <button
          className={s.button}
          data-overlayed={true}
          onClick={() => copy(`https://impactium.fun/?ref=${user.referal.code}`)}>
          {lang.copyMyReferalLink}
        </button>
      ) : (
        <button className={s.button} data-overlayed={true}>
          {lang._register}
        </button>
      )}
    </div>
  );
};