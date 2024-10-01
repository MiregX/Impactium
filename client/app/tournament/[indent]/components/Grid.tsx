'use client'

import React, { useState, useEffect, useCallback, useRef, WheelEventHandler } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { CombinationSkeleton } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/ui/Select';
import { capitalize, ui } from '@impactium/utils';
import { useTournament } from '../context';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';

interface GridProps {
  length: number;
}

enum AlignSettings {
  top = 'top',
  middle = 'middle',
  center = 'center'
}

function getRoundName(round: number, totalRounds: number) {
  if (round === totalRounds) return 'Полуфинал';
  if (round === totalRounds - 1) return 'Четвертьфинал';
  return `Раунд ${round}`;
};

const getTopOffset = (element: HTMLElement) => element.offsetTop + element.clientHeight / 2;

const connectorPath = (startX: number, startY: number, endX: number, endY: number) => `M${startX} ${startY} C ${startX + 30} ${startY} ${endX - 30} ${endY} ${endX} ${endY}`;

export function Grid() {
  const [iterations, setIterations] = useState<React.JSX.Element[]>([]);
  const [align, setAlign] = useState<AlignSettings>(AlignSettings.middle);
  const [scrolled, setScrolled] = useState<number>(0);
  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { tournament } = useTournament();
  const { lang } = useLanguage();
  
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => setScrolled((v) => Math.min((maxScroll), Math.max(0, v + event.deltaY)));

  const Connectors = useCallback(({ current, next = 0 }: { current: number, next?: number }) => {
    useEffect(() => {
      const updateConnectors = () => {
        const currentUnits = document.querySelectorAll(`.${s.unit}[data-length="${current}"]`) as unknown as HTMLElement[];
        const nextUnits = document.querySelectorAll(`.${s.unit}[data-length="${next}"]`) as unknown as HTMLElement[];
        const svg = document.querySelector(`.${s.connector}[data-current="${current}"]`) as SVGElement;

        if (!svg) return;

        svg.innerHTML = '';

        currentUnits.forEach((unit, i) => {
          const _unit = nextUnits[Math.floor(i / 2)];
          
          if (!_unit) return;

          [getTopOffset(unit) - 28, getTopOffset(unit) + 32].forEach((n) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', connectorPath(0, n, 48, getTopOffset(_unit) + (i % 2 ? 32 : -28)));
            path.setAttribute('stroke', 'var(--accent-2)');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('fill', 'transparent');
            svg.appendChild(path);
          });
        });
      };

      updateConnectors();
      window.addEventListener('resize', updateConnectors);

      return () => window.removeEventListener('resize', updateConnectors);
    }, [current, next]);

    return <svg className={s.connector} data-current={current} xmlns="http://www.w3.org/2000/svg" />;
  }, []);

  const Iteration = useCallback(({ length, roundName, next }: { length: number; roundName: string; next?: number }) => {
    const self = useRef<HTMLDivElement>(null);

    useEffect(() => { self.current && setMaxScroll(self.current.clientHeight)});

    return (
      <div ref={self} className={s.iteration}>
        <div className={s.round}>{roundName}</div>
        <div className={cn(s.units, s[align])}>
          {Array.from({ length }).map((_, index) => (
            <div key={index} className={cn(s.unit, length)} data-length={length}>
              <CombinationSkeleton size="full" />
              <Separator color='var(--accent-2)'><i>VS</i></Separator>
              <CombinationSkeleton size="full" />
            </div>
          ))}
        </div>
        <Connectors current={length} next={next} />
      </div>
    );
  }, [align, Connectors]);

  const renderIterations = useCallback((length: number) => {
    let current = length;
    let round = 1;
    const generatedIterations = [];

    while (current > 1) {
      const next = Math.floor(current / 2);
      generatedIterations.push(
        <Iteration 
          key={current} 
          length={current} 
          roundName={getRoundName(round, Math.floor(Math.log2(length)))} 
          next={next}
        />
      );
      current = next;
      round++;
    }
    
    generatedIterations.push(<Iteration key={current} length={1} roundName="Финал" />);

    setIterations(generatedIterations);
  }, [Iteration]);

  useEffect(() => {
    renderIterations(tournament.grid?.max || 16);
  }, [tournament, align, renderIterations]);

  useEffect(() => document.documentElement.scroll(0, 0), [fullScreen])

  return (
    <div className={s.grid_wrapper}>
      <div className={s.header}>
        <h3>Турнирная сетка</h3>
        <div className={s.settings}>
          <Select onValueChange={v => setAlign(v as AlignSettings)} defaultValue={'middle'}>
            <SelectTrigger value={align}>{lang.display_options[align] || 'Режим отображения'}</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Режим отображения</SelectLabel>
                {Object.values(AlignSettings).map(v => (
                  <SelectItem key={v} value={AlignSettings[v]} className={s.item}>{lang.display_options[v]}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className={cn(fullScreen && s.minimize)} onClick={() => setFullScreen(v => !v)} img={fullScreen ? 'Minimize' : 'Maximize'} variant={fullScreen ? 'default' : 'secondary'}>{fullScreen ? 'Minimize' : 'Maximize'}</Button>
        </div>
      </div>
      <Card onWheel={handleWheel} className={cn(s.grid, scrolled > 12 && s.border, fullScreen && s.fullscreen)}>
        {iterations}
      </Card>
    </div>
  );
}
