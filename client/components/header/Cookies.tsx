import React from "react";
import s from '@/styles/Header.module.css'
import { Badge, BadgeTypes } from "@/ui/Badge";

export function Cookies() {
  return (
    <div className={s.cookies}>
      <Badge title='cookies' type={BadgeTypes.cookies} />
      <p></p>
      <div className={s.node}>
        <button className={s.default}>Consent settings</button>
        <div className={s.pod}>
          <button className={`${s.default} ${s.accent}`}>Deny</button>
          <button className={`${s.default} ${s.accent}`}>Accept</button>
        </div>
      </div>
    </div>
  );
}
