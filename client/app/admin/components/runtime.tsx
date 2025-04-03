'use client'
import React, { useEffect, useState } from 'react';
import s from './runtime.module.css';
import { Input } from '@impactium/components';
import { Anapod } from '@impactium/anapod';
import { Button, Stack, Skeleton } from '@impactium/components';
import { cn } from '@impactium/utils';
import { Color } from '@impactium/design';
import { MaybeArray } from '@impactium/types';
import { Icon } from '@impactium/icons';
import { Log } from './log';

interface Unit {
  count: number
}

export namespace Runtime {
  export interface Props extends Anapod.Grid.Props, Stack.Props {
  }
}

export function Runtime({
  ...props
}: Runtime.Props) {
  Anapod.Grid.apply(props);

  const [logs, setLogs] = useState<Anapod.Log[]>([])
  const [isAnapodOpen, setIsAnapodOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [counts, setCounts] = useState<Map<string, Unit>>(new Map());
  const [totalCount, setTotalCount] = useState<number>();
  const [target, setTarget] = useState<string | null>(null);
  const [loadingLogs, setLoadingLogs] = useState<number>(0);

  const changeInputFilterHandler = () => {

  }

  useEffect(() => {
    Anapod.Initialize({
      url: '/api/v2',
      defaultLimit: 50,
      overallUpdateInterval: 5000
    });
  }, []);

  const enterButtonKeyboardHandler = (event: KeyboardEvent) => {
    if (event.key === 'Enter') runQuery();
  }

  useEffect(() => {
    window.addEventListener('keydown', enterButtonKeyboardHandler);

    return () => {
      window.removeEventListener('keydown', enterButtonKeyboardHandler)
    }
  }, []);

  const insertLogs = (newLogs: Anapod.Log[] = []) => setLogs(logs => [...logs, ...newLogs]);

  useEffect(() => {
    if (typeof totalCount !== 'number') {
      Anapod.Count().then(setTotalCount);
    }
  }, [totalCount, setTotalCount]);

  useEffect(() => {
    Anapod.Fetch().then(insertLogs);
  }, []);

  const runQuery = () => {
    setLogs([]);

    Anapod.Fetch({ filter }).then(insertLogs);
  }

  const statusHoverHandler = async (path: string) => {
    const amount = counts.get(path);

    if (amount) return;

    setIsGraphLoading(true);

    const count = await Anapod.Count(`path=${path.toWellFormed()}`);

    setTarget(path);
    setCounts(c => {
      c.set(path, { count });

      return c
    });

    setIsGraphLoading(false);
  }

  const contentScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    if (Math.round(event.currentTarget.scrollTop) >= event.currentTarget.scrollHeight - event.currentTarget.clientHeight) {
      Anapod.Fetch({ skip: logs.length }).then(insertLogs);
    }
  }

  const [ws, setWs] = useState<WebSocket | null>(null);

  const wsMessageHandler = (event: MessageEvent) => {
    try {
      let newLogs: MaybeArray<Anapod.Log> = JSON.parse(event.data);

      if (!Array.isArray(newLogs)) {
        newLogs = [newLogs];
      }

      setTotalCount(c => (c || 0) + newLogs.length);

      setLoadingLogs(ll => {
        newLogs.forEach((_, i) => {
          setTimeout(() => {
            setLoadingLogs(lx => lx - 1);
          }, (i + 1) * Math.random() * 15);
        });

        return ll + newLogs.length
      });

      setLogs(prevLogs => {
        const logsMap: Map<Anapod.RequestID, Anapod.Log> = new Map();

        prevLogs.forEach(log => {
          logsMap.set(log.req_id, log);
        });

        newLogs.forEach(log => {
          logsMap.set(log.req_id, log);
        });

        return Array.from(logsMap.values()).sort((a, b) => b.timestamp - a.timestamp).slice(0, 32);
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  useEffect(() => {
    setWs(Anapod.WS());

    return () => {
      setWs(null);
    }
  }, [])

  useEffect(() => {
    if (!ws) return;

    ws.addEventListener('open', () => ws.addEventListener('message', wsMessageHandler));

    return () => ws.removeEventListener('message', wsMessageHandler);
  }, [ws]);

  return (
    <Stack gap={12} className={cn(s.wrapper, isAnapodOpen && s.translate)} dir='column' pos='relative' {...props}>
      <Stack gap={16} style={{ width: '100%' }}>
        <Button variant='outline' img='SettingsSliders' />
        <Input variant='highlighted' value={filter} onChange={changeInputFilterHandler} img='Search' placeholder={`${totalCount} logs total found...`} />
        <WebSocketStatus ws={ws} />
        <Button variant='outline' img='MoreHorizontal' />
      </Stack>
      <Stack className={s.description} style={{ width: '100%', marginBottom: 6 }}>
        <p>Time</p>
        <p>Host</p>
        <p>Response</p>
        <p>Message</p>
      </Stack>
      <Stack dir='column' gap={0} className={s.content} onScroll={contentScrollHandler}>
        {logs.map((log, index) => <Skeleton key={index} delay={-4} height='unset' width='unset' show={index < loadingLogs}><Log onMouseEnter={() => statusHoverHandler(log.path)} log={log} /></Skeleton>)}
      </Stack>
    </Stack>
  )
}

export interface WebSocketStatusProps {
  ws: WebSocket | null
}

function WebSocketStatus({ ws }: WebSocketStatusProps) {
  const getDotColorByWebSocketStatus = (): string => {
    switch (ws?.readyState) {
      case 0:
        return 'amber-100'
      case 1:
        return 'green-100'
      default:
        return 'red-100'
    }
  }

  const color = new Color(getDotColorByWebSocketStatus());

  return (
    <Stack style={{ backgroundColor: color.plus(1).toString(), height: 32, width: 32, flexShrink: '0 !important', borderRadius: 6 }} ai='center' jc='center'>
      <Icon name='Status' fromGeist color={color.plus(8).toString()} />
    </Stack>

  )
}