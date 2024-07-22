'use client'
import { Pagination } from "./Pagination";
import s from './styles/TournamentList.module.css'
import { Tournament } from "@/dto/Tournament";
import { usePagination } from "@/decorator/usePagination";
import React from "react";
import { PanelTemplate } from "./PanelTempate";
import { TournamentUnit } from "./TournamentUnit";
import { Button } from "@/ui/Button";
import CreateTeam from "@/banners/create_team/CreateTeam";
import { useApplication } from "@/context/Application.context";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/Language.context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/Carousel"
import { Card } from "@/ui/Card";
import { map as organizersMap } from '@/public/landing'

export function TournamentsList({ tournaments }: { tournaments: Tournament[]}) {
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();
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
          <h4>{lang.tournament.for_organizers}</h4>
          <Carousel className={s.carousel}>
          <CarouselContent>
            {organizersMap.map(({ image, title, description }, index) => (
              <CarouselItem key={index}>
                <Card className={s.card} id={index}>
                  <div className={s.heading}>
                    <Button size='icon' className={s.icon} disabled img={image} />
                    <h3>{lang.landing[title]}</h3>
                  </div>
                  <p>{lang.landing[description]}</p>
                </Card>
              </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className={s.carousel_right} />
          </Carousel>
          <div className={s.button_wrapper}>
            <Button
              asChild
              className={s.find_tournament}
              size='lg'><Link href='/tournaments'>{lang.find.tournament}</Link></Button>
          </div>
        </div>
        <div className={s.background} />
        <div className={s.right}>
          <Image width={512} height={512} className={s.lines} src='https://cdn.impactium.fun/bgs/line-shape-fhd.png' alt='' />
          <h4>{lang.team.for_teams}</h4>

          <div className={s.button_wrapper}>
            <Button
              className={s.create_team}
              size='lg'
              onClick={() => spawnBanner(<CreateTeam />)}>{lang.create.team}</Button>
            <Button
              asChild
              variant='ghost'
              className={s.find_team}
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
