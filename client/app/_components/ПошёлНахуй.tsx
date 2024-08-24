'use client'
import { Button } from '@/ui/Button';
import s from './styles/ПошёлНахуй.module.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CreateTournament } from '@/banners/create_tournament/CreateTournament';
import { useApplication } from '@/context/Application.context';
import CreateTeam from '@/banners/create_team/CreateTeam';
import Image from 'next/image';

interface ПошёлНахуйProps {
  mode: 'default' | 'frendly'
}

export function ПошёлНахуй({ mode }: ПошёлНахуйProps) {
  const { spawnBanner } = useApplication();
  
  const map = {
    default: ['Пошёл', 'нахуй', 'сын', 'мёртвой', 'шлюхи.', 'Чё хочу, то, блять, и делаю.'],
    frendly: ['Просто', 'сервис', 'для', 'проведения', 'турниров', 'Реально, никакого подвоха.']
  }[mode];

  return (
    <div className={s.wrapper}>
      {map.map((word, i) => {
        const Tag = `h${i + 1}` as keyof JSX.IntrinsicElements;
        return <Tag key={i}>{word}</Tag>
      })}
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