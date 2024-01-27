import React, { useEffect, useState } from 'react';
import './Nav.css';
import { useHeaderContext } from './HeaderContext';
import { useLanguage } from '../language/Lang'

export default function Nav() {
  const { isHeaderBackgroundHidden } = useHeaderContext();
  const [visibility, setVisibility]= useState('none');
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
        "logo": "https://cdn.impactium.fun/logo/impactium-tw.png",
        "description": "Майнкрафт сервер.",
        "action": "https://impactium.fun/me"
      },
      "discord": {
        "name": "Impactium Bot",
        "logo": "https://cdn.impactium.fun/logo/impactium-wb.png",
        "description": "Автороли для альянса.",
        "action": "https://discord.com/oauth2/authorize?client_id=1123714909356687360&scope=bot&permissions=8"
      }
    },
    "contact": {
      "telegram": {
        "name": "Our Telegram",
        "logo": "https://cdn.impactium.fun/logo/impactium-bw.png",
        "description": "Impactium | Кошмаринг",
        "action": "https://t.me/impactium"
      }
    }
  }
  useEffect(() => {
    setVisibility(isHeaderBackgroundHidden ? 'flex' : 'none')
  }, [isHeaderBackgroundHidden]);

  return (
    <div className={`nav ${visibility}`}>
      {Object.keys(nav).map((category, index) => (
        <React.Fragment key={category}>
          <div className='category'>
            <button className="flex-dir-row center">
              <p>{lang[category]}</p>
              <img src="https://cdn.impactium.fun/ux/to-left.svg" alt="arrow" />
              <div className='bar'>
                {Object.values(nav[category]).map((obj, innerIndex) => (
                  <a key={innerIndex} className="plate flex-dir-row center-v" href={obj.action}>
                    <div className="guild-avatar flex center">
                      <img src={obj.logo} alt="guild-logo" />
                    </div>
                    <div className="text flex-dir-column">
                      <h3>{obj.name}</h3>
                      <div className="p-wrapper">
                        <p>{obj.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </button>
          </div>
          {index < Object.keys(nav).length - 1 && <div className='line' />}
        </React.Fragment>
      ))}
    </div>
  );
};
