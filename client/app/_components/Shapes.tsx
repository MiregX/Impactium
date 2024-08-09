'use client'
import CreateTeam from '@/banners/create_team/CreateTeam';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/ui/Carousel';
import s from './styles/TournamentList.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { map as organizersMap } from '@/public/landing'
import { useLanguage } from '@/context/Language.context';
import { useApplication } from '@/context/Application.context';

export function Shapes() {
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();

  return (
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
        <div className={s.background}/>
      </div>
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
  )
}