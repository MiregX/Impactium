import React, { useState } from 'react';
import './AchievementsModule.css'; // Замените на фактический файл CSS
import { useLanguage } from '../../language/Lang';
import { usePlayer } from '../../../class/Player';

const AchievementsModule = () => {
  const { lang } = useLanguage();
  const { player } = usePlayer();

  const allAchievements = {
    "casual": {
      "stages": [
        ['diamonds', 10],
        ['netherite', 4],
        ['endStone', 2048],
        ['shrieker', 16],
        ['reinforcedDeepslate', 64]
      ],
      "reward": {
        "icon": "https://static.wikia.nocookie.net/minecraft/images/5/55/HasteNew.png",
        "type": "effect"
      }
    },
    "defence": {
      "stages": [
        ['damageOne', 100000],
        ['damageTwo', 250000],
        ['damageThree', 500000],
        ['damageFour', 750000],
        ['damageFive', 1000000]
      ],
      "reward": {
        "icon": "https://static.wikia.nocookie.net/minecraft/images/0/05/ResistanceNew.png",
        "type": "effect"
      }
    },
    "killer": {
      "stages": [
        ['kills', 500],
        ['wither', 1],
        ['dragon', 1],
        ['warden', 1],
        ['damage', 1000000]
      ],
      "reward": {
        "icon": "https://static.wikia.nocookie.net/minecraft/images/b/b8/StrengthNew.png",
        "type": "effect"
      }
    },
    "event": {
      "stages": [
        ['eventOne', 1],
        ['eventTwo', 2],
        ['eventThree', 3],
        ['eventFour', 5],
        ['eventFive', 10]
      ],
      "reward": {
        "icon": "",
        "type": ""
      }
    },
    "donate": {
      "stages": [
        ['donateOne', 10],
        ['donateTwo', 20],
        ['donateThree', 30],
        ['donateFour', 40],
        ['donateFive', 50]
      ],
      "reward": {
        "icon": "",
        "type": ""
      }
    },
    "hammer": {
      "stages": [
        ['becomeMayor', 1],
        ['playsFromFirstSeason', 1],
        ['petition', 1]
      ],
      "reward": {
        "icon": "https://api.impactium.fun/achievement/thunderBolt.png",
        "type": "ability"
      }
    }
  };
  
  const [activeAchievement, setActiveAchievement] = useState(Object.keys(allAchievements)[0]);
  
  return (
<div className={`achievements_module default_panel_style dynamic ${player.registered ? '' : 'blocked'}`} achievement={activeAchievement}>
      <div className="selection_wrapper flex flex-dir-row" tooverlayview="true">
        {Object.keys(allAchievements).map((achKey, index) => (
          <button
            key={index}
            className={`${achKey} ${achKey === activeAchievement ? 'selected' : ''}`}
            onClick={() => setActiveAchievement(achKey)}
          >
            <img src={`https://api.impactium.fun/ux/${achKey}.svg`} alt={achKey} />
          </button>
        ))}
        <div className="align-center justify-end loader" style={{ flex: 1 }}>
          <img src="https://api.impactium.fun/ux/loader24p.svg" alt="Loader" />
        </div>
      </div>
      <div className="relative_panel flex flex-dir-row">
        {Object.keys(allAchievements).map((achKey, index) => {
          const percentage = [0, 0];
          return (
            <React.Fragment key={index}>
              <div
                key={index}
                className={`${achKey} stages ${achKey === activeAchievement ? 'selected' : ''}`}
              >
                {allAchievements[achKey].stages.map((stageKey, stageIndex) => {
                  const stage = player.achievements?.[achKey]?.stages[stageKey[0]];
                  return (
                    <>
                      <hr className="embed" />
                      <div className="flex flex-dir-row align-center stage">
                        <img src={`https://api.impactium.fun/achievement/${stageKey[0]}.png`} className="icon" alt={stageKey[0]} />
                        <div className="text flex flex-dir-column">
                          <p>{lang[`${stageKey[0]}_todo`].title}</p>
                          <p className="grayed">{lang[`${stageKey[0]}_todo`].description}</p>
                        </div>
                        <div className="counter flex flex-dir-column">
                          <span>{stage ? (stage.isDone ? stage.limit : stage.score) : 0} / {stage ? stage.limit : stageKey[1]}</span>
                          <div className='line top'>
                            <hr style={{ width: stage ? `${stage.percentage}%` : '0%' }} />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="reward flex flex-dir-row">
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p className="title">
                      {lang.reward}: <span>{lang[allAchievements[achKey].reward.type]}</span>
                    </p>
                    <div className="flex flex-dir-row align-center claim">
                      <img src={allAchievements[achKey].reward.icon} alt="Reward Icon" />
                      <p>{lang[`${achKey}_reward`]}</p>
                    </div>
                  </div>
                  <button className="activate">Активировать</button>
                </div>
                <div className="line bottom">
                  <hr width={`${percentage[0] / percentage[1]}%`} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsModule;
