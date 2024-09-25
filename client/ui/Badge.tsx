'use client'
import { useLanguage } from '@/context/Language.context'
import s from './styles/Badge.module.css'
import { cn, λIcon } from '@/lib/utils'
import { Icon } from './Icon'

enum _BadgeDirections {
  default = 'default',
  reverse = 'reverse',
} 

interface _CustomBadge {
  title?: string,
  icon?: λIcon,
  direction?: _BadgeDirections,
  color: string
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
  prize = 'prize'
};

type _PredefinedBadge = {
  type: BadgeType
  title?: string
}

export function Badge(options: _PredefinedBadge | _CustomBadge) {
  const { lang } = useLanguage();
  const map: Record<BadgeType, _CustomBadge> = {
    [BadgeType.cookies]: {
      title: 'Cookies',
      icon: 'Cookie',
      direction: _BadgeDirections.default,
      color: '#d17724'
    },
    [BadgeType.frontend]: {
      title: 'Frontend',
      icon: 'Leaf',
      direction: _BadgeDirections.default,
      color: '#449d5d'
    },
    [BadgeType.backend]: {
      title: 'Backend',
      icon: 'Cloud',
      direction: _BadgeDirections.default,
      color: '#9162c0'
    },
    [BadgeType.devops]: {
      title: 'DevOps',
      icon: 'Database',
      direction: _BadgeDirections.default,
      color: '#3b88e9'
    },
    [BadgeType.primary]: {
      title: 'Primary',
      direction: _BadgeDirections.default,
      color: '#62c073'
    },
    [BadgeType.verified]: {
      title: lang._verified,
      direction: _BadgeDirections.default,
      color: '#52a8ff'
    },
    [BadgeType.selected]: {
      title: lang._selected,
      direction: _BadgeDirections.default,
      color: '#62c073'
    },
    [BadgeType.Upcoming]: {
      direction: _BadgeDirections.default,
      color: '#0070f3'
    },
    [BadgeType.Ongoing]: {
      direction: _BadgeDirections.default,
      color: '#31dd59'
    },
    [BadgeType.Finished]: {
      direction: _BadgeDirections.default,
      color: '#f30000'
    },
    [BadgeType.Soon]: {
      direction: _BadgeDirections.default,
      color: '#0070f3',
      title: lang._soon,
      dot: true
    },
    [BadgeType.Free]: {
      icon: 'DoorOpen',
      direction: _BadgeDirections.default,
      color: '#4af379',
    },
    [BadgeType.Invites]: {
      icon: 'TicketPercent',
      direction: _BadgeDirections.default,
      color: '#fe8d59',
    },
    [BadgeType.Closed]: {
      icon: 'DoorClosed',
      direction: _BadgeDirections.default,
      color: '#d41d14',
    },
    [BadgeType.prize]: {
      icon: 'Trophy',
      direction: _BadgeDirections.default,
      color: '#f3e000'
    },
    [BadgeType.Registered]: {
      icon: 'CircleCheck',
      direction: _BadgeDirections.default,
      color: '#c0c0c0'
    }
  };

  const { title, icon, direction, color, dot } = 'type' in options && !!map[options.type] ? map[options.type] : options as _CustomBadge;
  return (
    <div className={cn(s.badge, icon && s.icon)} data-color={color} style={{background: color + '30', color}} data-direction={direction}>
      {icon && <Icon size={16} color={color} name={icon} />}
      {dot && <span style={{background: color}} />}
      {options.title || title}
    </div>
  );
}