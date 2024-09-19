'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { CombinationSkeleton } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select';
import { capitalize } from '@impactium/utils';
import { useTournament } from '../context';

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
  const { tournament } = useTournament();

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
    return (
      <div className={cn(s.iteration, s[align])}>
        {Array.from({ length }).map((_, index) => (
          <div data-round={index === 0 ? roundName : undefined} key={index} className={cn(s.unit, length)} data-length={length}>
            <CombinationSkeleton size="full" />
            <Separator color='var(--accent-2)'><i>VS</i></Separator>
            <CombinationSkeleton size="full" />
          </div>
        ))}
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
    renderIterations(tournament.grid?.length || 16);
  }, [tournament, align, renderIterations]);

  return (
    <div className={s.grid_wrapper}>
      <div className={s.header}>
        <h3>Турнирная сетка</h3>
        <div className={s.settings}>
          <Select onValueChange={v => setAlign(v as AlignSettings)} defaultValue={'middle'}>
            <SelectTrigger value={align}>{capitalize(align) || 'Режим отображения'}</SelectTrigger>
            <SelectContent>
              {Object.values(AlignSettings).map(v => (
                <SelectItem value={AlignSettings[v]} className={s.item}>{capitalize(v)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className={s.grid}>
        {iterations}
      </Card>
    </div>
  );
}
