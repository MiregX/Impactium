'use client'
import { useLanguage } from "@/context/Language";
import { Panel } from "@/ui/Panel";
import s from './Onboard.module.css';
import { Tournament } from "@/dto/Tournament";
import React from "react";

export function TournamentsRecomendations({ tournaments }: { tournaments: Tournament[]}) {
  tournaments = tournaments || [
    {
      banner: "https://cdn.impactium.fun/public/uploads/tournaments/major.png",
      title: "Мейджор Московская Осень 2024",
      start: new Date("2024-09-15T10:00:00"),
      end: new Date("2024-09-30T22:00:00"),
      code: "major",
      teams: ["Virtus.pro", "Team Secret", "Vici Gaming", "Evil Geniuses", "Fnatic", "Team Aster", "T1", "beastcoast"]
    },
    {
      banner: "https://cdn.impactium.fun/public/uploads/tournaments/dota32.png",
      title: "The International 32",
      start: new Date("2024-07-15T12:00:00"),
      end: new Date("2024-08-30T20:00:00"),
      code: "dota32",
      teams: ["Team Secret", "OG", "Virtus.pro", "Evil Geniuses", "PSG.LGD", "Team Liquid", "Invictus Gaming", "Fnatic"]
    },
    {
      banner: "https://cdn.impactium.fun/public/uploads/tournaments/minor.png",
      title: "TI32 Qualifiers",
      start: new Date("2024-07-01T10:00:00"),
      end: new Date("2024-07-10T18:00:00"),
      code: "dota32_qualifiers",
      teams: ["Team Nigma", "Alliance", "beastcoast", "Vici Gaming", "Team Aster", "TNC Predator", "Quincy Crew", "Team Spirit"]
    }
  ];

  const { lang } = useLanguage();
  return (
    <Panel heading={lang.tournament.recomendations} className={s.tournaments}>
      <React.Fragment>
        {tournaments.map((tournament: Tournament) => {
          return (
            <div className={s.unit} key={tournament.code}>
              <img src={tournament.banner} />
              <desc>
                <div className={s.top}>
                  <p>{tournament.title}</p>
                  <span>·</span>
                  <h6>@{tournament.code}</h6>
                </div>
              </desc>
            </div>
          )
        })}
      </React.Fragment>
    </Panel>
  )
}
