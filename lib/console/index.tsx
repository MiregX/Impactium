import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import s from './Console.module.css';
import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'verbose' | 'fatal';

export interface History {
  level: LogLevel;
  message: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface OptionalProps {
  noise?: boolean;
  onClose?: () => void;
  onCommand?: (command: string) => any;
  defaultCommand?: string;
}

interface RequiredProps {
  history: History[];
  title: string;
  icon: string | React.ReactElement<HTMLImageElement> | React.ReactElement<SVGSVGElement>;
  prefix: string;
}

export interface ConsoleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'>, RequiredProps, OptionalProps {}

export interface NoiseProps extends HTMLAttributes<SVGSVGElement> {
  enable?: boolean;
}

export function Console({ className, noise, onCommand, title = 'Command Shell', icon, defaultCommand, prefix, history, children, ...props }: ConsoleProps) {
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(480);
  const [hidden, setHidden] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const [command, setCommand] = useState<string | number>(String(defaultCommand));
  const self = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  function Noise({ className, enable, ...props }: NoiseProps) {
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
      setTop(top => Math.min(Math.max(top + event.movementY, 0), window.innerHeight - self.current!.clientHeight));
      setLeft(left => Math.min(Math.max(left + event.movementX, 0), window.innerWidth - self.current!.clientWidth));
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
        setHeight(height => Math.max(height + e.movementY, 50));
      }
      if (direction.includes('left')) {
        setWidth(width => Math.max(width - e.movementX, 50));
        setLeft(left => left + e.movementX);
      }
      if (direction.includes('right')) {
        setWidth(width => Math.max(width + e.movementX, 50));
      }
      if (direction.includes('top')) {
        setHeight(height => Math.max(height - e.movementY, 50));
        setTop(top => top + e.movementY);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleScroll = useCallback((anable: boolean) => {
    document.body.style.overflow = anable ? 'auto' : 'hidden';
    document.documentElement.style.overflow = anable ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    const keypressHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          const cmd = typeof command === 'number' ? commands[command] : command;
          if (onCommand) onCommand(cmd);
          if (command && typeof command === 'string') setCommands((c) => [...c, cmd]);
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
  }, [history, command]);

  const [fullscreen, setFullscreen] = useState<[number, number, number, number] | null>(null);
  const open = () => {
    toggleScroll(!!fullscreen);
    setHidden(false);
    setFullscreen(fullscreen ? null : [height, width, top, left]);
    setHeight(fullscreen ? fullscreen[0] : window.innerHeight);
    setWidth(fullscreen ? fullscreen[1] : window.innerWidth);
    setTop(fullscreen ? fullscreen[2] : 0);
    setLeft(fullscreen ? fullscreen[3] : 0);
  };

  const hide = () => setHidden(h => !h);

  useEffect(() => {
    if (hidden) {
      toggleScroll(true);
    } else if (fullscreen) {
      toggleScroll(false);
    }
  }, [hidden]);

  const close = () => {
    toggleScroll(true);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onMouseDownContentHandler = (event: React.MouseEvent) => {
    if (window.getSelection()?.toString())
      event.preventDefault();
    input.current?.focus();
  }

  const onClickContentHandler = () => !window.getSelection()?.toString() && input.current?.focus();

  return (
    <div
      ref={self}
      className={cn(s.console, hidden && s.hidden, fullscreen && s.fullscreen)}
      style={{ top, left, width, height }}
      {...props}>
      <div className={s.heading} onMouseDown={onMouseDownMove}>
        <span className={cn(s.button, s.close)} onClick={close} />
        <span className={cn(s.button, s.hide)} onClick={hide} />
        <span className={cn(s.button, s.open)} onClick={open} />
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
  );
}
