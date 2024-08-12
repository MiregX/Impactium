'use client'
import { useState, useEffect } from "react";
import { Pagination } from "@/components/Pagination";
import s from './styles/TournamentList.module.css'
import { Tournament } from "@/dto/Tournament";
import { usePagination } from "@/decorator/usePagination";
import React from "react";
import { PanelTemplate } from "@/components/PanelTempate";
import { TournamentUnit, TournamentUnitSkeleton } from "@/components/TournamentUnit";
import { ПошёлНахуй } from "./ПошёлНахуй";

export function TournamentsList({ tournaments }: { tournaments: Tournament[]}) {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: tournaments.length,
    itemsPerPage: itemsPerPage,
    buttons: 5
  });

  useEffect(() => {
    const updateItemsPerPage = () => {
      const columns = Math.floor(Math.min(window.innerWidth - 32, 1488) / (1488 / 3));
      setItemsPerPage(columns > 0 ? columns : 1);
    };
    
    updateItemsPerPage();

    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);  

  return (
    <PanelTemplate useColumn={true} className={s.page}>
      <ПошёлНахуй mode='frendly' />
      <h4 style={{width: '100%', marginTop: '12px', fontSize: '18px'}}>Актуальные турниры:</h4>
      <div className={s.wrapper}>
        {current.map(index => (
          <TournamentUnit key={index} tournament={tournaments[index]} />
        ))}
      </div>
      <Pagination
        page={page}
        total={total}
        getPageNumbers={getPageNumbers}
        setPage={setPage}
      />
    </PanelTemplate>
  );
};
