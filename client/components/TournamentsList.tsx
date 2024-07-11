'use client'
import { useState } from "react"
import { Pagination } from "./Pagination";
import s from './styles/TournamentList.module.css'
import { Tournament } from "@/dto/Tournament";
import { User } from "@/dto/User";
import { usePagination } from "@/decorator/usePagination";
import React from "react";
import { PanelTemplate } from "./PanelTempate";
import { TournamentUnit } from "./TournamentUnit";
import { Button } from "@/ui/Button";
import CreateTeam from "@/banners/create_team/CreateTeam";
import { useApplication } from "@/context/Application.context";
import Link from "next/link";
import Image from "next/image";

const mockTournaments: Tournament[] = [
  {
    id: "1",
    banner: "https://example.com/banners/space_invaders.png",
    title: "Galactic Space Invaders Championship",
    start: new Date('2024-07-10T10:00:00Z'),
    end: new Date('2024-07-15T18:00:00Z'),
    description: "Join the ultimate battle in space and prove your dominance in the galaxy!",
    code: "GSI2024",
    rules: JSON.parse('{"maxTeams": 16, "minPlayers": 5, "maxPlayers": 10}'),
    ownerId: "u1",
    owner: { uid: "u1", displayName: "Galactic Commander" } as unknown as User,
    teams: [],
    gid: "galactic_space_invaders",
    grid: '',
    comments: [],
    prize: 0
  },
  {
    id: "2",
    banner: "https://example.com/banners/medieval_mayhem.png",
    title: "Medieval Mayhem Jousting Tournament",
    start: new Date('2024-06-01T12:00:00Z'),
    end: new Date('2024-07-05T20:00:00Z'),
    description: "Don your armor and prepare for a clash of knights in the grand jousting arena!",
    code: "MMJT2024",
    rules: JSON.parse('{"maxTeams": 8, "minPlayers": 2, "maxPlayers": 5}'),
    ownerId: "u2",
    owner: { uid: "u2", displayName: "Sir Lancelot" } as unknown as User,
    teams: [],
    gid: "medieval_mayhem",
    grid: '',
    comments: [],
    prize: 0
  },
  {
    id: "3",
    banner: "https://example.com/banners/mystic_mage_duel.png",
    title: "Mystic Mage Duel of the Elements",
    start: new Date('2024-05-15T14:00:00Z'),
    end: new Date('2024-05-20T22:00:00Z'),
    description: "Harness the power of the elements and duel against other mages to become the Archmage!",
    code: "MMDE2024",
    rules: JSON.parse('{"maxTeams": 10, "minPlayers": 1, "maxPlayers": 3}'),
    ownerId: "u3",
    owner: { uid: "u3", displayName: "Grand Sorcerer" } as unknown as User,
    teams: [],
    gid: "mystic_mage_duel",
    grid: '',
    comments: [],
    prize: 0
  },
  {
    id: "4",
    banner: "https://example.com/banners/robot_rumble.png",
    title: "Robot Rumble: Battle of the Bots",
    start: new Date('2024-07-25T09:00:00Z'),
    end: new Date('2024-07-30T17:00:00Z'),
    description: "Build, program, and battle your robots in the ultimate test of engineering prowess!",
    code: "RRBB2024",
    rules: JSON.parse('{"maxTeams": 20, "minPlayers": 3, "maxPlayers": 6}'),
    ownerId: "u4",
    owner: { uid: "u4", displayName: "Dr. Robotnik" } as unknown as User,
    teams: [],
    gid: "robot_rumble",
    grid: '',
    comments: [],
    prize: 0
  },
  {
    id: "5",
    banner: "https://example.com/banners/underwater_adventure.png",
    title: "Underwater Adventure: Deep Sea Quest",
    start: new Date('2024-08-15T08:00:00Z'),
    end: new Date('2024-08-20T16:00:00Z'),
    description: "Dive into the deep blue sea and complete quests to uncover the mysteries of the ocean!",
    code: "UADQ2024",
    rules: JSON.parse('{"maxTeams": 12, "minPlayers": 4, "maxPlayers": 8}'),
    ownerId: "u5",
    owner: { uid: "u5", displayName: "Captain Nemo" } as unknown as User,
    teams: [],
    gid: "underwater_adventure",
    grid: '',
    comments: [],
    prize: 0
  }
];

export const TournamentsList = () => {
  const [ tournaments, setTournaments ] = useState<Tournament[]>(mockTournaments);
  const { spawnBanner } = useApplication();
  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: tournaments.length,
    itemsPerPage: 3,
    buttons: 5
  });

  return (
    <PanelTemplate useColumn={true} className={s.page}>
      <div className={s.fill}>
        <div className={s.left}>
          <Image width={512} height={512} className={s.shape} src='https://cdn.impactium.fun/bgs/cube-shape-fhd.webp' alt='' />
          <h4>Организаторам</h4>
          <ul>
            <li>Удобный конструктор турниров</li>
            <li>Автоматизация процессов</li>
            <li>Авто-обновление турнирной сетки</li>
            <li>Редактор команд</li>
            <li>Отсутствие бюрократии</li>
          </ul>
          <div className={s.button_wrapper}>
            <Button
              asChild
              className={s.find_tournament}
              size='lg'><Link href='/tournaments'>Найти турнир</Link></Button>
          </div>
        </div>
        <div className={s.background} />
        <div className={s.right}>
          <Image width={512} height={512} className={s.lines} src='https://cdn.impactium.fun/bgs/line-shape-fhd.png' alt='' />
          <h4>Командам</h4>
          <ul>
            <li>Участие в 1 клик</li>
            <li>Каталог турниров</li>
            <li>Гарантированный приз за активность</li>
            <li>Удобный интерфейс менеджмента</li>
            <li>Приватные чаты с другими командами</li>
          </ul>
          <div className={s.button_wrapper}>
            <Button
              className={s.create_team}
              size='lg'
              onClick={() => spawnBanner(<CreateTeam />)}>Создать команду</Button>
            <Button
              asChild
              variant='ghost'
              size='lg'><Link href='/teams'>Найти команду</Link></Button>
          </div>
        </div>
      </div>
      <h4 style={{width: '100%', marginTop: '12px', fontSize: '18px'}}>Актуальные турниры:</h4>
      <div className={s.wrapper}>
        {current.map(index => (
          <TournamentUnit key={index} tournament={tournaments[index]} />
        ))}
      </div>
      <Pagination
        page={page}
        total={total}
        getPageNumbers={getPageNumbers}
        setPage={setPage}
      />
    </PanelTemplate>
  );
};
