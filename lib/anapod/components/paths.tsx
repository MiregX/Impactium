'use client'
import { Stack } from '@impactium/components';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Anapod } from '..';
import s from './styles/paths.module.css';
import { cn } from '@impactium/utils';

export namespace Paths {
  export interface Props extends Anapod.Grid.Props, Stack.Props {

  }
}

export function Paths({
  ...props  
}: Paths.Props) {
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
    <Stack ai='flex-start' className={s.paths} dir='row' {...props}>
      <List />
      <Detailed />
    </Stack>
  );
}

export function List() {
  return (
    <Stack dir='column' gap={0} className={s.list}>
      <Path path={'/app/application/info'} total={5782} percentage={0.56} />
      <Path path={'/app/application/blueprints'} total={4350} percentage={0.43} />
      <Path path={'/'} total={3988} percentage={0.34} />
      <Path path={'/status'} total={2499} percentage={0.24} />
      <Path path={'/teams'} total={2321} percentage={0.18} />
      <Path path={'/team/navi'} total={1735} percentage={0.09} />
      <Path path={'/user/mireg'} total={73} percentage={0.01} />
    </Stack>
  )
}

export namespace Path {
  export interface Props extends Stack.Props {
    path: string;
    total: number;
    percentage: number;
  }
}

export function Path({ path, total, percentage, className, ...props }: Path.Props) {
  const self = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!self.current)
      return;

    setWidth(self.current.clientWidth * percentage);
  }, [percentage, width, setWidth, self]);

  return (
    <Stack ref={self} pos='relative' className={cn(className, s.path)} {...props}>
      <Fill width={width} />
      <p className={s.name}>{path}</p>
      <p className={s.total}>{total}</p>
    </Stack>
  )
}

export namespace Fill {
  export interface Props extends HTMLAttributes<HTMLHRElement> {
    width: number;
  }
}

export function Fill({ width }: Fill.Props) {
  return (
    <hr className={s.fill} style={{ width }} />
  )
}

export function Detailed() {
  return (
    <Stack>

    </Stack>
  );
}