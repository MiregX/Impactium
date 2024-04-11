import arrow from '@/public/chevron-right-md.svg'
import s from './Hosting.module.css'

export function Service({ src, title, desc }) {
  return (
    <div className={s.service}>
      <div className={s.left}>
        <h4>{title}</h4>
        <div>{desc}</div>
      </div>
      <div className={s.right}>
        <button className={s.process}>Приобрести<img src={arrow.src} /></button>
      </div>
    </div>
  );
}