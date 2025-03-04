'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import s from './styles/runtime.module.css';
import { Log } from './log';
// import { Input, Tooltip } from '@impactium/components';
import { Anapod } from '../index';
import { Button, Stack, Cell, Skeleton } from '@impactium/components';
import { cn } from '@impactium/utils';
import { Color } from '@impactium/design';
import { MaybeArray } from '@impactium/types';

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

  const changeInputFilterHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setFilter(value);
  }

  const color = new Color('soft-black').toString();

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

        return Array.from(logsMap.values()).sort((a, b) => b.timestamp  - a.timestamp).slice(0, 32);
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
      <Cell top right background={color}>
        {totalCount}
      </Cell>
      <Cell right bottom background={color}>
        <Button loading={loading} img='PlayCircle' variant='ghost' onClick={runQuery} />
      </Cell>
      <Cell top left background={color} />
      <Cell bottom left background={color}>
        <Button img='ChartPie' variant='ghost' onClick={() => setIsAnapodOpen(v => !v)} />
      </Cell>
      <Stack gap={16} style={{ width: '100%' }}>
        <Button variant='outline' img='SettingsSliders' />
        {/* <Input value={filter} onChange={changeInputFilterHandler} img='Search' placeholder={`${totalCount} logs total found...`} /> */}
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
        {logs.map((log, index) => <Skeleton delay={-4} height='unset' width='unset' show={index < loadingLogs}><Log onMouseEnter={() => statusHoverHandler(log.path)} log={log} /></Skeleton>)}
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
        return 'amber-900'
      case 1:
        return 'green-900'
      default:
        return 'red-900'
    }
  }

  const color = new Color(getDotColorByWebSocketStatus());

  return (
    null
    // <Tooltip.Provider>
    //   <Tooltip.Frame>
    //     <Tooltip.Trigger>
    //       <Icon name='Status' fromGeist color={color.toString()} />
    //     </Tooltip.Trigger>
    //     <Tooltip.Content>
    //       <p>WebSocket Status</p>
    //     </Tooltip.Content>
    //   </Tooltip.Frame>
    // </Tooltip.Provider>
  )
}
