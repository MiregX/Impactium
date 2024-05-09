'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language';
import { TeamEntity } from '@api/main/team/team.entity';

export function IndentInput({ team, setTeam }) {
  const { lang } = useLanguage();

  return (
    <div className={s.group}>
      <p>{lang.create_team.indent}</p>
      <Input
        placeholder={lang.create_team.indent}
        image='https://cdn.impactium.fun/ui/specific/mention.svg'
        value={team?.indent || ''}
        onChange={(e) => setTeam((team: TeamEntity) => {
          return {
            ...team,
            indent: e.target.value.match(/^[0-1a-z_\-]+$/) || e.target.value === '' ? e.target.value : team.indent
          };
        })}
        style={[s.input]}
      />
    </div>
  );
}
