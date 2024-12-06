'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { ChangeEvent, UIEventHandler, useEffect, useReducer, useState } from 'react';
import s from './Status.module.css'
import { Service } from "./components/Service";
import { Input } from "@/ui/Input";
import { Analytics } from '@impactium/analytics';
import { Skeleton, Button, Stack, Cell } from "@impactium/components";
import { Graph } from "./components/Graph";
import { cn } from "@impactium/utils";
import { Color } from '@impactium/design';
import { ChartConfig, ChartContainer } from "@/ui/chart";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

interface Unit {
  path: string,
  count: number
}

export default function StatusPage() {
  const [logs, setLogs] = useState<Analytics.Logs>([])
  const [requested, setRequested] = useState(0);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const [isFilterValid, setIsFilterValid] = useState<boolean>(true);
  const filterRegexp = /^(\w+):\s*([><=]{1,2})\s*([^\s]+)$/;
  const [loading, setLoading] = useState<boolean>(false);


  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [counts, setCounts] = useState<Unit[]>([]);

  const increaseRequested = () => setRequested(requested => requested + 50);

  const insertLogs = (newLogs: Analytics.Logs = []) => setLogs(logs => [...logs, ...newLogs]);

  const fetchLogs = () => api<Analytics.Logs>(`/v2/logs?limit=50&skip=${filter ? 0 : requested}${filter ? `&filter=${filter}` : ''}`, {
    setLoading
  }, insertLogs).then(data => {
    if (!data) {
      setIsFilterValid(false);
    }
  }) || [];

  useEffect(() => {
    increaseRequested();
  }, [])

  useEffect(() => {
    if (requested > 0) {
      fetchLogs();
    }
  }, [requested]);

  const runQuery = () => {
    setLogs([]);
    setRequested(0);

    fetchLogs();
  }

  const changeInputFilterHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setIsFilterValid(filterRegexp.test(value));

    setFilter(value);
  }

  const color = new Color('soft-black').toString();

  const statusHoverHandler = async (path: string) => {
    const amount = counts.find(c => c.path === path);

    if (amount) return;

    setIsGraphLoading(true);

    const count = await Analytics.Count({ path });

    setCounts(c => [...c, { path, count }]);
    setIsGraphLoading(false);
  }

  const contentScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    if (Math.round(event.currentTarget.scrollTop) >= event.currentTarget.scrollHeight - event.currentTarget.clientHeight) {
      increaseRequested();
    }
  }

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
        </Graph>
        <Stack gap={16} style={{ width: '100%' }}>
          <Button variant='outline' img='SettingsSliders' />
          <Input valid={isFilterValid} value={filter} onChange={changeInputFilterHandler} img='Search' placeholder='2.7M logs total found...' />
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
          {Array.from({ length: requested - logs.length }).map((_, i) => <Skeleton width='full' style={{ flexShrink: 0 }} height={28} />)}
        </Stack>
      </Stack>
    </PanelTemplate>
  )
}
