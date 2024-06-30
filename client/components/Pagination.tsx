'use client'
import { Button, ButtonTypes } from '@/ui/Button';
import s from './styles/Pagination.module.css';

interface PaginationComponentProps {
  page: number;
  total: number;
  getPageNumbers: () => number[];
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export function Pagination({
  page,
  total,
  getPageNumbers,
  setPage,
}: PaginationComponentProps) {
  const nextPage = () => setPage((prev) => Math.min(prev + 1, total));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setPage(page);

  return (
    <div className={s.pagination}>
      {/* Кнопка назад */}
      <Button options={{
        type: ButtonTypes.Button,
        text: 'Previous',
        do: prevPage,
        img: 'https://cdn.impactium.fun/ui/chevron/left-md.svg',
        className: useClasses(s.button, s.previous),
        disabled: page === 1
      }} />
      
      {/* Количество кнопок зависящее от кол-ва buttons переданное в usePagination */}
      {getPageNumbers().map((_page) => (
        <Button
          key={_page}
          options={{
            type: ButtonTypes.Button,
            text: _page.toString(),
            do: () => goToPage(_page),
            className: useClasses(s.button, _page === page && s.active),
          }}
        />
      ))}
      {/* Кнопка вперёд */}
      <Button options={{
        type: ButtonTypes.Button,
        text: 'Next',
        do: nextPage,
        img: 'https://cdn.impactium.fun/ui/chevron/right-md.svg',
        className: useClasses(s.button, s.next),
        disabled: page === total
      }} />
    </div>
  );
}
