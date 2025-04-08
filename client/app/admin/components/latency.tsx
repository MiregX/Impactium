import s from './latency.module.css'
import { Badge, Gauge, Stack } from "@impactium/components";
import { Icon } from "@impactium/icons";

export namespace Latency {
  export interface Props extends Stack.Props {
    icon: Icon.Name;
    name: string;
    ping: number;
    ip: string;
  }
}

export function Latency({ icon, name, ping, ip, ...props }: Latency.Props) {
  const badgeVariant = (): Badge.Variant => {
    if (ping > 100) {
      return 'red-subtle';
    }

    if (ping > 50) {
      return 'amber-subtle';
    }

    return 'green-subtle';
  }

  return (
    <Stack className={s.latency} dir='column' gap={16} ai='stretch' {...props}>
      <Stack className={s.title} flex={0}>
        <Icon name={icon} />
        <p>{name}</p>
      </Stack>
      <Stack className={s.gauge_wrapper} pos='relative' ai='center' jc='center'>
        <Badge className={s.badge} value={ping + 'ms'} icon='Gauge' variant={badgeVariant()} size='sm' />
        <Gauge className={s.gauge} value={100 - ping} size={72} />
        <p>{ping + 'ms'}</p>
      </Stack>
      <Stack className={s.ip} gap={6} flex={0} jc='center'>
        <Icon name='Info' />
        <span>{ip}</span>
      </Stack>
    </Stack>
  )
}
