'use client'
import { Button } from '@/ui/Button';
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
      <Button variant={page === 1 ? 'disabled' : 'ghost'}
        img='https://cdn.impactium.fun/ui/chevron/left-md.svg'
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
        img='https://cdn.impactium.fun/ui/chevron/right-md.svg'>Next</Button>
    </div>
  );
}
