'use client'
import s from '@/styles/me/Account.module.css';
import { useLanguage } from '@/context/Language';
import { useMessage } from '@/context/Message';

export function ServerInfo() {
  const { lang } = useLanguage();
  const { copy } = useMessage();

  const openLinkInNewTab = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className={`${s.serverInfo} ${s.panel} ${s.dynamic}`}>
      <div
        className={s.button}
        data-overlayed={true}>
        <span>{lang.version}</span>
        <p>Fabric 1.20.2</p>
      </div>

      <div
        className={s.button}
        data-overlayed={true}
        onClick={() => openLinkInNewTab('https://modrinth.com/plugin/plasmo-voice/versions?g=1.20.2&l=fabric')}>
        <span>{lang.downloadVoiceChat}</span>
        <img src="https://cdn.impactium.fun/ui/specific/microphone.svg" alt='' />
      </div>

      <div
        className={s.button}
        data-overlayed={true}
        onClick={() => openLinkInNewTab('https://t.me/+8OB7E0xJwlFhY2Iy')}>
        <span >{lang.playerChat}</span>
        <img src="https://cdn.impactium.fun/ui/specific/paper-plane.svg" alt='' />
      </div>

      <div
        className={s.button}
        data-overlayed={true}
        onClick={() => copy('play.impactium.fun')}>
        <span>IP:</span>
        <p>play.impactium.fun</p>
      </div>
    </div>
  );
};