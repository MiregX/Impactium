import React from 'react';
import { usePlayer } from '../../../class/Player';
import { useLanguage } from '../../language/Lang';
import './SetSkin.css';

const SetSkin = () => {
  const { player, setSkin } = usePlayer();
  const { lang } = useLanguage();
  const isDisabledSkinChange = Date.now() - player.lastSkinChangeTimestamp < 24 * 60 * 60 * 1000;

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSkin(file);
    }
  };

  return (
    <div className={`default_panel_style dynamic ${player.registered ? '' : 'blocked'} setSkin`}>
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
          className={`default_button_style ${
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
        <label
          htmlFor="fileInput"
          className={`change_profile upload-button ${
            isDisabledSkinChange ? 'no-pointers greyed' : ''
          }`} tooverlayview="true"
        >
          <img src="https://cdn.impactium.fun/ux/uploads.svg" alt="Upload" />
        </label>
      </div>
    </div>
  );
};

export default SetSkin;
