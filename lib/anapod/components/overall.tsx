'use client'
import { Stack } from '@impactium/components';
import { useEffect } from 'react';
import { Anapod } from '..';
import s from './styles/overall.module.css';

export namespace Overall {
export interface Props extends Anapod.Grid.Props, Stack.Props {

  }
}

export function Overall({
  ...props  
}: Overall.Props) {
  Anapod.Grid.apply(props);

  const { updateOverall } = Anapod.Context.use();

  useEffect(() => {
    const interval = setInterval(() => {
      updateOverall();
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <Stack className={s.overall} {...props}>

    </Stack>
  );
}