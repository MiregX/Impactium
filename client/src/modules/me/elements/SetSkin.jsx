import React from 'react';
import { usePlayer } from '../../../class/Player';
import { useLanguage } from '../../language/Lang';
import './SetSkin.css';

const SetSkin = () => {
  const { player, setSkin, isPlayerLoaded } = usePlayer();
  const { lang } = useLanguage();
  const isDisabledSkinChange = Date.now() - player.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000;

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSkin(file);
    }
  };

  return (
    <div className={`default_panel_style dynamic ${isPlayerLoaded && !player.registered ? 'blocked' : ''} setSkin`}>
      <div className="flex panel-header align-center">
        <p>{lang.changeSkin}</p>

        {isDisabledSkinChange && (
          <>
            <img src="https://api.impactium.fun/ux/timer.svg" alt="Timer" />
            <span id="skinTimer" timestamp={player.lastSkinChangeTimestamp}></span>
          </>
        )}
      </div>

      <p id="skinUploadOnErrorMessageContainer"></p>

      <div className="flex panel-footer" style={{ gap: '8px' }}>
        {/* Current skin name */}
        <p
          className={`default_button_style ${isPlayerLoaded ? 'w-max' : 'player_loader for_input'} ${
            isDisabledSkinChange || !player.skin?.originalTitle ? 'grayed' : ''
          }`}
          id="skinName"
        >
          {player.skin?.originalTitle || lang.skinNotSettled}
        </p>

        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}  // Обработчик изменения файла
        />

      </div>
    </div>
  );
};

export default SetSkin;
