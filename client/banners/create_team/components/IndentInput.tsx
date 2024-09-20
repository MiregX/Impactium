'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language.context';
import { Team } from '@/dto/Team';

interface IndentInputProps {
  team: Team;
  error?: string;
  setTeam: React.Dispatch<React.SetStateAction<Team>>; // Correct type for setTeam
}

export function IndentInput({ team, error, setTeam }: IndentInputProps) {
  const { lang } = useLanguage();

  const handleIndentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.slice(0, 32);
    const regex = /^(?!.*[-_]{2,})[0-9a-z_-]*$/;
    const newIndent = inputValue.match(regex) || inputValue === '' ? inputValue : team.indent;

    setTeam(prevTeam => ({
      ...prevTeam,
      indent: newIndent
    }));
  };

  return (
    <div className={s.group}>
      <p>{lang.create_team.indent + '*'}<span className={s.error}>{error}</span></p>
      <Input
        placeholder={lang.create_team.indent}
        img='AtSign'
        value={team.indent || ''}
        onChange={handleIndentChange}
        className={s.input}
      />
    </div>
  );
}
