import { Badge, BadgeTypes } from '@/ui/Badge';
import s from './TeamPanel.module.css'
import star from '@/public/star.svg'

export function List({ members }) {
  console.log(star)
  return (
    <div className={s.list}>
      {members.map(member => (
        <div className={s.wrapper}>
          <img
            className={s.avatar}
            key={member.name}
            src={member.avatar}
            alt={member.name} />
          <img
            src={star.src}
            className={s.role}
            style={{backgroundColor: `${member.roles[0].color}50`}} />
        </div>
      ))}
    </div>
  );
}