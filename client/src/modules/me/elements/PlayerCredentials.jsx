import React, { useState } from 'react';
import './PlayerCredentials.css'; // Replace with your actual CSS file
import { useLanguage } from '../../language/Lang'
import { usePlayer } from '../../../class/Player';
import { useMessage } from '../../message/Message';
import { useUser } from '../../../class/User';

const PlayerCredentials = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const { copy } = useMessage();
  const { player, register } = usePlayer();
  const allAchievements = ['casual', 'defence', 'killer', 'event', 'donate', 'hammer'];

  return (
    <div className="dynamic default_panel_style me player_credentials">
      <h2 className="header">{lang.myProfile}</h2>

      <p className="player">
        {player.registered && player.skin?.iconLink ? (
          <img src={player.skin.iconLink} alt="Player Icon" />
        ) : (
          <img src="https://cdn.impactium.fun/minecraftPlayersSkins/steve_icon.png" alt="Default Icon" />
        )}

        {player.registered && player.nickname ? (
          player.nickname
        ) : (
          <span>
            {player.registered
              ? lang.playerHasNoNickname
              : lang.playerNotRegisteredYet
            }
          </span>
        )}
      </p>

      <ul role="list">
        {allAchievements.map((achKey) => {
          const ach = player.achievements?.[achKey];
          if (typeof ach !== 'object') return null;

          return (
            <li className={`${achKey}, percentage-${ach.doneStages}0`} key={`${achKey}-${ach.doneStages}`}>
              {`${lang[`achievmentTitle_${achKey}`]} ${ach.symbol}`}
              <hr />
            </li>
          );
        })}
      </ul>

      {player.registered ? (
        <a tooverlayview="true"
          className="change_profile"
          onClick={() => copy(`https://impactium.fun/?ref=${user.referal.code}`)}
        >
          {lang.copyMyReferalLink}
        </a>
      ) : (
        <a className="change_profile" onClick={register} tooverlayview="true">
          {lang.register}
        </a>
      )}
    </div>
  );
};

export default PlayerCredentials;