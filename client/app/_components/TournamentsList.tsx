'use client'
import { useState, useEffect } from "react";
import { Pagination } from "@/components/Pagination";
import s from './styles/TournamentList.module.css'
import { Tournament } from "@/dto/Tournament";
import { usePagination } from "@/decorator/usePagination";
import React from "react";
import { PanelTemplate } from "@/components/PanelTempate";
import { TournamentUnit } from "@/components/TournamentUnit";
import { Shapes } from "./Shapes";

export function TournamentsList({ tournaments }: { tournaments: Tournament[]}) {
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 510) {
        setItemsPerPage(1);
      } else if (window.innerWidth <= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();

    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);
  
  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: tournaments.length,
    itemsPerPage: itemsPerPage,
    buttons: 5
  });


  return (
    <PanelTemplate useColumn={true} className={s.page}>
      <Shapes />
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
