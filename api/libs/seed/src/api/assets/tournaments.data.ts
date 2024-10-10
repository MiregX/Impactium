import { Battle } from '@prisma/client';
import { HOUR, MINUTE, λIterations } from '../../../../../../lib/pattern';
import { teams } from './teams.data';
import { addHours } from 'date-fns';

type BattleUnit = Pick<Battle, 'slot1' | 'slot2' | 'is_slot_one_winner'>;



const winners = (battles: BattleUnit[]): Array<string | null> => battles.map(battle => battle.is_slot_one_winner ? battle.slot1 : battle.slot2);
const losers = (battles: BattleUnit[]): Array<string | null> => battles.map(battle => battle.is_slot_one_winner ? battle.slot2 : battle.slot1);

// const upper_8 = pairs(teams.map(t => t.indent));
// const upper_4 = pairs(winners(upper_8));
// const lower_4 = pairs(losers(upper_8));
// const upper_2 = pairs(winners(upper_4));
// const lower_2 = pairs(winners(lower_4));

const start = new Date(Date.now() + MINUTE).toISOString();

export const tournament = {
  banner: '',
  title: 'Outplayed Qualifiers 2024',
  start: start,
  end: addHours(start, 5),
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
        startsAt: start,
      },
      {
        n: λIterations._4,
        is_lower_bracket: false,
        startsAt: addHours(start, 1),
      },
      {
        n: λIterations._4,
        is_lower_bracket: true,
        startsAt: addHours(start, 1),
      },
      {
        n: λIterations._2,
        is_lower_bracket: true,
        best_of: 2,
        startsAt: addHours(start, 2),
      },
      {
        n: λIterations._2,
        is_lower_bracket: false,
        best_of: 2,
        startsAt: addHours(start, 2),
      },
      {
        n: λIterations._1,
        is_lower_bracket: false,
        best_of: 3,
        startsAt: addHours(start, 5)
      },
    ]
  },
  teams: {
    connect: teams.map(team => ({ indent: team.indent }))
  }
};
