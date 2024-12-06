import { Icon } from '@impactium/icons';
import s from '../Status.module.css';
import { Stack } from '@impactium/components';
import { Color } from '@impactium/design';
import { format } from 'date-fns';
import { between, cn } from '@impactium/utils';
import { Status } from '@/ui/Status';
import { Analytics } from '@impactium/analytics';
import { HTMLAttributes, useCallback } from 'react';

export namespace Service {
  export type Name = 'Next.JS' | 'Nest.JS' | 'Go' | 'CockroachDB' | 'Redis' | 'CDN';

  export interface Props extends Stack.Props {
    log: Analytics.Log
  }
}

export function Service({ log, ...props }: Service.Props) {
  const logEntity = new Analytics.LogEntity(log);

  const iconsProps: Icon.Props = {
    name: 'AcronymApi',
  }

  if (iconsProps.name === 'AcronymPage') {
    iconsProps.viewBox = '0 0 28 16';
    iconsProps.width = '28';
  }

  const parseFullUrlToPath = (path: string) => path.split('/').slice(3).join('/');
  
  const parseFullUrlToDomain = (path: string) => {
    return path.split('/').slice(2, 3).join('/').split(':')[0];
  }

  const getStatusColor = (value: number) => {
    switch (true) {
      case between(value, 200, 299):
        return 'green-800';
      case between(value, 300, 399):
        return 'blue-800';
      case between(value, 400, 499):
        return 'amber-800';
      default:
        return 'red-800';
    }
  }

  const getIconNameByPath = (): Icon.Name => {
    switch (true) {
      case log.path.includes('/api/v2'):
        return 'FunctionGo'
        
      case log.path.includes('/api'):
        return 'FunctionNest'
        
      case log.path.startsWith('https://cdn'):
        return 'AcronymCdn'

      default:
        return 'FunctionSquare'
    }
  }
  
  const Method = useCallback(() => <Status color={new Color(logEntity.isFatal() ? 'red-800' : 'gray-800')} value={log.method} />, [log]);
  
  return (
    <Stack noShrink flex={0} gap={12} className={cn(s.service, logEntity.isFatal() && s.error)} {...props}>
      <Stack>
        <Status color={new Color(getStatusColor(log.status))} value={log.status} />
        <p className={s.domain}>{parseFullUrlToDomain(log.path)}</p>
      </Stack>
      <Stack style={{ minWidth: 156 }} jc='space-between'>
        <Method />
        <p>{format(log.timestamp, 'HH:mm:SS') + `.${new Date(log.timestamp).getMilliseconds()}`}</p>
      </Stack>
      <Stack style={{ minWidth: 108 }}>
        <Icon name={getIconNameByPath()} color={logEntity.isFatal() ? 'currentColor' : Color.toVar('text-dimmed').toString()} />
        <TimeTook value={log.took} />
      </Stack>
      <p className={s.path}>/{parseFullUrlToPath(log.path)}</p>
    </Stack>
  )
}

interface TimeTookProps {
  value: Analytics.Log['took'];
}

function TimeTook({ value }: TimeTookProps) {
  if (!value || value < 1) {
    return <p>{'<1ms'}</p>
  }

  const getSeconds = () => (value / 1000).toFixed(2) + 's';

  const getMilliseconds = () => parseMilliseconds((value / 1000).toString().split('.')) + 'ms'

  const parseMilliseconds = (value: string[]) => value[1].replaceAll('0', '');

  return (
    <p>{value / 1000 > 1 ? getSeconds() : getMilliseconds()}</p>
  )
}
