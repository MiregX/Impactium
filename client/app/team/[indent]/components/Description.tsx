'use client'
import { useLanguage } from '@/context/Language';
import { useMessage } from '@/context/Message';
import s from '../Team.module.css'
import { useTeam } from "@/context/Team"
import { useUser } from "@/context/User";
import { EditTeamDescription } from '@/banners/edit_team_description/EditTeamDescription';

export function Description() {
  const { spawnBanner } = useMessage();
  const { team } = useTeam();
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <div className={s.description}>
      {user?.uid === team.ownerId && <button
        onClick={() => spawnBanner(<EditTeamDescription team={team} />)}
        className={s.edit}>
        <img src='https://cdn.impactium.fun/ui/pencil/pencil-line.svg' />
      </button>}
      <p>{team.description || lang.team.has_no_description}</p>
    </div>
  )
}