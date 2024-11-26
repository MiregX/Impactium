'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React from 'react';
import s from './Status.module.css'
import { Stack } from "@/ui/Stack";
import { Button } from "@/ui/Button";
import { Service } from "./components/Service";
import { Input } from "@/ui/Input";

export default function StatusPage() {
  const services: Service.Props[] = [
    {
      path: 'http://localhost:3000/',
      icon: 'AcronymPage',
      name: "Next.JS"
    },
    {
      path: 'http://localhost:3001/api/application/info',
      icon: 'FunctionNest',
      name: "Nest.JS"
    },
    {
      path: 'http://localhost:3002/api/v2/ping',
      icon: 'FunctionGo',
      name: "Go"
    },
    {
      path: 'https://cdn.impactium.fun/logo/impactium.png',
      icon: 'FunctionSquare',
      name: "CDN",
      params: {
        mode: 'no-cors'
      }
    }
  ]

  return (
    <PanelTemplate className={s.panel} useColumn>
      <Stack gap={0} className={s.wrapper} dir='column'>
        <Stack gap={16} style={{ marginBottom: 12, width: '100%' }}>
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
