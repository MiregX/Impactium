import { DAY, HOUR, λIterations } from '../../../../../../lib/pattern';
import { teams } from './teams.data';


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
        startsAt: new Date(Date.now() + HOUR)
      },
      {
        n: λIterations._4,
        is_lower_bracket: false,
        startsAt: new Date(Date.now() + HOUR * 2)
      },
      {
        n: λIterations._4,
        is_lower_bracket: true,
        startsAt: new Date(Date.now() + HOUR * 2)
      },
      {
        n: λIterations._2,
        is_lower_bracket: false,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 3)
      },
      {
        n: λIterations._2,
        is_lower_bracket: true,
        best_of: 2,
        startsAt: new Date(Date.now() + HOUR * 3)
      },
      {
        n: λIterations._1,
        is_lower_bracket: false,
        best_of: 3,
        startsAt: new Date(Date.now() + HOUR * 6)
      },
    ]
  },
  teams: {
    connect: teams.map(team => ({ indent: team.indent }))
  }
};
