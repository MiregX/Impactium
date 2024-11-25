'use client'
import { useLanguage } from '@/context/Language.context'
import s from './styles/Badge.module.css'
import { cn } from '@/lib/utils'
import { Icon } from '@impactium/icons'
import { HTMLAttributes } from 'react'
import { DesignSystem, Utils } from '@impactium/utils'
import { capitalize } from 'lodash'

interface _CustomBadge {
  title?: string,
  icon?: Icon.Name,
  revert?: boolean,
  color?: DesignSystem.Color | string;
  dot?: boolean
}

export enum BadgeType {
  cookies = 'cookies',
  frontend = 'frontend',
  backend = 'backend',
  devops = 'devops',
  database = 'database',
  middleware = 'middleware',
  primary = 'primary',
  verified = 'verified',
  selected = 'selected',
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Finished = 'Finished',
  Registered = 'Registered',
  Free = 'Free',
  Invites = 'Invites',
  Closed = 'Closed',
  Soon = 'soon',
  prize = 'prize',
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Ancient = 'Ancient',
  Divine = 'Divine'
};

type _PredefinedBadge = {
  type: BadgeType
  title?: string
}

interface BadgeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, _PredefinedBadge, _CustomBadge {}

export function Badge({ className, ...options }: BadgeProps) {
  const { lang } = useLanguage();
  const map: Record<BadgeType, _CustomBadge> = {
    [BadgeType.cookies]: {
      title: 'Cookies',
      icon: 'Cookie',
      color: '#d17724'
    },
    [BadgeType.devops]: {
      title: 'DevOps',
      icon: 'Database',
      color: '#3b88e9'
    },
    [BadgeType.primary]: {
      title: 'Primary',
      color: '#62c073'
    },
    [BadgeType.verified]: {
      title: lang._verified,
      color: '#52a8ff',
      icon: 'ShieldCheck'
    },
    [BadgeType.selected]: {
      title: lang._selected,
      color: '#62c073'
    },
    [BadgeType.Upcoming]: {
      color: '#0070f3'
    },
    [BadgeType.Ongoing]: {
      color: '#31dd59'
    },
    [BadgeType.Finished]: {
      color: '#f30000'
    },
    [BadgeType.Soon]: {
      color: '#0070f3',
      title: lang._soon,
      dot: true
    },
    [BadgeType.Free]: {
      icon: 'DoorOpen',
      color: '#4af379',
    },
    [BadgeType.Invites]: {
      icon: 'TicketPercent',
      color: '#fe8d59',
    },
    [BadgeType.Closed]: {
      icon: 'DoorClosed',
      color: '#d41d14',
    },
    [BadgeType.prize]: {
      icon: 'Trophy',
      color: '#f3e000'
    },
    [BadgeType.Registered]: {
      icon: 'CircleCheck',

      color: '#c0c0c0'
    },
    [BadgeType.Common]: {
      color: DesignSystem.Color.toVar('common'),
      title: 'Common'
    },
    [BadgeType.Uncommon]: {
      color: DesignSystem.Color.toVar('uncommon'),
      title: 'Uncommon'
    },
    [BadgeType.Rare]: {
      color: DesignSystem.Color.toVar('rare'),
      title: 'Rare'
    },
    [BadgeType.Epic]: {
      color: DesignSystem.Color.toVar('epic'),
      title: 'Epic'
    },
    [BadgeType.Legendary]: {
      color: DesignSystem.Color.toVar('legendary'),
      title: 'Legendary'
    },
    [BadgeType.Ancient]: {
      color: DesignSystem.Color.toVar('ancient'),
      title: 'Ancient'
    },
    [BadgeType.Divine]: {
      color: DesignSystem.Color.toVar('divine'),
      title: 'Divine'
    },
    [BadgeType.frontend]: {
      title: 'Frontend',
      icon: 'Monitor',
      color: new DesignSystem.Color('green-600')
    },
    [BadgeType.backend]: {
      title: capitalize(BadgeType.backend),
      icon: 'AcronymApi',
      color: new DesignSystem.Color('blue-600'),
    },
    [BadgeType.database]: {
      icon: 'Database',
      title: capitalize(BadgeType.database),
      color: new DesignSystem.Color('red-600'),
    },
    [BadgeType.middleware]: {
      icon: 'FunctionMiddleware',
      title: capitalize(BadgeType.middleware),
      color: new DesignSystem.Color('amber-600'),
    }
  };

  const { title, icon, revert, color, dot } = 'type' in options && !!map[options.type] ? map[options.type] : options as _CustomBadge;

  return (
    <div className={cn(s.badge, icon && s.icon, className, revert && s.revert)} style={{background: color instanceof DesignSystem.Color ? color.minus(5).valueOf() : color + '30', color: color?.toString()}}>
      {icon && <Icon size={16} color={color?.valueOf()} name={icon} />}
      {dot && <span style={{background: color?.valueOf()}} />}
      {options.title || title}
    </div>
  );
}