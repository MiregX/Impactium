'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { useState } from 'react';
import s from './Status.module.css'
import { Service } from "./components/Service";
import { Stack } from "@/ui/Stack";
import { Side } from "@impactium/types";
import { Button } from "@/ui/Button";

export default function StatusPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const runPerformanceTest = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }

  return (
    <PanelTemplate className={s.panel} useColumn>
      <Stack gap={64}>
        <Stack dir='column' gap={64}>
          <Service type='frontend' icon='LogoNext' name='Next.JS' dots={[Side.RIGHT]} />
        </Stack>
        <Stack dir='column' gap={64}>
          <Service type='middleware' icon='LogoNginx' name='Nginx' dots={[Side.RIGHT, Side.LEFT]} />
        </Stack>
        <Stack dir='column' gap={64}>
          <Service icon='LogoNest' name='Nest.JS' type='backend' dots={[Side.RIGHT, Side.LEFT, Side.BOTTOM]} />
          <Service icon='LogoGo' size={32} name='Go' type='backend' dots={[Side.RIGHT, Side.LEFT, Side.TOP]} />
        </Stack>
        <Stack dir='column' gap={64}>
          <Service icon='LogoRedis' name='Redis' type='database' dots={[Side.LEFT]} />
          <Service icon='Postgres' name='CockroachDB' type='database' dots={[Side.LEFT]} />
        </Stack>
      </Stack>
      <Stack jc='center' ai='center'>
        <Button variant='glass' loading={loading} onClick={runPerformanceTest} img='Sparkles'>Run performance test</Button>
      </Stack>
    </PanelTemplate>
  )
}
