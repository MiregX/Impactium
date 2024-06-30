import { useState, useMemo } from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
  buttons?: number;
}

interface UsePagination {
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  total: number,
  current: number[]
  getPageNumbers: () => number[],
}

export const usePagination = ({
  // Общее кол-во компонентов 
  totalItems,
  // Кол-во компонентов которые нужно отображать на странице
  itemsPerPage,
  // Кол-во кнопок для отображения
  buttons = 3,
  // Начальная страница (обычно 1)
  initialPage = 1,
}: PaginationProps) => {
  const [page, setPage] = useState(initialPage);

  const total = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const half = Math.floor(buttons / 2);
    let start = Math.max(page - half, 1);
    let end = Math.min(start + buttons - 1, total);

    if (end - start + 1 < buttons) {
      start = Math.max(end - buttons + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const current = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return Array.from({ length: itemsPerPage }, (_, i) => startIndex + i).slice(0, endIndex - startIndex);
  }, [page, itemsPerPage, totalItems]);


  const result: UsePagination = {
    // Текущая страница
    page,
    // Изменить текущую страницу
    setPage,
    // Общее кол-во страниц
    total,
    // Индексы предметов которые нужно отобразить
    current,
    // Получить циферки страниц после изменения изначения pages (автоматически)
    getPageNumbers,
  }

  return result
};
