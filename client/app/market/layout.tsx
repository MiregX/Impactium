import { Parent } from "@/types";
import s from './market.module.css';

export default function ({ children }: Parent) {
  return (
    <main className={s.main}>
      {children}
    </main>
  )
}