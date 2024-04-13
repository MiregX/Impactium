import React, { useEffect, useState } from 'react';
import s from '@/styles/header/Header.module.css';
import { useHeader } from '@/context/Header';
import { useLanguage } from '@/context/Language'

export function Nav() {
  const { isHeaderBackgroundHidden } = useHeader();
  const { lang } = useLanguage()
  const nav = {
    "partners": {
      "kavuryarnya": {
        "name": "Кавунярня",
        "logo": "https://cdn.discordapp.com/icons/1060561700123840582/f8ca992b9aa561a23a5f840dbada56a5.webp?size=96",
        "description": "Приємний сервер",
        "action": "https://discord.gg/cCCGxfQnzY"
      },
      "mythology": {
        "name": "Mythology",
        "logo": "https://cdn.discordapp.com/icons/1086575520214437888/3ed5f68e7cfe818d8976b412f68d2074.webp?size=256",
        "description": "Trixel`s AO guild",
        "action": ""
      }
    },
    "products": {
      "mcs": {
        "name": "Minecraft Server",
        "logo": "https://cdn.impactium.fun/logo/minecraft.png",
        "description": "Майнкрафт сервер.",
        "action": "https://impactium.fun/me"
      }
    },
    "contact": {
      "telegram": {
        "name": "Our Telegram",
        "logo": "https://cdn.impactium.fun/logo/telegram.png",
        "description": "Impactium | Кошмаринг",
        "action": "https://t.me/impactium"
      }
    }
  }

  return (
    <div className={`${s.nav} ${isHeaderBackgroundHidden && s.visible}`}>
      {Object.keys(nav).map((category, index) => (
        <React.Fragment key={category}>
          <div className={s.category}>
            <button>
              <p>{lang[category]}</p>
              <img src="https://cdn.impactium.fun/ui/caret/down-md.svg" alt="" />
              <div className={s.bar}>
                {Object.values(nav[category]).map((obj: { action, name, description, logo }, innerIndex) => (
                  <a key={innerIndex} className={s.plate} href={obj.action}>
                    <div className={s.guildAvatar}>
                      <img src={obj.logo} alt="" />
                    </div>
                    <div className={s.text}>
                      <h3>{obj.name}</h3>
                      <div className={s.description}>
                        <p>{obj.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </button>
          </div>
          {index < Object.keys(nav).length - 1 && <div className={s.line} />}
        </React.Fragment>
      ))}
    </div>
  );
};
