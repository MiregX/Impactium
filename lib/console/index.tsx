import { HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import s from './Console.module.css';
import { cn } from '@impactium/utils';

export namespace Console {
  export type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'verbose' | 'fatal';

  export interface History {
    level: LogLevel;
    message: string;
  }

  export type PositionOptions = {
    top?: number; 
    left?: number;
  }

  export type SizeOptions = {
    height?: number; 
    width?: number;
  }

  type NumericOptions = [number, number];

  export interface OptionalProps {
    noise?: boolean;
    onCommand?: (command: string) => any;
    defaultCommand?: string;
    defaultOpen?: boolean;
    trigger?: string;
    size?: SizeOptions | NumericOptions;
    position?: PositionOptions | NumericOptions;
  }
  
  export interface RequiredProps {
    history: History[];
    title: string;
    icon?: string | React.ReactElement<HTMLImageElement> | React.ReactElement<SVGSVGElement>;
    prefix: string;
  }

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'>, RequiredProps, OptionalProps {}

  export interface NoiseProps extends HTMLAttributes<SVGSVGElement> {
    enable?: boolean;
  }
}

export function Console({ className, noise, onCommand, title = 'Command Shell', icon, defaultCommand, prefix, history, defaultOpen, children, trigger = '/', ...props }: Console.Props) {
  const self = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<Required<Console.SizeOptions & Console.PositionOptions>>({
    top: (Array.isArray(props.position) ? props.position[0] : props.position?.top) || 100,
    left: (Array.isArray(props.position) ? props.position[1] : props.position?.left) || 100,
    height: (Array.isArray(props.size) ? props.size[0] : props.size?.height) || 480,
    width: (Array.isArray(props.size) ? props.size[1] : props.size?.width) || 960,
  });

  const [open, setOpen] = useState<boolean>(defaultOpen ?? false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [hidden, setHidden] = useState(false);

  const [commands, setCommands] = useState<string[]>([]);
  const [command, setCommand] = useState<string | number>(defaultCommand || '');

  function Noise({ className, enable, ...props }: Console.NoiseProps) {
    const Noise = useCallback(() => enable ? (
      <svg className={cn(className, s.noise)} {...props}>
        <filter id='noise'>
          <feTurbulence seed={128} type='fractalNoise' baseFrequency={0.8} />
        </filter>
        <rect width='100%' height='100%' filter={`url(#noise)`} />
      </svg>
    ) : null, [enable]);
  
    return <Noise />;
  }

  const onMouseDownMove = () => {
    if (hidden) return;

    const onMouseMove = (event: MouseEvent) => {
      setSettings(settings => ({
        ...settings,
        top: Math.min(Math.max(settings.top + event.movementY, 0), window.innerHeight - self.current!.clientHeight),
        left: Math.min(Math.max(settings.left + event.movementX, 0), window.innerWidth - self.current!.clientWidth)
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseDownResize = (direction: string) => {
    if (hidden) return;

    const onMouseMove = (e: MouseEvent) => {
      if (direction.includes('bottom')) {
        setSettings(settings => ({
          ...settings,
          height: Math.max(settings.height + e.movementY, 50)
        }));
      }
      if (direction.includes('left')) {
        setSettings(settings => ({
          ...settings,
          width: Math.max(settings.width - e.movementX, 50),
          left: settings.left + e.movementX
        }));
      }
      if (direction.includes('right')) {
        setSettings(settings => ({
          ...settings,
          width: Math.max(settings.width + e.movementX, 50),
        }));
      }
      if (direction.includes('top')) {
        setSettings(settings => ({
          ...settings,
          height: Math.max(settings.height - e.movementY, 50),
          top: settings.top + e.movementY
        }));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleScroll = useCallback((enable: boolean) => {
    document.body.style.overflow = enable ? 'auto' : 'hidden';
    document.documentElement.style.overflow = enable ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    const keypressHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          const cmd = typeof command === 'number'
            ? commands[command]
            : command;

          if (onCommand)
            onCommand(cmd);

          if (command && typeof command === 'string')
            setCommands((c) => [...c, cmd]);

          setCommand('');
          break;
        case 'ArrowUp':
          setCommand((prevCommand) =>
            typeof prevCommand === 'number'
              ? Math.max(prevCommand - 1, 0)
              : commands.length - 1
          );
          break;
        case 'ArrowDown':
          setCommand((prevCommand) =>
            typeof prevCommand === 'number'
              ? Math.min(prevCommand + 1, commands.length - 1)
              : 0
          );
          break;
      }
    };
  
    document.addEventListener('keydown', keypressHandler);
  
    return () => {
      document.removeEventListener('keydown', keypressHandler);
    };
  }, [command, commands]);

  useEffect(() => {
    const keypressHandler = (e: KeyboardEvent) => {
      if (e.key === trigger) {
        e.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener('keypress', keypressHandler)

    return () => {
      document.removeEventListener('keypress', keypressHandler)
    };
  }, [self, trigger]);

  useEffect(() => {
    if (!open)
      return toggleScroll(true);

    if (fullscreen && !hidden) {
      return toggleScroll(false)
    } else {
      return toggleScroll(true);
    }

  }, [open, fullscreen, hidden]);

  const colorCodes: Record<string, string | null> = {
    '[32m': 'log',
    '[33m': 'warn',
    '[31m': 'error',
    '[34m': 'debug',
    '[36m': 'verbose',
    '[37m': 'white',
    '[1m': 'bold',
    '[0m': null
  };

  useEffect(() => {
    const content = self.current?.getElementsByClassName(s.content).item(0)!;

    content?.scrollTo({ behavior: 'instant', top: content.scrollHeight });
  }, [history, command, open]);

  const toggleOpen = () => {
    setFullscreen(!fullscreen);
    setHidden(false)
  };

  const close = () => setOpen(false);

  const onMouseDownContentHandler = (event: React.MouseEvent) => {
    if (window.getSelection()?.toString())
      event.preventDefault();
    input.current?.focus();
  }

  const onClickContentHandler = () => !window.getSelection()?.toString() && input.current?.focus();

  const Console = useMemo(() => open ? (
    <div
      ref={self}
      className={cn(s.console, hidden && s.hidden, fullscreen && s.fullscreen)}
      style={settings}
      {...props}>
      <div className={s.heading} onMouseDown={onMouseDownMove}>
        <span className={cn(s.button, s.close)} onClick={close} />
        <span className={cn(s.button, s.hide)} onClick={() => setHidden(h => !h)} />
        <span className={cn(s.button, s.open)} onClick={toggleOpen} />
        <div className={s.title}>
          {typeof icon === 'string' ? <img src={icon} alt='' /> : icon}
          <h1>{title}</h1>
        </div>
      </div>
      <div onMouseDown={onMouseDownContentHandler} onClick={onClickContentHandler} className={cn(s.content, className)}>
        <Noise enable={noise} className={s.noise} />
        {history.map(h => <span className={s[h.level]}>{((message: string) => {
          const parts = message.split('');
          const parsedParts: JSX.Element[] = [];

          let current: string = h.level;
          parts.forEach((part, index) => {
            const match = part.match(/\[(\d+)m/)?.[0] || '';
            const level = match ? colorCodes[match] || h.level : current;
            if (level !== current) {
              current = level || h.level;
            }
            const text = part.replace(match, '');
            parsedParts.push(
              <span key={index} className={s[current]}>{text}{index === parts.length - 1 ? '\n' : ''}</span>
            );
          });

          return parsedParts;
        })(h.message)}</span>)} 
        <div className={s.command}>
          <span>{prefix}</span>
          <input ref={input} value={Number.isInteger(command) ? commands[command as number] : command} autoFocus onChange={e => setCommand(e.target.value)} />
        </div>
      </div>
      {['top', 'left', 'right', 'bottom', 'top left', 'top right', 'bottom left', 'bottom right'].map(resize => (
        <div key={resize} className={cn(s.resizeable, ...resize.split(' ').map(r => s[r]))} onMouseDown={() => onMouseDownResize(resize)} />
      ))}
    </div>
  ) : null, [history, open, fullscreen, input, self, settings, noise, title, icon, defaultCommand, prefix, defaultOpen, trigger, onCommand, className, noise, props]);

  return Console;
}
