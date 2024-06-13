'use client'
import { useLanguage } from '@/context/Language';
import { useApplication } from '@/context/Application';
import s from './Description.module.css'
import { useUser } from "@/context/User";
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team';
import { EditDescription } from '@/banners/edit_team_description/EditDescription';

interface Description {
  state: Team | Tournament,
  key: string,
}

export function Description({ state, key }: Description) {
  const { spawnBanner } = useApplication();
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <div className={s.description}>
      <p>{state.description || lang?.[key]?.has_no_description}</p>
        {user?.uid === state.ownerId && <button
          onClick={() => spawnBanner(<EditDescription state={state} key={key} />)}
          className={s.edit}>
          <img src='https://cdn.impactium.fun/ui/pencil/pencil-line.svg' />
        </button>}
    </div>
  )
}