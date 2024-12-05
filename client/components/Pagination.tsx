'use client'
import { Button } from '@impactium/components';
import s from './styles/Pagination.module.css';
import { HTMLAttributes } from 'react';
import { cn } from '@impactium/utils';

type PaginationComponentProps = HTMLAttributes<HTMLDivElement> & {
  page: number;
  total: number;
  getPageNumbers: () => number[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function Pagination({
  page,
  total,
  getPageNumbers,
  setPage,
  className,
  ...props
}: PaginationComponentProps) {
  const nextPage = () => setPage((prev) => Math.min(prev + 1, total));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setPage(page);

  return (
    <div className={cn(s.pagination, className)} {...props}>
      {/* Кнопка назад */}
      <Button variant={page === 1 ? 'disabled' : 'ghost'}
        img='ChevronLeft'
        onClick={prevPage}>Previous</Button>
      
      {/* Количество кнопок зависящее от кол-ва buttons переданное в usePagination */}
      {getPageNumbers().map((_page) => (
        <Button
          size='icon'
          key={_page}
          variant={_page === page ? 'hardline' : 'ghost'}
          onClick={ () => goToPage(_page)}>{_page}</Button>
      ))}
      {/* Кнопка вперёд */}
      <Button
        revert
        onClick={nextPage}
        variant={page === total ? 'disabled' : 'ghost'}
        img='ChevronRight'>Next</Button>
    </div>
  );
}
