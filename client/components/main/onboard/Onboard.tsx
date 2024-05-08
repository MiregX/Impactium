import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton'
import { Arcana } from './Arcana'
import s from './Onboard.module.css'
import { PanelTemplate } from '@/components/main/PanelTempate'
import CreateTeam from '@/banners/create_team/CreateTeam'
import { useMessage } from '@/context/Message'

export function Onboard() {
  const { spawnBanner } = useMessage();

  return (
    <PanelTemplate>
      <Arcana />
      <div className={s.onboard}>
        <h3>Турниры Dota 2</h3>
        <p>Мы - технологичный и современный сервис для проведения любительских и профессиональных турниров в игре Dota 2. Прими участие в один клик. Отслеживай статистику. Получай уведомления о новых турнирах. Получай призы</p>
        <h4><img src='https://cdn.impactium.fun/ui/user/users-group.svg'/> Найди идеальную команду, или возглавь собственную.</h4>
        <p>С нашими алгоритмами подбора мы найдём тебе зассаных агентов габена которую будут руинить тебе каждую игру.</p>
        <div className={s.group}>
          <GeistButton options={{
            type: GeistButtonTypes.Link,
            href: '/teams',
            text: 'Найти команду',
            style: [ s.button ]
          }} />
          <GeistButton options={{
            type: GeistButtonTypes.Button,
            action: () => spawnBanner(<CreateTeam />),
            text: 'Создать команду',
            minimized: true
          }} />
        </div>
        <h4><img src='https://cdn.impactium.fun/ui/specific/ticket-voucher.svg'/> Прими участие в турнире <span>бесплатно</span>!</h4>
        <p>Мы предоставим удобную панель управления и высококачественную стандартизацию. Уведомим команды об изменениях, а зрителей о начале турнира. Настройте событие заполнив небольшую форму - об остальном позаботимся мы сами.</p>
        <div className={s.group}>
          <GeistButton options={{
            type: GeistButtonTypes.Link,
            href: '/me/actions',
            text: 'Найти турнир',
            style: [ s.button ]
          }} />d
          <GeistButton options={{
            type: GeistButtonTypes.Link,
            href: '/me/actions',
            text: 'Создать турнир',
            minimized: true
          }} />
        </div>
      </div>
      
    </PanelTemplate>
  )
}