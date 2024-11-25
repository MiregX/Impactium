import { Icon } from '@impactium/icons';
import s from './styles/ServiceUnit.module.css';
import { Card } from '@/ui/Card';
import { Stack } from '@/ui/Stack';
import { Badge, BadgeType } from '@/ui/Badge';
import { Dot, DotProps } from './Dot';
import { capitalize } from 'lodash';

export namespace Service {
  export type Name = 'Next.JS' | 'Nest.JS' | 'Go' | 'CockroachDB' | 'Redis' | 'Nginx';

  export type Type = 'frontend' | 'backend' | 'database' | 'middleware';

  export interface Props {
    icon: Icon.Name;
    name: Name;
    type: Type;
    from?: Icon.From
    size?: number
    dots?: DotProps['side'][]
  }
}

export function Service({ icon, name, type, from, size, dots = [] }: Service.Props) {
  return (
    <Card className={s.service}>
      <Stack flex={0}>
        <Icon name={icon} from={from} size={size} />
        <Badge type={BadgeType[type]} title={capitalize(type) + ` | ${name}`} />
      </Stack>
      {dots.map(dot => <Dot side={dot} />)}
    </Card>
  )
}
