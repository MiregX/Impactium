import { Icon } from '@impactium/icons';
import s from '../Status.module.css';
import { Stack } from '@impactium/components';
import { Color } from '@impactium/design';
import { format } from 'date-fns';
import { between, cn } from '@impactium/utils';
import { Status } from '@/ui/Status';
import { Anapod } from '@impactium/anapod';
import { HTMLAttributes, useCallback } from 'react';

export namespace Service {
  export type Name = 'Next.JS' | 'Nest.JS' | 'Go' | 'CockroachDB' | 'Redis' | 'CDN';

  export interface Props extends Stack.Props {
    log: Anapod.Log
  }
}

export function Service({ log, ...props }: Service.Props) {
  const iconsProps: Icon.Props = {
    name: 'AcronymApi',
  }

  if (iconsProps.name === 'AcronymPage') {
    iconsProps.viewBox = '0 0 28 16';
    iconsProps.width = '28';
}

  if (iconsProps.name === 'AcronymCdn') {
    iconsProps.viewBox = '0 0 16 16';
    iconsProps.style = {
      ...iconsProps.style,
      scale: 1.3,
      width: 20
    }
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
        
      case log.path.includes('cdn.impactium') || log.path.includes('_next'):
        return 'FunctionMiddleware'

      default:
        return 'AcronymPage'
    }
  }
  
  const Method = useCallback(() => <Status color={new Color(between(log.status, 500, 599) ? 'red-800' : 'gray-800')} value={log.method} />, [log]);
  
  return (
    <Stack noShrink flex={0} gap={12} className={cn(s.service, between(log.status, 500, 599) && s.error)} {...props}>
      <Stack>
        <Status color={new Color(getStatusColor(log.status))} value={log.status} />
        <p className={s.domain}>{parseFullUrlToDomain(log.path)}</p>
      </Stack>
      <Stack style={{ minWidth: 156 }} jc='space-between'>
        <Method />
        <Timestamp value={log.timestamp} />
      </Stack>
      <Stack style={{ minWidth: 108 }}>
        <Icon name={getIconNameByPath()} color={between(log.status, 500, 599) ? 'currentColor' : Color.toVar('text-dimmed').toString()} />
        <TimeTook value={log.took} />
      </Stack>
      <p className={s.path}>/{parseFullUrlToPath(log.path)}</p>
    </Stack>
  )
}

interface TimeTookProps {
  value: Anapod.Log['took'];
}

function TimeTook({ value }: TimeTookProps) {
  if (typeof value !== 'number') {
    return <p>?</p>;
  }

  switch (true) {
    case value < 1000:
      return <p>{value}ns</p>;
    case value < 1000000:
      return <p>{(value / 1000).toFixed(2)}µs</p>;
    case value < 1000000000:
      return <p>{(value / 1000000).toFixed(2)}ms</p>;
    default:
      return <p>{(value / 1000000000).toFixed(2)}s</p>;
  }
}

function Timestamp({ value }: TimeTookProps) {
  if (!value) {
    return <p>N/A</p>
  }

  const parts: string[] = [];

  const date = new Date(value);

  // hours
  parts.push(date.getHours().toString().padStart(2, '0'));
  parts.push(':');
  parts.push(date.getMinutes().toString().padStart(2, '0'));
  parts.push(':');
  parts.push(date.getSeconds().toString().padStart(2, '0'));
  parts.push('.');
  parts.push(date.getMilliseconds().toString().padStart(3, '0'));

  return (
    <p>{parts.join('')}</p>
  )
}