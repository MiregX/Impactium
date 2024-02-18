import React, { useState, useEffect } from 'react';
import './PlayerCredentials.css'; // Replace with your actual CSS file
import { useLanguage } from '../../language/Lang'
import { usePlayer } from '../../../class/Player';
import { useMessage } from '../../message/Message';
import { useUser } from '../../../class/User';

const PlayerCredentials = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const { copy } = useMessage();
  const { player, register, isPlayerLoaded } = usePlayer();
  const allAchievements = ['casual', 'defence', 'killer', 'event', 'donate', 'hammer'];
  const [playerSkinIconLink, setPlayerSkinIconLink] = useState(player?.skin?.iconLink || 'https://cdn.impactium.fun/minecraftPlayersSkins/steve_icon.png');


  useEffect(() => {
    if (isPlayerLoaded && player.skin) {
      setPlayerSkinIconLink(`${player.skin.iconLink}?timestamp=${Date.now()}`)
    }
  }, [player, isPlayerLoaded, setPlayerSkinIconLink]);

  return (
    <div className="dynamic default_panel_style me player_credentials">
      <h2 className="header">{lang.myProfile}</h2>

      <p className={`player ${isPlayerLoaded ? '' : 'player_loader'}`}>
        <img src={playerSkinIconLink} alt="Player Icon" />

        {player.registered && player.nickname ? (
          player.nickname
        ) : (
          player.registered
            ? lang.playerHasNoNickname
            : lang.playerNotRegisteredYet
        )}
      </p>

      <ul>
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
        <button tooverlayview="true"
          className="change_profile"
          onClick={() => copy(`https://impactium.fun/?ref=${user.referal.code}`)}
        >
          {lang.copyMyReferalLink}
        </button>
      ) : (
        <button className="change_profile" onClick={register} tooverlayview="true">
          {lang._register}
        </button>
      )}
    </div>
  );
};

export default PlayerCredentials;