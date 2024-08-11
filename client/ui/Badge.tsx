'use client'
import { useLanguage } from '@/context/Language.context'
import s from './styles/Badge.module.css'
import Image from 'next/image'
import { cn } from '@/lib/utils'

enum _BadgeDirections {
  default = 'default',
  reverse = 'reverse',
} 

interface _CustomBadge {
  title?: string,
  icon?: BadgeType | string,
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
  Upcoming = 'upcoming',
  Ongoing = 'ongoing',
  Finished = 'finished',
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
      icon: 'cookies',
      direction: _BadgeDirections.default,
      color: '#d17724'
    },
    [BadgeType.frontend]: {
      title: 'Frontend',
      icon: 'leaf',
      direction: _BadgeDirections.default,
      color: '#449d5d'
    },
    [BadgeType.backend]: {
      title: 'Backend',
      icon: 'cloud',
      direction: _BadgeDirections.default,
      color: '#9162c0'
    },
    [BadgeType.devops]: {
      title: 'DevOps',
      icon: 'sql',
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
    [BadgeType.prize]: {
      icon: 'trophy',
      direction: _BadgeDirections.default,
      color: '#f3e000'
    }
  };

  const { title, icon, direction, color, dot } = 'type' in options && !!map[options.type] ? map[options.type] : options as _CustomBadge;
  return (
    <div className={cn(s.badge, icon && s.icon)} data-color={color} style={{background: color + '30', color}} data-direction={direction}>
      {icon && (<Image src={icon.startsWith('http') || icon.startsWith('/_next') ? icon : `https://cdn.impactium.fun/custom-ui/${icon}.svg`} alt='' width={16} height={16} />)}
      {dot && <span style={{background: color}} />}
      {options.title || title}
    </div>
  );
}