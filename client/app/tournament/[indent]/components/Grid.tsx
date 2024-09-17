import React, { useRef } from 'react';
import { Card } from '@/ui/Card';
import s from '../Tournament.module.css';
import { CombinationSkeleton } from '@/ui/Combitation';
import { useMemo } from 'react';
import { Separator } from '@/ui/Separator';
import { cn } from '@/lib/utils';

interface GridProps {
  length: number;
}

interface SVGProps {
  iteration: number;
}

interface IterationProps {
  l: number;
  roundName: string;
  isLast?: boolean;
}

const connectorPath = (startX: number, startY: number, endX: number, endY: number) => `
  M${startX} ${startY}
  C ${startX + 30} ${startY} ${endX - 30} ${endY} ${endX} ${endY}
`;

export function Grid({ length }: GridProps) {
  const Iteration = ({ l, roundName, isLast }: IterationProps) => (
    <div className={s.iteration}>
      <h3>{roundName}</h3>
      {Array.from({ length: l }, (_, i) => (
        <div key={i} className={cn(s.unit, l)}>
          <CombinationSkeleton size="full" />
          <Separator color='var(--accent-2)'><i>VS</i></Separator>
          <CombinationSkeleton size="full" />
        </div>
      ))}
      {!isLast && (
        <svg className={s.connector} xmlns="http://www.w3.org/2000/svg">
          <SVG key={l} iteration={l} />
        </svg>
      )}
    </div>
  );

  const SVG = ({ iteration }: SVGProps) => {
    const units = Array.from(document.getElementsByClassName(cn(s.unit, iteration)));
    const gap = 18

    return units.map((unit, i) => {
      const height = unit.clientHeight + gap;
      const middle = unit.clientHeight / 2;

      const getInset = () => {
        if (iteration === 4) {
          return height * 2;
        }
        if (iteration === 2) {
          return height * 3;
        }
        return 0;
      }

      const startY = height * i + middle + getInset();
      const end = () => {
        if (iteration === 8) {
          if (0 === i) {
            return 2
          }
          if (1 === i) {
            return 1
          }
          if (2 === i) {
            return 1
          }
          if (5 === i) {
            return -1
          }
          if (6 === i) {
            return -1
          }
          if (7 === i) {
            return -2
          }
        }
        if (iteration === 4) {
          if (0 === i) {
            return 1
          }
          if (3 === i) {
            return -1
          }
        }
        if (iteration === 2) {
          if (0 === i) {
            return 0.5
          }
          console.log(i)
          if (1 === i) {
            return -0.5
          }
        }
        return 0;
      }
      const starts: [number, number] = [
        startY - 28,
        startY + 28
      ]
      const getOffset = (y: number) => y % 2 < 1 ? y-28 : y+28;

      const ends: [number, number] = [
        getOffset(startY) + height * end(),
        getOffset(startY) + height * end()
      ]
      return (
        <React.Fragment>
          {starts.map((n, i) => (
            <path
              key={i + units.length}
              d={connectorPath(0, n, 48, ends[i])}
              stroke='var(--accent-2)'
              strokeWidth="1"
              fill="transparent"
            />
          ))}
        </React.Fragment>
      )
    });
  }

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return 'Финал';
    if (round === totalRounds - 1) return 'Полуфинал';
    if (round === totalRounds - 2) return 'Четвертьфинал';
    return `Раунд ${round}`;
  };

  const renderIterations = (length: number) => {
    const iterations = [];
    let currentLength = length;
    let round = 1;
    const totalRounds = Math.floor(Math.log2(length));

    while (currentLength > 1) {
      const roundName = getRoundName(round, totalRounds);
      iterations.push(
        <Iteration 
          key={currentLength} 
          l={currentLength} 
          roundName={roundName} 
        />
      );
      currentLength = Math.floor(currentLength / 2);
      round++;
    }

    // Финальный раунд
    if (currentLength === 1) {
      iterations.push(<Iteration key={currentLength} l={1} roundName="Финал" isLast />);
    }

    return iterations;
  };

  return (
    <Card className={s.grid}>
      {renderIterations(length)}
    </Card>
  );
}
