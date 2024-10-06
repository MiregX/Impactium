'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/ui/Select';
import { useTournament } from '../context';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';
import { Team } from '@/dto/Team.dto';
import { Battle } from '@/dto/Battle.dto';
import { Pairs, λTournament } from '@/dto/Tournament';
import { HOUR, λIteration } from '@impactium/pattern';
import Countdown, { CountdownProps, CountdownRenderProps } from 'react-countdown';

enum AlignSettings {
  top = 'top',
  middle = 'middle',
  center = 'center'
}

interface ConnectorsProps {
  target: λIteration,
  next: λIteration,
  lower?: boolean
}

interface IterationProps {
  roundName: string;
  target: λIteration;
  next: λIteration,
  lower?: boolean
}

const getTopOffset = (element: HTMLElement) => element.offsetTop + element.clientHeight / 2;

const connectorPath = (startX: number, startY: number, endX: number, endY: number) => `M${startX} ${startY} C ${startX + 30} ${startY} ${endX - 30} ${endY} ${endX} ${endY}`;

export function Grid() {
  const [align, setAlign] = useState<AlignSettings>(AlignSettings.middle);
  const [scrolled, setScrolled] = useState<number>(0);
  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { tournament } = useTournament();
  const { lang } = useLanguage();
  
  const renderer = ({ days, hours, minutes, seconds }: CountdownRenderProps) => {
      return <span>{`${days > 0 ? `${days}:` : ''}${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes}:${seconds}`}</span>;
  };
  
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => setScrolled((v) => Math.min(maxScroll, Math.max(0, v + event.deltaY)));

  const selectBracket = (lower?: boolean) => `.${lower ? s.lower_bracket : s.upper_bracket}`;

  const selectIteration = (size: λIteration, lower?: boolean) => selectBracket(lower) + ` .${s.unit}[data-length='${size}']`;

  const Connectors = useCallback(({ target, next, lower }: ConnectorsProps) => {
    useEffect(() => {
      const updateConnectors = () => {
        const currentUnits = document.querySelectorAll(selectIteration(target, lower)) as unknown as HTMLElement[];
        const nextUnits = document.querySelectorAll(selectIteration(next, lower)) as unknown as HTMLElement[];
        const svg = document.querySelector(selectBracket(lower) +  ` .${s.connector}[data-current='${target}']`) as SVGElement;

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
    }, [target, next]);

    return <svg className={s.connector} data-current={target} xmlns='http://www.w3.org/2000/svg' />;
  }, []);

  const Iteration = useCallback(({ target, roundName, next, lower }: IterationProps) => {
    const self = useRef<HTMLDivElement>(null);

    useEffect(() => { self.current && setMaxScroll(self.current.clientHeight) });

    const pairs: Pairs<Team> = λTournament.pairs(tournament, target);

    return (
      <div ref={self} className={s.iteration}>
        {!lower && (
          <div className={s.round}>
            <p>{roundName}</p>
            <Countdown renderer={renderer} date={λTournament.iteration(tournament, target)!.startsAt}>
              <Countdown renderer={renderer} date={λTournament.iteration(tournament, target)!.startsAt.valueOf() + HOUR}>
                <span>Раунд закончился</span>
              </Countdown>  
            </Countdown>
          </div>
        )}
        <div className={cn(s.units, s[align])}>
          {pairs.map((pair, index) => {
            return <div key={index} className={cn(s.unit, target)} data-length={target}>
              {pair[0]
                ? <Combination size='full' id={pair[0].indent} src={pair[0].logo} name={pair[0].title} />
                : <CombinationSkeleton size='full' />
              }
              <Separator><i>VS</i></Separator>
              {pair[1]
                ? <Combination size='full' id={pair[1].indent} src={pair[1].logo} name={pair[1].title} />
                : <CombinationSkeleton size='full' />
              }
            </div>
          })}
        </div>
        <Connectors lower={lower} target={target} next={next} />
      </div>
    );
  }, [align, Connectors, tournament.teams, tournament.iterations]);

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
        <div className={cn(s.brackets, s.upper_bracket)}>
          {λTournament.upper(tournament).map((iteration, i) => {
            const next = λTournament.upper(tournament)[i + 1]?.n;

            return (
              <Iteration 
                key={iteration.n} 
                target={iteration.n}
                roundName={λTournament.round(iteration.n, λTournament.size(tournament))} 
                next={next}
              />
            )
          })}
          </div>
          <Separator />
          {tournament.has_lower_bracket && 
            <div className={cn(s.brackets, s.lower_bracket)}>
            {λTournament.lower(tournament).map((iteration, i) => {
              const target = iteration.n / 2 as λIteration;
              const next = λTournament.lower(tournament)[i + 1]?.n / 2 as λIteration;

              return (
                <Iteration 
                  key={target} 
                  target={target}
                  roundName={λTournament.round(target, λTournament.size(tournament))} 
                  next={next}
                  lower
                />
              );
            })}
          </div>}
      </Card>
    </div>
  );
}
