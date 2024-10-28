'use client'
import { useLanguage } from '@/context/Language.context'
import s from './styles/Badge.module.css'
import { cn, λIcon } from '@/lib/utils'
import { Icon } from './Icon'
import { HTMLAttributes } from 'react'
import { λUtils } from '@impactium/utils'

enum _BadgeDirections {
  default = 'default',
  reverse = 'reverse',
} 

interface _CustomBadge {
  title?: string,
  icon?: λIcon,
  direction?: _BadgeDirections,
  color?: string
  dot?: boolean
}

export enum BadgeType {
  cookies = 'cookies',
  frontend = 'frontend',
  backend = 'backend',
  devops = 'devops',
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
    [BadgeType.frontend]: {
      title: 'Frontend',
      icon: 'Leaf',
      color: '#449d5d'
    },
    [BadgeType.backend]: {
      title: 'Backend',
      icon: 'Cloud',
      color: '#9162c0'
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
      color: λUtils.var('common'),
      title: 'Common'
    },
    [BadgeType.Uncommon]: {
      color: λUtils.var('uncommon'),
      title: 'Uncommon'
    },
    [BadgeType.Rare]: {
      color: λUtils.var('rare'),
      title: 'Rare'
    },
    [BadgeType.Epic]: {
      color: λUtils.var('epic'),
      title: 'Epic'
    },
    [BadgeType.Legendary]: {
      color: λUtils.var('legendary'),
      title: 'Legendary'
    },
    [BadgeType.Ancient]: {
      color: λUtils.var('ancient'),
      title: 'Ancient'
    },
    [BadgeType.Divine]: {
      color: λUtils.var('divine'),
      title: 'Divine'
    }
  };

  const { title, icon, direction, color, dot } = 'type' in options && !!map[options.type] ? map[options.type] : options as _CustomBadge;
  return (
    <div className={cn(s.badge, icon && s.icon, className)} data-color={color} style={{background: color + '30', color}} data-direction={direction} {...options}>
      {icon && <Icon size={16} color={color} name={icon} />}
      {dot && <span style={{background: color}} />}
      {options.title || title}
    </div>
  );
}