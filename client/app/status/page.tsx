'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { useEffect, useReducer, useState } from 'react';
import s from './Status.module.css'
import { Stack } from "@/ui/Stack";
import { Button } from "@/ui/Button";
import { Service } from "./components/Service";
import { Input } from "@/ui/Input";
import { Analytics } from '@impactium/analytics';
import { Skeleton } from "@/ui/Skeleton";

export default function StatusPage() {
  const [logs, setLogs] = useState<Analytics.Logs>([])
  const [requested, setRequested] = useState(0);

  const increaseRequested = () => setRequested(requested => requested + 10);

  const insertLogs = (newLogs: Analytics.Logs = []) => setLogs(logs => [...logs, ...newLogs]);

  const fetchLogs = () => api<Analytics.Logs>(`/v2/logs?skip=${requested}`, insertLogs) || [];

  useEffect(() => {
    increaseRequested();
  }, [])

  useEffect(() => {
    if (requested > 0) {
      fetchLogs();
    }
  }, [requested]);

  return (
    <PanelTemplate className={s.panel} useColumn>
      <Stack gap={12} className={s.wrapper} dir='column'>
        <Stack gap={16} style={{ width: '100%' }}>
          <Button variant='outline' img='SettingsSliders' />
          <Input img='Search' placeholder='2.7M logs total found...' />
          <Button variant='outline' img='MoreHorizontal' />
        </Stack>
        <Stack className={s.description} style={{ width: '100%', marginBottom: 6 }}>
          <p>Time</p>
          <p>Host</p>
          <p>Response</p>
          <p>Message</p>
        </Stack>
        <Stack dir='column' gap={0} className={s.content}>
          {logs.map(log => <Service log={log} />)}
          {Array.from({ length: requested - logs.length }).map((_, i) => <Skeleton width='full' height={28} />)}
        </Stack>
      </Stack>
      <Stack jc='center' ai='center'>
        <Button variant='glass' onClick={increaseRequested} img='Sparkles'>Run performance test</Button>
      </Stack>
    </PanelTemplate>
  )
}
