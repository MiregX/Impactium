import React, { useEffect } from 'react';
import { usePlayer } from '../../class/Player';
import PlayerCredentials from './elements/PlayerCredentials'
import SetNickname from './elements/SetNickname'
import SetPassword from './elements/SetPassword'
import SetSkin from './elements/SetSkin'
import AchievementsModule from './elements/AchievementsModule'
import ServerInfo from './elements/ServerInfo'
import Overlay from './Overlay'

const Profile = () => {
  const { player, getPlayer } = usePlayer();

  useEffect(() => {
    if (!player) {
      getPlayer();
    }
  }, []);

  return (
    <div className='profile'>
      <div className="top_line flex-dir-row liner">
        <PlayerCredentials />
        <div className="controls calc_overlay">
          <SetNickname />
          <SetPassword />
          <SetSkin />
          <AchievementsModule />
        </div>  
      </div>
      <div className="middle_line flex-dir-row liner">
        <ServerInfo />
      </div>
      <Overlay />
    </div>
  );
};

export default Profile;