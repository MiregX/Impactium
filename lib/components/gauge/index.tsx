import { Color } from '@impactium/design'
import { SVGAttributes } from 'react'
import s from './gauge.module.css';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons';
import { Stack } from '..';

export namespace Gauge {
  export interface Props extends SVGAttributes<SVGSVGElement> {
    value: number;
    label?: string | Icon.Name;
    size?: number
    colors?: Color.Scale | Color.Single;
  }

  export namespace Color {
    export interface Single {
      primary: string
      secondary: string
    }

    export interface Scale {
      [key: string]: string;
    }
  }
}

export function Gauge({ value: _value, label, size = 24, colors, className, ...props }: Gauge.Props) {
  const value = Math.min(Math.max(0, _value), 100)

  const isColorScale = colors && 'primary' in colors === false

  const getDefaultStrokeColor = () => {
    switch (true) {
      case value >= 66:
        return Color.toVar('green-800')
      case value >= 33:
        return Color.toVar('amber-800')
      default:
        return Color.toVar('red-800')
    }
  }

  const getStrokeColor = () => {
    if (!colors) return getDefaultStrokeColor()

    if (!isColorScale) {
      return colors.primary
    }

    const keys = Object.keys(colors)
      .map(Number)
      .sort((a, b) => a - b)

    for (let i = keys.length - 1; i >= 0; i--) {
      if (value >= keys[i]) {
        return colors[keys[i]]
      }
    }

    return colors[keys[0]]
  }

  const getTrackColor = () => {
    if (colors && !isColorScale) {
      return colors.secondary
    }

    return 'var(--gray-400)'
  }

  const strokeWidth = typeof props.strokeWidth === 'string' ? parseInt(props.strokeWidth) : props.strokeWidth || (size > 24 ? 4 : 3);
  const circumference = 2 * Math.PI * 45;

  const hasGaps = circumference > 2 * strokeWidth;

  return (
    <Stack ai='center' jc='center'>
      <svg viewBox='0 0 100 100' strokeWidth={strokeWidth} height={size} width={size} className={cn(s.svg, className)} style={{
        ['--stroke-percent' as never]: value,
        ['--circle-size' as never]: '100px',
        ['--circumference' as never]: circumference,
        ['--percent-to-px' as never]: `${circumference / 100}px`,
        ['--gap-percent' as never]: hasGaps ? 6 : 0,
        ['--offset-factor' as never]: 0
      }} {...props}>
        <circle
          className={s.track}
          cx={50}
          cy={50}
          r={45}
          strokeWidth={10}
          opacity={Number(value < 90)}
          strokeDashoffset={0}
          fill='none'
          style={{ stroke: getTrackColor() }}
        />
        <circle
          className={s.progress}
          cx={50}
          cy={50}
          r={45}
          strokeWidth={10}
          strokeDashoffset={0}
          fill='none'
          style={{ stroke: getStrokeColor() }}
        />
      </svg>
      {label ? (label in Icon.icons ? <Icon size={size / 2} className={s.label} name={label as Icon.Name} color={getStrokeColor()} /> : <p className={s.label} style={{ fontSize: size / 5, color: getStrokeColor() }}>{label}</p>) :  null}
    </Stack>
  )
}
