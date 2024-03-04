'use client'
import React, { useEffect, useState } from 'react';
import s from '@/styles/me/Account.module.css';
import { useLanguage } from '@/context/Language';
import { usePlayer } from '@/context/Player';

export function AchievementsModule() {
  const { lang } = useLanguage();
  const { player, setAchievement, isPlayerLoaded, getAchievements } = usePlayer();
  const [isAchievementsFetched, setIsAchievementsFetched] = useState(false);

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
    }
  };
  
  const [activeAchievement, setActiveAchievement] = useState(Object.keys(allAchievements)[0]);

  useEffect(() => {
    const overlay = document.querySelector(`.${s.overlay}`);
    console.log(overlay)
    const overlayAchievementModule = overlay.querySelector(`.${s.achievementsModule}`);
    console.log(overlayAchievementModule)
    if(!overlayAchievementModule) return;
    overlayAchievementModule.classList.remove(s.casual, s.defence, s.kills, s.event, s.donate)
    overlayAchievementModule.classList.add(s[activeAchievement]);
  }, [activeAchievement]);

  useEffect(() => {
    if (player.achievements && Date.now() - player.achievements.processed < 1000 * 60 * 10)
      return;
    
    if (!isAchievementsFetched && player && isPlayerLoaded) {
      setIsAchievementsFetched(true);
      // getAchievements();
    }
  }, [getAchievements, isAchievementsFetched, isPlayerLoaded, player])
  
  return (
    <div className={`${s.achievementsModule} ${s.dynamic} ${s.panel} ${s[activeAchievement]} ${!player.registered && s.blocked}`}>
      <div className={s.selectionWrapper}>
        {Object.keys(allAchievements).map((achKey, index: number) => (
          <button
            key={`${index}_button`}
            className={`${s[achKey]} ${achKey === activeAchievement && s.selected}`}
            onClick={() => setActiveAchievement(achKey)}>
            <img src={`https://cdn.impactium.fun/ux/${achKey}.svg`} alt='' />
          </button>
        ))}
      </div>
      <div className={s.relativePanel}>
      {Object.keys(allAchievements).map((achKey, index) => {
        let percentage = [0, 0];
        return (
          <div
          key={`${index}_panel`}
            className={`${s[achKey]} ${s.stages} ${achKey === activeAchievement && s.selected}`}>
            {allAchievements[achKey].stages.map((stageKey: string, stageIndex: number) => {
              const stage = player.achievements?.[achKey]?.stages[stageKey[0]];
              if (stage) {
                percentage[0] += stage.percentage || 0;
                percentage[1] += 1;
              }
              return (
                <>
                  <hr datatype='horizontal' className={s.stageSplitter} key={`${index}_${stageIndex}_hr`} />
                  <div className={s.stage} key={`${index}_${stageIndex}_stage`}>
                    <img src={`https://cdn.impactium.fun/achievement/${stageKey[0]}.png`} alt={stageKey[0]} />
                    <div className={s.text}>
                      <p>{lang[`${stageKey[0]}_todo`]?.title}</p>
                      <p>{lang[`${stageKey[0]}_todo`]?.description}</p>
                    </div>
                    <div className={s.counter}>
                      <span>{stage ? (stage.isDone ? stage.limit : stage.score) : 0} / {stage ? stage.limit : stageKey[1]}</span>
                      <hr style={{ width: stage ? `${stage.percentage}%` : '0%' }} />
                    </div>
                  </div>
                </>
              );
            })}
            <div className={s.reward} key={`reward-${index}`}>
              <div className={s.about}>
                <div className={s.claim} key={`claim-${index}`}>
                  <img src={allAchievements[achKey].reward.icon} alt='' />
                  <p>{lang.account}</p>
                </div>
              </div>
              {percentage[0] / percentage[1] >= 100 && (
                <button onClick={() => setAchievement(achKey)} className={s.activate} key={`button-${index}`}>
                  Активировать
                </button>
              )}
            </div>
            <div className={s.percentage} key={`line-${index}`}>
              <hr style={{ width: percentage[1] !== 0 ? (percentage[0] / percentage[1]) : 0 }} />
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
