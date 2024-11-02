import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import s from './styles/Console.module.css';
import { cn } from '@/lib/utils';
import { useApplication } from '@/context/Application.context';
import { λCookie, λWebSocket } from '@impactium/pattern';
import Cookies from 'universal-cookie';
import { History } from '@impactium/types';
import Image from 'next/image';
import { useUser } from '@/context/User.context';

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
  onClose?: () => void;
}

export function Console({ className, history, children, content, ...props }: ConsoleProps) {
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(480);
  const [hidden, setHidden] = useState(false);
  const { socket } = useApplication();
  const [command, setCommand] = useState('');
  const { refreshUser } = useUser();
  const self = useRef<HTMLDivElement>(null);

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

  const keypressHandler = (event: KeyboardEvent) => {
    const token = new Cookies().get(λCookie.Authorization);
    switch (event.key) {
      case 'Enter':
        socket.emit(λWebSocket.command, { token, command });
        setCommand('');
        break;
    }
  }

  useEffect(() => {
    self.current?.addEventListener('keypress', keypressHandler);
    socket.on(λWebSocket.login, token => {
      console.log(token);
      new Cookies().set(λCookie.Authorization, token);
      refreshUser(token);
    });

    return () => self.current?.removeEventListener('keypress', keypressHandler);
  })

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

  const hide = (value: boolean) => () => setHidden(value);

  return (
    <div
      ref={self}
      className={cn(s.console, hidden && s.hidden)}
      style={{ top, left, width, height }}
      {...props}>
      <div className={s.heading} onMouseDown={onMouseDownMove}>
        <DotButton type={DotButtonType.Close} onClick={props.onClose} />
        <DotButton type={DotButtonType.Hide} onClick={hide(true)} />
        <DotButton type={DotButtonType.Open} onClick={hide(false)} />
        <div className={s.title}>
          <Image priority src='https://cdn.impactium.fun/logo/impactium.svg' height={0} width={0} alt='' />
          <h1>Impactium</h1>
        </div>
      </div>
      <div className={cn(s.content, className)}>
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
          <input value={command} autoFocus onChange={e => setCommand(e.target.value)} />
        </div>
      </div>
      <div className={cn(s.resizeable, s.top)} onMouseDown={() => onMouseDownResize('top')} />
      <div className={cn(s.resizeable, s.left)} onMouseDown={() => onMouseDownResize('left')} />
      <div className={cn(s.resizeable, s.right)} onMouseDown={() => onMouseDownResize('right')} />
      <div className={cn(s.resizeable, s.bottom)} onMouseDown={() => onMouseDownResize('bottom')} />
      <div className={cn(s.resizeable, s.top, s.left)} onMouseDown={() => onMouseDownResize('top left')} />
      <div className={cn(s.resizeable, s.top, s.right)} onMouseDown={() => onMouseDownResize('top right')} />
      <div className={cn(s.resizeable, s.bottom, s.left)} onMouseDown={() => onMouseDownResize('bottom left')} />
      <div className={cn(s.resizeable, s.bottom, s.right)} onMouseDown={() => onMouseDownResize('bottom right')} />
    </div>
  );
}
