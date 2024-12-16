'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import s from './Status.module.css'
import { Service } from "./components/Service";
import { Input } from "@/ui/Input";
import { Analytics } from '@impactium/analytics';
import { Skeleton, Button, Stack, Cell } from "@impactium/components";
import { Graph } from "./components/Graph";
import { cn } from "@impactium/utils";
import { Color } from '@impactium/design';
import { MaybeArray } from "@impactium/types";
import { DetailedPathInformation } from "./components/DetailedPathInformation";

interface Unit {
  count: number
}

export default function StatusPage() {
  const [logs, setLogs] = useState<Analytics.Logs>([])
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [counts, setCounts] = useState<Map<string, Unit>>(new Map());
  const [totalCount, setTotalCount] = useState<number>(0);
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    Analytics.Initialize({
      url: '/api/v2'
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

  const insertLogs = (newLogs: Analytics.Logs = []) => setLogs(logs => [...logs, ...newLogs]);

  useEffect(() => {
    if (totalCount === 0) {
      Analytics.Count()
    }
  }, [totalCount]);

  
  useEffect(() => {
    Analytics.Fetch().then(insertLogs);
  }, []);

  const runQuery = () => {
    setLogs([]);

    Analytics.Fetch().then(insertLogs);
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

    const count = await Analytics.Count(`path=${path.toWellFormed()}`);

    setTarget(path);
    setCounts(c => {
      c.set(path, { count });

      return c
    });

    setIsGraphLoading(false);
  }

  const contentScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    if (Math.round(event.currentTarget.scrollTop) >= event.currentTarget.scrollHeight - event.currentTarget.clientHeight) {
      Analytics.Fetch().then(insertLogs);
    }
  }

  const [ws, setWs] = useState<WebSocket | null>(null);

  const wsMessageHandler = (event: MessageEvent) => {
    try {
      let newLogs: MaybeArray<Analytics.Log> = JSON.parse(event.data);

      if (!Array.isArray(newLogs)) {
        newLogs = [newLogs];
      }

      setTotalCount(c => c + newLogs.length);

      setLogs(prevLogs => {
        const logsMap: Map<Analytics.RequestID, Analytics.Log> = new Map();

        prevLogs.forEach(log => {
          logsMap.set(log.req_id, log);
        });
  
        newLogs.forEach(log => {
          logsMap.set(log.req_id, log);
        });

        return Array.from(logsMap.values()).sort((a, b) => b.timestamp  - a.timestamp);
      });
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  useEffect(() => {
    setWs(Analytics.WS());

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
    <PanelTemplate className={s.panel} useColumn>
      <Stack gap={12} className={cn(s.wrapper, isAnalyticsOpen && s.translate)} dir='column' pos='relative'>
        <Cell top right background={color} />
        <Cell right bottom background={color}>
          <Button loading={loading} img='PlayCircle' variant='ghost' onClick={runQuery} />
        </Cell>
        <Cell top left background={color} />
        <Cell bottom left background={color}>
          <Button img='ChartPie' variant='ghost' onClick={() => setIsAnalyticsOpen(v => !v)} />
        </Cell>
        <Graph data-open={isAnalyticsOpen} className={s.graph} loading={isGraphLoading}>
          {target ? <DetailedPathInformation data={counts.get(target)} /> : null}
        </Graph>
        <Stack gap={16} style={{ width: '100%' }}>
          <Button variant='outline' img='SettingsSliders' />
          <Input value={filter} onChange={changeInputFilterHandler} img='Search' placeholder={`${totalCount} logs total found...`} />
          <Button variant='outline' img='MoreHorizontal' />
        </Stack>
        <Stack className={s.description} style={{ width: '100%', marginBottom: 6 }}>
          <p>Time</p>
          <p>Host</p>
          <p>Response</p>
          <p>Message</p>
        </Stack>
        <Stack dir='column' gap={0} className={s.content} onScroll={contentScrollHandler}>
          {logs.map(log => <Service onMouseEnter={() => statusHoverHandler(log.path)} log={log} />)}
        </Stack>
      </Stack>
    </PanelTemplate>
  )
}
