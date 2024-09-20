'use client'
import { useLanguage } from '@/context/Language.context';
import { useApplication } from '@/context/Application.context';
import s from './styles/Description.module.css'
import { useUser } from "@/context/User.context";
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team';
import { EditDescription } from '@/banners/edit_team_description/EditDescription';
import { Icon } from '@/ui/Icon';

interface Description {
  state: Team | Tournament,
  key: 'team' | 'tournament',
}

export function Description({ state, key }: Description) {
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <div className={s.description}>
      <p>{state.description || lang?.[key]?.has_no_description}</p>
        {user?.uid === state.ownerId && <button
          onClick={() => spawnBanner(<EditDescription state={state} key={key} type={key} />)}
          className={s.edit}>
          <Icon name='PenLine' />
        </button>}
    </div>
  )
}