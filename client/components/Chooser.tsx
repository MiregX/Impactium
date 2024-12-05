import { Switch } from "@/ui/Switch";
import { SwitchProps } from "@radix-ui/react-switch";
import s from './styles/_.module.css';
import { cn } from "@impactium/utils";

interface ChooserProps extends SwitchProps {
  values: [string, string];
}

export function Chooser({ values, ...props }: ChooserProps) {
  return (
    <div className={s.chooser}>
      <p className={cn(!props.checked && s.active)}>{values[0]}</p>
      <Switch {...props} />
      <p className={cn(props.checked && s.active)}>{values[1]}</p>
    </div>
  )
}