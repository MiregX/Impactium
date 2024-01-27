import React from 'react';
import './ServerInfo.css'; // Замените на фактический файл CSS
import { useLanguage } from '../../language/Lang';
import { useMessage } from '../../message/Message';

const ServerInfo = () => {
  const { lang } = useLanguage();
  const { copy } = useMessage();

  const openLinkInNewTab = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="server_info default_panel_style dynamic">
      <div className="default version change_profile default_button_style" tooverlayview="true">
        <span className="center">{lang.version}</span>
        <p>1.20.2</p>
      </div>

      <div
        className="default voice change_profile default_button_style"
        onClick={() => openLinkInNewTab('https://modrinth.com/plugin/plasmo-voice/versions?g=1.20.2&l=fabric')}
        tooverlayview="true"
      >
        <span className="center">{lang.downloadVoiceChat}</span>
        <img src="https://cdn.impactium.fun/ux/mic.svg" alt="Voice Chat" />
      </div>

      <div
        className="default telegram change_profile default_button_style"
        onClick={() => openLinkInNewTab('https://t.me/+8OB7E0xJwlFhY2Iy')}
        tooverlayview="true"
      >
        <span className="center">{lang.playerChat}</span>
        <img src="https://cdn.impactium.fun/ux/telegram-v1.svg" alt="Telegram" />
      </div>

      <div
        className="default donate change_profile default_button_style"
        style={{ flex: 1 }}
        onClick={() => openLinkInNewTab('https://t.me/MiregX')}
        tooverlayview="true"
      >
        <span className="center">{lang.supportOurServer}</span>
        <img src="https://cdn.impactium.fun/logo/impactium_v4.svg" alt="Support" />
      </div>

      <div className="default ip change_profile default_button_style" onClick={() => copy('play.impactium.fun')} tooverlayview="true">
        <span className="center">IP:</span>
        <p>play.impactium.fun</p>
      </div>
    </div>
  );
};

export default ServerInfo;
