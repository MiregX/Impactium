import { HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import s from './styles/Console.module.css';
import { cn } from '@/lib/utils';
import { useApplication } from '@/context/Application.context';
import { λCookie, λParam, λWebSocket } from '@impactium/pattern';
import Cookies from 'universal-cookie';
import { History } from '@impactium/types';
import Image from 'next/image';
import { useUser } from '@/context/User.context';
import { Noise } from '@/ui/Noise';

enum DotButtonType {
  Close = 'close',
  Hide = 'hide',
  Open = 'open'
}

interface DotButtonProps extends HTMLAttributes<HTMLButtonElement> {
  type: DotButtonType;
}

interface ConsoleProps extends HTMLAttributes<HTMLDivElement> {
  history: History[];
  noise?: boolean;
  onClose?: () => void;
}

export function Console({ className, noise, history, children, ...props }: ConsoleProps) {
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(480);
  const [hidden, setHidden] = useState(false);
  const [commands, setCommands] = useState<λParam.Command[]>([]);
  const [isNoiseEnable, setIsNoiseEnable] = useState<boolean>(Boolean(noise));
  const { socket } = useApplication();
  const [command, setCommand] = useState<λParam.Command | number>(λParam.Command(''));
  const { refreshUser } = useUser();
  const self = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const DotButton = useCallback(({ type, ...props }: DotButtonProps) => {
    return <span className={cn(s.button, s[type])} {...props} />;
  }, []);

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
      const token = new Cookies().get(λCookie.Authorization);
      switch (event.key) {
        case 'Enter':
          const cmd = typeof command === 'number' ? commands[command] : command;
          if (cmd === 'noise') return setIsNoiseEnable(v => !v);
          socket.emit(λWebSocket.command, { token, command: cmd });
          if (command && typeof command === 'string') setCommands((c) => [...c, cmd]);
          setCommand(λParam.Command(''));
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
        default:
          break;
      }
    };

    const login = (token: string) => {
      new Cookies().set(λCookie.Authorization, token);
      refreshUser(token);
    }

    socket.on(λWebSocket.login, login);
  
    document.addEventListener('keydown', keypressHandler);
  
    return () => {
      document.removeEventListener('keydown', keypressHandler);
      socket.off(λWebSocket.login, login);
    };
  }, [command, commands, socket]);

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
        <DotButton type={DotButtonType.Close} onClick={close} />
        <DotButton type={DotButtonType.Hide} onClick={hide} />
        <DotButton type={DotButtonType.Open} onClick={open} />
        <div className={s.title}>
          <Image priority src='https://cdn.impactium.fun/logo/impactium.svg' height={0} width={0} alt='' />
          <h1>Impactium</h1>
        </div>
      </div>
      <div onMouseDown={onMouseDownContentHandler} onClick={onClickContentHandler} className={cn(s.content, className)}>
        <Noise enable={isNoiseEnable} className={s.noise} />
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
          <span>C:\Mireg\Impactium{'>'}</span>
          <input ref={input} value={Number.isInteger(command) ? commands[command as number] : command} autoFocus onChange={e => setCommand(λParam.Command(e.target.value))} />
        </div>
      </div>
      {['top', 'left', 'right', 'bottom', 'top left', 'top right', 'bottom left', 'bottom right'].map(resize => (
        <div key={resize} className={cn(s.resizeable, ...resize.split(' ').map(r => s[r]))} onMouseDown={() => onMouseDownResize(resize)} />
      ))}
    </div>
  );
}
