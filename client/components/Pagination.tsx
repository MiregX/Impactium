'use client'
import { Button, ButtonTypes } from '@/ui/Button'
import s from './styles/Pagination.module.css'

interface PaginationProps {
  state: number,
  setState: (state: number) => void,
  max: number,
  buttons?: number // Optional, default to 3
}

export function Pagination({ state, setState, max, buttons = 3 }: PaginationProps) {
  const getPageNumbers = () => {
    const half = Math.floor(buttons / 2);
    let start = Math.max(state - half, 1);
    let end = Math.min(start + buttons - 1, max);

    if (end - start + 1 < buttons) {
      start = Math.max(end - buttons + 1, 1);
    }

    return Array.from({ length: (end - start + 1) }, (_, i) => start + i);
  };

  const handlePageClick = (page: number) => {
    setState(page);
  };

  return (
    <div className={s.pagination}>
      <Button options={{
        type: ButtonTypes.Button,
        text: 'Previous',
        do: () => setState(state - 1),
        img: 'https://cdn.impactium.fun/ui/chevron/left-md.svg',
        className: useClasses(s.button, s.previous),
        disabled: state === 1
      }} />
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          options={{
            type: ButtonTypes.Button,
            text: page.toString(),
            do: () => handlePageClick(page),
            className: useClasses(s.button, page === state && s.active),
          }}
        />
      ))}
      <Button options={{
        type: ButtonTypes.Button,
        text: 'Next',
        do: () => setState(state + 1),
        img: 'https://cdn.impactium.fun/ui/chevron/right-md.svg',
        className: useClasses(s.button, s.next),
        disabled: state === max
      }} />
    </div>
  );
}
