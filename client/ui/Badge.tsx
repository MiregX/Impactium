import s from '@/ui/styles/Badge.module.css'

enum _BadgeDirections {
  default = 'default',
  reverse = 'reverse',
} 

interface _CustomBadge {
  title?: string,
  icon?: BadgeTypes | string,
  direction?: _BadgeDirections,
  color: string
}

export enum BadgeTypes {
  cookies = 'cookies',
  frontend = 'frontend',
  backend = 'backend',
  devops = 'devops',
};

type _PredefinedBadge = {
  type: BadgeTypes
  title?: string
}

export function Badge(options: _PredefinedBadge | _CustomBadge) {
  const map: Record<BadgeTypes, _CustomBadge> = {
    [BadgeTypes.cookies]: {
      title: 'Cookies',
      icon: 'cookies',
      direction: _BadgeDirections.default,
      color: '#d17724'
    },
    [BadgeTypes.frontend]: {
      title: 'Frontend',
      icon: 'leaf',
      direction: _BadgeDirections.default,
      color: '#449d5d'
    },
    [BadgeTypes.backend]: {
      title: 'Backend',
      icon: 'cloud',
      direction: _BadgeDirections.default,
      color: '#9162c0'
    },
    [BadgeTypes.devops]: {
      title: 'DevOps',
      icon: 'sql',
      direction: _BadgeDirections.default,
      color: '#3b88e9'
    },
  };

  const { title, icon, direction, color } = 'type' in options && !!map[options.type] ? map[options.type] : options as _CustomBadge;
  return (
    <div className={s.badge} data-color={color} style={{background: color + '18', color}} data-direction={direction}>
      {icon && (<img src={icon.startsWith('http') || icon.startsWith('/_next') ? icon : `https://cdn.impactium.fun/custom-ui/${icon}.svg`} alt='' />)}
      {options.title || title}
    </div>
  );
}