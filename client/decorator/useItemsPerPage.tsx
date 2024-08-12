import { useState, useEffect } from 'react';

export function useItemsPerPage(rows = 6, columns = 3) {
  const [itemsPerPage, setItemsPerPage] = useState<number>(calculateItemsPerPage());

  useEffect(() => {
    window.addEventListener('resize', () => setItemsPerPage(calculateItemsPerPage()));

    return () => {
      window.removeEventListener('resize', () => setItemsPerPage(calculateItemsPerPage()));
    }
  }, []);

  function calculateItemsPerPage() {
    const _columns = Math.floor(Math.min(window.innerWidth - 32, 1488) / (1488 / columns));
    return (_columns > 0 ? _columns : 1) * rows;
  }

  return { itemsPerPage };
}
