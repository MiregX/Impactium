import { Icon } from '@impactium/icons';
import s from '../Status.module.css';
import { Stack } from '@/ui/Stack';
import { Badge, BadgeType } from '@/ui/Badge';
import { capitalize } from 'lodash';
import { λ } from '@/decorator/λ.class';
import { useEffect, useState } from 'react';
import { ResponseBase } from '@/dto/Response.dto';
import { Skeleton } from '@/ui/Skeleton';
import { DesignSystem } from '@impactium/utils';
import { format, formatDate } from 'date-fns';
import { cn } from '@/lib/utils';

export namespace Service {
  export type Name = 'Next.JS' | 'Nest.JS' | 'Go' | 'CockroachDB' | 'Redis' | 'Nginx';

  export type Type = 'frontend' | 'backend' | 'database' | 'middleware';

  export interface Props {
    type: Type;
    path: string;
    icon: Icon.Name;
    name: Name;
  }
  
}

export function Service({ type, path, icon }: Service.Props) {
  const [response, setResponse] = useState<Response>();
  const [startAt, setStartAt] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const load = async () => {
      const startAt = Date.now();
      
      setStartAt(startAt);
      
      try {
        const res = await fetch(path);
        setResponse(res);
      } catch (error) {
        setResponse(new λ() as unknown as Response);
      }
      setResponseTime(Date.now() - startAt);
    }

    load().then(() => setLoading(false));
  }, [path])

  function Method({ value }: MethodProps) {
    return (
      <span className={cn(s.status, (response?.status || 0) > 499 && s.error)}>
        {value}
      </span>
    )
  }
  
  return (
    <Skeleton show={loading} width='full' height='unset'>
      <Stack flex={0} className={cn(s.service, response?.ok !== true && s.error)}>
        <p>{format(startAt, 'HH:mm.SS')}</p>
        <Stack style={{ padding: '0 12px'}}>
          <Status value={response?.status || 0} />
          <p>{responseTime / 1000 > 1 && Math.round(responseTime / 1000) + 's'}{(responseTime / 1000).toString().split('.')[1].replace('0', '')}ms</p>
        </Stack>
        <Icon name={icon} color='currentColor' />
        <Method value={'GET'} />
        <span>{path}</span>
    </Stack>
    </Skeleton>
  )
}

export interface StatusProps {
  value: number;
}

function Status({ value }: StatusProps) {
  const color = new DesignSystem.Color(value >= 200 && value <= 299
    ? 'green-800'
    : value >= 300 && value <= 399
      ? 'blue-800'
      : value >= 400 && value <= 499
        ? 'amber-800'
        : 'red-800'
  ).valueOf();

  const borderColor = new DesignSystem.Color(color).minus(4).valueOf();

  return (
    <span className={cn(s.status, value > 499 && s.error)} style={{ borderColor, color }}>
      {value}
    </span>
  )
}

interface MethodProps {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
}
