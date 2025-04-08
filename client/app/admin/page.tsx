'use client'
import { Anapod } from "@impactium/anapod"
import { Runtime } from "./components/runtime"
import s from './Admin.module.css';
import { Notification, Stack } from "@impactium/components";
import { Latency } from "./components/latency";
import { useEffect, useMemo } from "react";
import { Icon } from "@impactium/icons";
import { Encount } from "./components/encount";
import { Impersonate } from "./components/imperosonate";

export default function AdminPage() {
  return (
    <main className={s.main}>
      <Notification className={s.demo} variant='success' icon='ShieldCheck' value='Все данные предоставлены исключительно как демонстрация функциональных и вычеслительных мощностей.' />
      <Anapod.Context.Provider gap={0} flex>
        <Runtime row='1 / 5' column='1 / 2' />
        <Stack ai='stretch' gap={0} flex='unset' dir='column'>
          <Latencies />
          <Impersonate />
          <Encounters />
        </Stack>
      </Anapod.Context.Provider>
    </main>
  )
}

function Latencies() {
  const { overall, updateOverall } = Anapod.Context.use();

  const iconsMap: Record<string, Icon.Name> = useMemo(() => {
    return {
      '@impactium/api': 'LogoNest',
      '@impactium/api/cache': 'Servers',
      '@impactium/api/database': 'Database',
      '@impactium/anapod': 'LogoGo',
      '@impactium/anapod/database': 'Database',
      'Content Delivery Network': 'Cloud'
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(updateOverall, 1000);

    return () => clearInterval(interval);
  })

  return (
    <Stack className={s.latency} ai='unset' gap={0}>
      {overall.map(o => {
        return <Latency icon={iconsMap[o.name]} name={o.name} ping={o.ping} ip={o.url} />
      })}
    </Stack>
  )
}

function Encounters() {
  return (
    <Stack className={s.encounters}>
      <Encount name='Users' value={1488} />
      <Encount name='Requests' value={50000} />
    </Stack>
  )
}