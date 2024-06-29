import { Addictional } from './Addictional'
import { Operational } from './Operational'
import s from './styles/Footer.module.css'

export function Footer() {
  return (
    <footer className={s.wrapper}>
      <div className={s.content}>
        <Operational />
        <Addictional />
      </div>
    </footer>
  )
}