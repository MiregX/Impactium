'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { CombinationSkeleton } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select';
import { capitalize } from '@impactium/utils';

interface GridProps {
  length: number;
}

type AlignSettings = 'top' | 'middle' | 'bottom';

export function Grid({ length }: GridProps) {
  const [iterations, setIterations] = useState<React.JSX.Element[]>([]);
  const [align, setAlign] = useState<AlignSettings>('middle');
  const wrapperRef = useRef<HTMLDivElement[]>([]);
  const unitRefs = useRef<HTMLDivElement[][]>([]);

  const getTopOffset = (unit: HTMLDivElement) => unit.offsetTop + unit.clientHeight / 2;;

  const connectorPath = (startX: number, startY: number, endX: number, endY: number) => `
  M${startX} ${startY}
  C ${startX + 30} ${startY} ${endX - 30} ${endY} ${endX} ${endY}
  `;

  const SVG = ({ iteration, nextIteration }: { iteration: number, nextIteration: number }) => {
    const units = unitRefs.current[iteration];
    const nextUnits = unitRefs.current[nextIteration];

    console.log('xx')

    if (!units || !nextUnits) return null;

    return (
      <svg className={s.connector} xmlns="http://www.w3.org/2000/svg">
        {units.map((unit, i) => (
          <React.Fragment key={i}>
            {[getTopOffset(unit) - 32, getTopOffset(unit) + 32].map((n, j) => (
              <path
                key={j}
                d={connectorPath(0, n, 48, getTopOffset(nextUnits[Math.floor(i / 2)]))}
                stroke='var(--accent-2)'
                strokeWidth="1"
                fill="transparent"
              />
            ))}
          </React.Fragment>
        ))}
      </svg>
    );
  };

  const Iteration = ({ l, roundName, nextL }: { l: number; roundName: string; nextL?: number }) => {
    const iterationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!iterationRef.current) return;

      wrapperRef.current[l] = iterationRef.current;
    }, [l]);

    return (
      <div ref={iterationRef} className={cn(s.iteration, s[align])}>
        {Array.from({ length: l }).map((_, i) => {
          const unitRef = useRef<HTMLDivElement>(null);

          useEffect(() => {
            if (!unitRefs.current[l]) {
              unitRefs.current[l] = [];
            }
            unitRefs.current[l][i] = unitRef.current!;
          }, [l, i]);

          return (
            <div key={i} ref={unitRef} className={cn(s.unit, l)}>
              <CombinationSkeleton size="full" />
              <Separator color='var(--accent-2)'><i>VS</i></Separator>
              <CombinationSkeleton size="full" />
            </div>
          );
        })}
        <SVG iteration={l} nextIteration={nextL || 0} />
      </div>
    );
  };

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Полуфинал';
    if (round === totalRounds - 1) return 'Четвертьфинал';
    return `Раунд ${round}`;
  };

  const renderIterations = (length: number) => {
    let currentLength = length;
    let round = 1;
    const generatedIterations = [];

    while (currentLength > 1) {
      const nextLength = Math.floor(currentLength / 2);
      generatedIterations.push(
        <Iteration 
          key={currentLength} 
          l={currentLength} 
          roundName={getRoundName(round, Math.floor(Math.log2(length)))} 
          nextL={nextLength}
        />
      );
      currentLength = nextLength;
      round++;
    }
    
    generatedIterations.push(<Iteration key={currentLength} l={1} roundName="Финал" />);

    setIterations(generatedIterations);
  };

  useEffect(() => {
    renderIterations(length);
  }, [length, align]);

  return (
    <Card className={s.grid}>
      <div className={s.settings}>
        <Select onValueChange={v => setAlign(v as AlignSettings)} defaultValue={'middle'}>
          <SelectTrigger value={align}>{capitalize(align) || 'Режим отображения'}</SelectTrigger>
          <SelectContent>
            <SelectItem value={'top'} className={s.item}>Top</SelectItem>
            <SelectItem value={'middle'} className={s.item}>Middle</SelectItem>
            <SelectItem value={'bottom'} className={s.item}>Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {iterations}
    </Card>
  );
}
