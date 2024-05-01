import s from './Onboard.module.css'
import os from '@/public/os.jpg'

export function Arcana() {
  return (
    <div className={s.arcana}>
      <img src={os.src} />
    </div>
  )
}