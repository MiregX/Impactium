import { useCallback, useRef, useState } from 'react';
import s from './styles/Console.module.css';
import { cn } from '@/lib/utils';

enum DotButtonType {
  Close = 'close',
  Hide = 'hide',
  Open = 'open'
}

interface DotButtonProps {
  type: DotButtonType;
}

export function Console() {
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const self = useRef<HTMLDivElement>(null);

  const DotButton = useCallback(({ type }: DotButtonProps) => {
    return <span className={cn(s.button, s[type])} />;
  }, []);

  const onMouseDownMove = () => {
    const onMouseMove = (event: MouseEvent) => {
      setTop(top => Math.min(Math.max(top + event.movementY, 0), window.innerWidth - self.current!.clientWidth));
      setLeft(left => Math.min(Math.max(left + event.movementX, 0), window.innerHeight - self.current!.clientHeight));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseDownResize = (direction: string) => {
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

  return (
    <div
      ref={self}
      className={s.console}
      style={{ top, left, width, height }}>
      <div className={s.heading} onMouseDown={onMouseDownMove}>
        {DotButton({ type: DotButtonType.Close })}
        {DotButton({ type: DotButtonType.Hide })}
        {DotButton({ type: DotButtonType.Open })}
      </div>
      <div className={s.content}>Resizable Content</div>
      <div className={cn(s.resizeable, s.top)} onMouseDown={(e) => onMouseDownResize('top')} />
      <div className={cn(s.resizeable, s.left)} onMouseDown={(e) => onMouseDownResize('left')} />
      <div className={cn(s.resizeable, s.right)} onMouseDown={(e) => onMouseDownResize('right')} />
      <div className={cn(s.resizeable, s.bottom)} onMouseDown={(e) => onMouseDownResize('bottom')} />
      <div className={cn(s.resizeable, s.top, s.left)} onMouseDown={(e) => onMouseDownResize('top left')} />
      <div className={cn(s.resizeable, s.top, s.right)} onMouseDown={(e) => onMouseDownResize('top right')} />
      <div className={cn(s.resizeable, s.bottom, s.left)} onMouseDown={(e) => onMouseDownResize('bottom left')} />
      <div className={cn(s.resizeable, s.bottom, s.right)} onMouseDown={(e) => onMouseDownResize('bottom right')} />
    </div>
  );
}
