import { TeamMember } from './TeamPanel';
import s from './TeamPanel.module.css'
import star from '@/public/star.svg'

export function List({ members }) {
  console.log(star)
  return (
    <div className={s.list}>
      {members.map((member: TeamMember, index: number) => (
        <div className={s.wrapper} key={index}>
          <img
            className={s.avatar}
            key={member.name}
            src={member.avatar}
            alt={member.name} />
          <img
            src={star.src}
            className={s.role}
            style={{backgroundColor: `${member.keyrole.color}50`}} />
        </div>
      ))}
    </div>
  );
}