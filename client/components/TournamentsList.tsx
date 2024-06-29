'use client'

import { useState } from "react"
import { Pagination } from "./Pagination";

export function TournamentsList() {
  const [page, setPage] = useState<number>(1);
  
  return (
    <div>

      <Pagination state={page} setState={setPage} max={5} buttons={5} />
    </div>
  )
}