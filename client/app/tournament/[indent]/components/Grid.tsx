'use client'
import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/ui/Select';
import { useTournament } from '../context';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';
import { λTeam } from '@/dto/Team.dto';
import { Battle, λBattle } from '@/dto/Battle.dto';
import { TournamentReadyState, λTournament } from '@/dto/Tournament';
import { HOUR } from '@impactium/pattern';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { Iteration } from '@/dto/Iteration.dto';
import { TeamCombination } from '@/components/TeamCombination';

enum AlignSettings {
  top = 'top',
  middle = 'middle',
  center = 'center'
}

interface ConnectorsUnitProps {
  iteration: Iteration,
}

interface IterationUnitProps {
  iteration: Iteration;
}

interface BattleUnitProps {
  battle?: Battle;
}

const getTopOffset = (element: HTMLElement) => element.offsetTop + element.clientHeight / 2;

const connectorPath = (startX: number, startY: number, endX: number, endY: number) => `M${startX} ${startY} C ${startX + 30} ${startY} ${endX - 30} ${endY} ${endX} ${endY}`;

const CountdownComponent = ({ date }: { date: number }) => {
  const [status, setStatus] = useState<TournamentReadyState>(TournamentReadyState.Upcoming);

  const renderer = ({ total, completed }: CountdownRenderProps) => {
    if (completed) {
      setStatus(TournamentReadyState.Finished);
      return <span>Раунд закончился</span>;
    }
    
    if (TournamentReadyState.Upcoming) {
      return <span>Старт через: {formatTime(total)}</span>;
    } else if (TournamentReadyState.Ongoing) {
      return <span>Конец через: {formatTime(total + HOUR)}</span>;
    }
  };

  const formatTime = (total: number) => {
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 3600) % 24);
    const days = Math.floor(total / 1000 / 86400);

    return `${days > 0 ? `${days}:` : ''}${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (status === TournamentReadyState.Upcoming) {
      setTimeout(() => setStatus(TournamentReadyState.Finished), date - Date.now());
    }
  }, [status, date]);

  return <Countdown date={date} renderer={renderer} />;
};

export function Grid() {
  const [align, setAlign] = useState<AlignSettings>(AlignSettings.middle);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { tournament } = useTournament();
  const { lang } = useLanguage();

  const selectBracket = (lower?: boolean) => `.${lower ? s.lower_bracket : s.upper_bracket}`;

  const selectIteration = (iteration: Iteration) => selectBracket(iteration.is_lower_bracket) + ` .${s.unit}[data-length='${iteration.n}']`;

  const Connectors = useCallback(({ iteration }: ConnectorsUnitProps) => {
    useEffect(() => {
      const updateConnectors = () => {
        const currentUnits = document.querySelectorAll(selectIteration(iteration)) as unknown as HTMLElement[];
        const next = λTournament.next(tournament, iteration);
        const nextUnits = next ? document.querySelectorAll(selectIteration(next)) as unknown as HTMLElement[] : [];
        const svg = document.querySelector(selectBracket(iteration.is_lower_bracket) +  ` .${s.connector}[data-current='${iteration.n}']`) as SVGElement;

        if (!svg) return;

        svg.innerHTML = '';

        currentUnits.forEach((unit, i) => {
          const battle = iteration.battles[i];
          const nextBattleIndex = next?.battles.findIndex(nextBattle => [nextBattle.slot1, nextBattle.slot2].includes(λBattle.winner(battle)))!

          const nextUnit = λBattle.finished(battle)
            ? nextUnits[nextBattleIndex]
            : nextUnits[Math.floor(i / 2)];
          
          if (!nextUnit) return;

          const starts = typeof battle?.is_slot_one_winner === 'boolean'
            ? [battle.is_slot_one_winner ? getTopOffset(unit) - 28 : getTopOffset(unit) + 32]
            : [getTopOffset(unit) - 28, getTopOffset(unit) + 32];

          const end = λBattle.finished(battle)
            ? getTopOffset(nextUnit) + (λBattle.winner(battle) === next?.battles[nextBattleIndex]?.slot1 ? -28 : 32)
            : getTopOffset(nextUnit) + (i % 2 ? 32 : -28);

          starts.forEach((n) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', connectorPath(0, n, 48, end));
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
    }, [iteration]);

    return <svg className={s.connector} data-current={iteration.n} xmlns='http://www.w3.org/2000/svg' />;
  }, []);

  const IterationUnit = useCallback(({ iteration }: IterationUnitProps) => {
    const self = useRef<HTMLDivElement>(null);

    const round = λTournament.round(iteration.n, λTournament.size(tournament));

    const BattleUnit = ({ battle }: BattleUnitProps) => {
      console.log(battle);

      return (
        <div
          className={s.unit}
          data-length={iteration.n}
          data-winner={battle && typeof battle.is_slot_one_winner === 'boolean'
            ? (battle.is_slot_one_winner
              ? battle.slot1
              : battle.slot2)
            : null}
          data-one={battle?.slot1}
          data-two={battle?.slot2}>
          <TeamCombination size='full' team={λTeam.find(tournament.teams || [], battle?.slot1)} winner={battle ? battle.is_slot_one_winner : undefined} />
          <Separator><i>VS</i></Separator>
          <TeamCombination size='full' team={λTeam.find(tournament.teams || [], battle?.slot2)} winner={battle ? !battle.is_slot_one_winner : undefined} />
        </div>
      );
    }

    return (
      <div ref={self} className={s.iteration}>
        {!iteration.is_lower_bracket && round && (
          <div className={s.round}>
            <p>{round}</p>
            <CountdownComponent date={iteration.startsAt} />
          </div>
        )}
        <div className={cn(s.units, s[align])}>
          {Array.from({ length: iteration.n / 2 }).map((_, index) => <BattleUnit key={index} battle={iteration.battles[index] || λTournament.pair(tournament, index)} />)}
        </div>
        <Connectors iteration={iteration} />
      </div>
    );
  }, [align, Connectors, tournament.teams, tournament.iterations]);

  const UpperBracket = () => {
    const upper = λTournament.upper(tournament);

    if (!upper.length) return null;

    return (
      <div className={cn(s.brackets, s.upper_bracket)}>
        {upper.map(iteration => <IterationUnit key={iteration.n} iteration={iteration} />)}
      </div>
    );
  }

  const LowerBracket = () => {
    if (!tournament.has_lower_bracket || λTournament.lower(tournament).length === 0) return null;

    return (
      <Fragment>
        <Separator />
        <div className={cn(s.brackets, s.lower_bracket)}>
          {λTournament.lower(tournament).map(iteration => <IterationUnit key={iteration.n} iteration={iteration} />)}
        </div>
      </Fragment>
    );
  }

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
      <Card className={cn(s.grid, fullScreen && s.fullscreen)}>
        <UpperBracket />
        <LowerBracket />
      </Card>
    </div>
  );
}
