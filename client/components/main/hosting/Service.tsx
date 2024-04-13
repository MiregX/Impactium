import arrow from '@/public/chevron-right-md.svg'
import s from '@/styles/main/Hosting.module.css'

export function Service({ type }) {
  const map = {
    hosting: {
      src: 'https://cdn.impactium.fun/el/servers.png',
      title: 'Хостинг игровых серверов',
      icon: 'https://cdn.impactium.fun/ui/specific/data.svg',
      desc: 'Надёжные и быстрые VPS сервера способные выдержать любые нагрузки'
    },
    developer: {
      src: 'https://cdn.impactium.fun/el/developing.png',
      title: 'Создание сайтов',
      icon: 'https://cdn.impactium.fun/ui/specific/puzzle.svg',
      desc: 'Наша команда разработчиков способна реализовать любые потребности вашего бизнеса за разумную цену' 
    }
  }
  const { src, title, icon, desc } = map[type];
  return (
    <div className={s.service}>
      <div className={s.left} style={{backgroundImage: `url('${src}')`}}></div>
      <div className={s.right}>
        <h4>
          <img src={icon} alt='' />
          {title}
        </h4>
        <hr />
        <p>{desc}</p>
        <button className={s.process}>Приобрести<img src={arrow.src} /></button>
      </div>
    </div>
  );
}