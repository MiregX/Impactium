'use client'
import { Button } from '@/ui/Button';
import s from './styles/ПошёлНахуй.module.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CreateTournament } from '@/banners/create_tournament/CreateTournament';
import { useApplication } from '@/context/Application.context';
import CreateTeam from '@/banners/create_team/CreateTeam';
import Image from 'next/image';

export function ПошёлНахуй() {
  const { spawnBanner } = useApplication();

  return (
    <div className={s.wrapper}>
      <h1>Пошёл</h1>
      <h2>нахуй</h2>
      <h3>сын</h3>
      <h4>мёртвой</h4>
      <h5>шлюхи.</h5>
      <h6>Чё хочу, то, блять, и делаю.</h6>
      <Button asChild className={cn(s.button, s.tournaments)}>
        <Link href='/tournaments'>
          <Image src='https://cdn.impactium.fun/ui/specific/trophy.svg' alt='' width={20} height={20} />
          Турниры
        </Link>
      </Button>
      <Button asChild className={cn(s.button, s.teams)}>
        <Link href='/teams'>
          <Image src='https://cdn.impactium.fun/ui/user/users-group.svg' alt='' width={20} height={20} />
          Команды
        </Link>
      </Button>
      <Button onClick={() => spawnBanner(<CreateTournament />)} className={cn(s.button, s.create_tournament)} img='https://cdn.impactium.fun/ui/specific/cluster.svg'>
        Создать турнир
      </Button>
      <Button onClick={() => spawnBanner(<CreateTeam />)} className={cn(s.button, s.create_team)} img='https://cdn.impactium.fun/ui/specific/node.svg'>
        Создать команду
      </Button>
    </div>
  )
}