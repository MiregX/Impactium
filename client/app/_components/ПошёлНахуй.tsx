'use client'
import { Button } from '@/ui/Button';
import s from './styles/ПошёлНахуй.module.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ManageTournamentBanner } from '@/banners/ManageTournament.banner';
import { useApplication } from '@/context/Application.context';;
import { ManageTeamBanner } from '@/banners/ManageTeam.banner';

export function ПошёлНахуй() {
  const { spawnBanner, application } = useApplication();

  const getIndex = () => typeof application.isSafeMode === 'number' ? Math.max(0, Math.min(1, application.isSafeMode)) : 1;

  const map = [
    ['Пошёл', 'нахуй', 'сын', 'мёртвой', 'шлюхи.', 'Чё хочу, то, блять, и делаю.'],
    ['Просто', 'сервис', 'для', 'проведения', 'турниров', 'Реально, никакого подвоха.']
  ][getIndex()];

  return (
    <div className={s.wrapper}>
      {map?.map((word, i) => {
        const Tag = `h${i + 1}` as keyof JSX.IntrinsicElements;
        return <Tag key={i}>{word}</Tag>
      })}
      <Button asChild className={cn(s.button, s.tournaments)}>
        <Link href='/tournaments'>Турниры</Link>
      </Button>
      <Button asChild className={cn(s.button, s.teams)}>
        <Link href='/teams'>Команды</Link>
      </Button>
      <Button onClick={() => spawnBanner(<ManageTournamentBanner />)} className={cn(s.button, s.create_tournament)}>
        Создать турнир
      </Button>
      <Button onClick={() => spawnBanner(<ManageTeamBanner />)} className={cn(s.button, s.create_team)}>
        Создать команду
      </Button>
    </div>
  )
}