'use client'
import { useMessage } from '@/context/Message';
import s from '../Team.module.css'
import { useTeam } from "@/context/Team"
import { useUser } from "@/context/User";
import { EditTeamDescription } from '@/banners/edit_team_description/EditTeamDescription';

export function Description({ isEditable }) {
  const { spawnBanner } = useMessage();
  const { team } = useTeam();

  const lorem = "Lorem ipsum dolor sit amet ❤✝💢 consectetur adipisicing elit. Quod, animi ipsam dolore deserunt blanditiis officia labore cupiditate esse. Asperiores pariatur totam nemo voluptates atque vero laboriosam ad deleniti possimus architecto?"

  return (
    <div className={`${isEditable && s.editable} ${s.description}`}>
      <button
        onClick={() => spawnBanner(<EditTeamDescription team={team} />)}
        className={s.edit}>
        <img src='https://cdn.impactium.fun/ui/pencil/pencil-line.svg' />
      </button>
      <p>{team.description || lorem}</p>
    </div>
  )
}