'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language';
import { Team } from '@/dto/Team';

interface TitleInputProps {
  team: Team,
  handle: any
}

export function TitleInput({ team, handle }: TitleInputProps) {
  const { lang } = useLanguage();

  return (
    <div className={s.group}>
      <p>{lang.create_team.title + '*'}</p>
      <Input
        type="text"
        image='https://cdn.impactium.fun/ui/text/paragraph.svg'
        placeholder={lang.create_team.title}
        value={team?.title || ''}
        onChange={(e) => handle({ title: e.target.value })}
        className={s.input}
      />
    </div>
  );
}