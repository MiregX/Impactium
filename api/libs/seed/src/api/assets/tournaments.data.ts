import { Battle } from '@prisma/client';
import { DAY, HOUR, λIterations } from '../../../../../../lib/pattern';
import { teams } from './teams.data';

type BattleUnit = Pick<Battle, 'slot1' | 'slot2' | 'is_slot_one_winner'>;

const pairs = (arr: Array<string | null>) => arr.reduce((acc, _, i, arr) => {
  if (i % 2 === 0) acc.push({
    slot1: arr[i]!, 
    slot2: arr[i + 1],
    is_slot_one_winner: Math.random() > 0.5
  });
  return acc;
}, [] as BattleUnit[]);

const winners = (battles: BattleUnit[]): Array<string | null> => battles.map(battle => battle.is_slot_one_winner ? battle.slot1 : battle.slot2);
const losers = (battles: BattleUnit[]): Array<string | null> => battles.map(battle => battle.is_slot_one_winner ? battle.slot2 : battle.slot1);

const upper_8 = pairs(teams.map(t => t.indent));
const upper_4 = pairs(winners(upper_8));
const lower_4 = pairs(losers(upper_8));
const upper_2 = pairs(winners(upper_4));
const lower_2 = pairs(winners(lower_4));

export const tournament = {
  banner: '',
  title: 'Outplayed Qualifiers 2024',
  start: new Date(Date.now()),
  end: new Date(Date.now() + DAY * 2),
  description: '',
  code: 'outplayed-2024',
  rules: '',
  ownerId: 'system',
  has_lower_bracket: true,
  iterations: {
    create: [
      {
        n: λIterations._8,
        is_lower_bracket: false,
        startsAt: new Date(Date.now() + HOUR),
        battles: {
          create: upper_8
        }
      },
      {
        n: λIterations._4,
        is_lower_bracket: false,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 2),
        battles: {
          create: upper_4
        }
      },
      {
        n: λIterations._4,
        is_lower_bracket: true,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 2),
        battles: {
          create: lower_4
        }
      },
      {
        n: λIterations._2,
        is_lower_bracket: true,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 5),
        battles: {
          create: lower_2
        }
      },
      {
        n: λIterations._2,
        is_lower_bracket: false,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 5),
        battles: {
          create: upper_2
        }
      },
      {
        n: λIterations._1,
        is_lower_bracket: false,
        best_of: 3,
        startsAt: new Date(Date.now() + HOUR * 8)
      },
    ]
  },
  teams: {
    connect: teams.map(team => ({ indent: team.indent }))
  }
};
