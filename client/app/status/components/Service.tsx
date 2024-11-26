import { Icon } from '@impactium/icons';
import s from '../Status.module.css';
import { Stack } from '@/ui/Stack';
import { λ } from '@/decorator/λ.class';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/ui/Skeleton';
import { DesignSystem, Utils } from '@impactium/utils';
import { format } from 'date-fns';
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

export function Service({ path, icon }: Service.Props) {
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

  const iconsProps: Icon.Props = {
    name: icon,
    color: 'currentColor'
  }

  if (iconsProps.name === 'AcronymPage') {
    iconsProps.viewBox = '0 0 28 16';
    iconsProps.width = '28';
  }

  const parseFullUrlToPath = (path: string) => {
    return path.split('/').slice(3).join('/');
  }
  
  return (
    <Skeleton show={loading} width='full' height='unset'>
      <Stack flex={0} className={cn(s.service, (response?.status || 0) > 499 && s.error)}>
        <Method value={'GET'} />
        <p>{format(startAt, 'HH:mm.SS')}</p>
        <Stack style={{ padding: '0 12px', minWidth: 96 }}>
          <Status value={response?.status || 0} />
          {responseTime && <p>{responseTime / 1000 > 1 && Math.round(responseTime / 1000) + 's'}{(responseTime / 1000).toString().split('.')[1].replaceAll('0', '')}ms</p>}
        </Stack>
        <Stack jc='start'><Icon {...iconsProps} /></Stack>
        <span className={s.path}>/{parseFullUrlToPath(path)}</span>
    </Stack>
    </Skeleton>
  )
}

export interface StatusProps {
  value: number;
}

function Status({ value }: StatusProps) {
  const getStatusColor = (value: number) => {
    switch (true) {
      case Utils.between(value, 200, 299):
        return 'green-800';
      case Utils.between(value, 300, 399):
        return 'blue-800';
      case Utils.between(value, 400, 499):
        return 'amber-800';
      default:
        return 'red-800';
    }
  }

  const color = new DesignSystem.Color(getStatusColor(value));

  const borderColor = new DesignSystem.Color(color).minus(4).valueOf();

  return (
    <span className={cn(s.status, Utils.between(value, 500, 599) && s.error)} style={{ borderColor, color: color.valueOf() }}>
      {value}
    </span>
  )
}

interface MethodProps {
  value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
}
