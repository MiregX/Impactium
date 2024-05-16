'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language';

export function IndentInput({ team, error, setTeam }) {
  const { lang } = useLanguage();

  return (
    <div className={s.group}>
      <p>{lang.create_team.indent + '*'}<span className={s.error}>{error}</span></p>
      <Input
        placeholder={lang.create_team.indent}
        image='https://cdn.impactium.fun/ui/specific/mention.svg'
        value={team?.indent || ''}
        onChange={(e) => setTeam((team) => {
          const inputValue = e.target.value.slice(0, 24); // Ограничение длины айди до 24 символов
          return {
            ...team,
            indent: inputValue.match(/^(?!.*[-_]{2,})[0-9a-z_-]*$/) || inputValue === '' ? inputValue : team.indent
          };
        })}
        style={[s.input]}
      />
    </div>
  );
}
