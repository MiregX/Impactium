'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { useState } from 'react';
import s from './Status.module.css'
import { Stack } from "@/ui/Stack";
import { Button } from "@/ui/Button";
import { λ } from "@/decorator/λ.class";
import { Service } from "./components/Service";
import { ResponseBase } from "@/dto/Response.dto";
import { Icon } from "@impactium/icons";


export default function StatusPage() {
  const services: Service.Props[] = [
    {
      type: 'frontend',
      path: 'http://localhost:3000/',
      icon: 'AcronymPage',
      name: "Next.JS"
    },
    {
      type: 'backend',
      path: 'http://localhost:3001/api',
      icon: 'AcronymApi',
      name: "Nest.JS"
    },
    {
      type: 'backend',
      path: 'http://localhost:3002/api/v2',
      icon: 'AcronymApi',
      name: "Go"
    },
    {
      type: 'database',
      path: 'http://localhost:3002/api/v2',
      icon: 'Database',
      name: "CockroachDB"
    }
  ]

  return (
    <PanelTemplate className={s.panel} useColumn>
      <Stack gap={0} className={s.wrapper} dir='column'>
        <Stack>
          <Button variant='outline' img='SettingsSliders'></Button>
        </Stack>
        {services.map(service => (
          <Service {...service} />
        ))}
      </Stack>
      <Stack jc='center' ai='center'>
        {/* <Button variant='glass' loading={loading} img='Sparkles'>Run performance test</Button> */}
      </Stack>
    </PanelTemplate>
  )
}
