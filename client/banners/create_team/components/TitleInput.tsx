'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language';
import { CreateTeamDto } from '@api/main/team/team.dto';
import { TeamEntity } from '@api/main/team/team.entity';

export function TitleInput({ team, handle }) {
  const { lang } = useLanguage();

  return (
    <div className={s.group}>
      <p>{lang.create_team.title}</p>
      <Input
        type="text"
        image='https://cdn.impactium.fun/ui/text/paragraph.svg'
        placeholder={lang.create_team.title}
        value={team?.title || ''}
        onChange={(e) => handle({ title: e.target.value })}
        style={[s.input]}
      />
    </div>
  );
}