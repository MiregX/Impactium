'use client'
import { Button } from '@/ui/Button';
import s from './styles/ПошёлНахуй.module.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CreateTournament } from '@/banners/create_tournament/CreateTournament';
import { useApplication } from '@/context/Application.context';
import CreateTeam from '@/banners/create_team/CreateTeam';
import Image from 'next/image';
import { Medal, Users } from 'lucide-react';
import { Icon } from '@/ui/Icon';

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
        <Link href='/tournaments'>
          <Icon variant='black' name='Trophy' />
          Турниры
        </Link>
      </Button>
      <Button asChild className={cn(s.button, s.teams)}>
        <Link href='/teams'>
          <Icon variant='black' name='Users' />
          Команды
        </Link>
      </Button>
      <Button onClick={() => spawnBanner(<CreateTournament />)} className={cn(s.button, s.create_tournament)} img='Medal'>
        Создать турнир
      </Button>
      <Button onClick={() => spawnBanner(<CreateTeam />)} className={cn(s.button, s.create_team)} img='Users'>
        Создать команду
      </Button>
    </div>
  )
}