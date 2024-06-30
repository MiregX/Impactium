'use client'
import { useState } from "react"
import { Pagination } from "./Pagination";
import s from './styles/TournamentList.module.css'
import { Tournament } from "@/dto/Tournament";
import { Card } from "@/ui/Card";
import { User } from "@/dto/User";
import { usePagination } from "@/decorator/usePagination";
import React from "react";
import { PanelTemplate } from "./PanelTempate";
import { TournamentUnit } from "./TournamentUnit";

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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
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
    comments: []
  }
];

export const TournamentsList = () => {
  const [ tournaments, setTournaments ] = useState<Tournament[]>(mockTournaments);
  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: tournaments.length,
    itemsPerPage: 3,
    buttons: 5
  });

  return (
    <PanelTemplate useColumn={true} className={s.page}>
      <div className={s.fill} />
      <div className={s.wrapper}>
        {current.map(index => (
          <TournamentUnit tournament={tournaments[index]} />
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
