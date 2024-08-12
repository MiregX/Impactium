'use client'
import { TeamOrTournamentProp } from '@/dto/TeamOrTournament.type';
import s from './styles/_.module.css';
import { useLanguage } from '@/context/Language.context';

export function NotFound({ type}: TeamOrTournamentProp) {
  const { lang } = useLanguage();

  return (    
    <div className={s.center}>
      <p>{lang[type].not_found}</p>
    </div>
  );
}