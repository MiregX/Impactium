'use client'
import React, { useEffect, useState } from 'react';
import { Button, Stack } from '@impactium/components';
import { SetState } from '@impactium/types';
import s from './App.module.css';
import { cn } from '@impactium/utils/dist';
import { Anapod } from '@impactium/anapod';
import { Icon } from '@impactium/icons';
import { Gauge } from '@impactium/components';

export namespace Main {
  export type Stage = 'init' | 'dashboard'
}

export default function Main() {
  const [stage, setStage] = useState<Main.Stage>('init');

  return (
    <Stack pos='relative' className={s.wrapper}>
      <Init stage={stage} setStage={setStage} />
      <Dashboard stage={stage} setStage={setStage} />
    </Stack>
    
  );
};

function Dashboard({ stage, setStage }: Init.Props) {
  return (
    <Anapod.Context.Provider className={cn(s.dashboard, stage === 'dashboard' && s.active)} pos='absolute' ai='flex-start' dir='column'>
      <Anapod.Components.Runtime row='1 / 5' column='1 / 2' />
      <Operall />
    </Anapod.Context.Provider>
  )
}

export function Operall() {
  const { overall, updateOverall } = Anapod.Context.use();

  useEffect(() => {
    const interval = setInterval(() => {
      updateOverall();
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const map: Record<string, Icon.Name> = {
    'Redis': 'LogoRedis',
    'CockroachDB Impactium': 'Database',
    'CockroachDB Anapod': 'Database',
    'CDN': 'AcronymCdn'
  };

  return (
    <Stack>
      {overall.map(o => {
        return (
          <Stack>
            <Gauge value={100 - o.ping} size={32} label={o.ping + 'ms'} />
          </Stack>
        )
      })}
    </Stack>
  )
    
}

export namespace Init {
  export interface Props {
    setStage: SetState<Main.Stage>;
    stage: Main.Stage;
  }
}

function Init({ setStage, stage }: Init.Props) {
  const goToDashboard = () => setStage('dashboard');

  return (
    <Stack dir='column' gap={32} style={{ height: '100%', width: '100%' }} ai='center' jc='center' pos='absolute' className={cn(s.init, stage !== 'init' && s.disable )}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 600 }}>Магазин кабачковой икры</p>
      <Stack gap={16}>
        <Button onClick={goToDashboard} img='Coins' rounded size='lg'>Купить</Button>
        <Button onClick={goToDashboard} img='CreditCard' rounded size='lg' variant='secondary'>Продать</Button>
      </Stack>
    </Stack>
  )
}