'use client'
import React, { useEffect, useState } from "react";
import s from './Cookies.module.css'
import { Badge, BadgeTypes } from "@/ui/Badge";
import Cookies from "universal-cookie";

export function CookiesConsemption({ consemption }) {
  const cookie = new Cookies()
  const [acceptTimer, setAcceptTimer] = useState(7);
  const [isAccepted, setIsAccepted] = useState<boolean>(consemption);

  useEffect(() => {
    if (!isAccepted && acceptTimer > 0) {
      setTimeout(() => {
        setAcceptTimer(acceptTimer - 1);
      }, 1000);
    } else if (!isAccepted) {
      acceptCookies();
    }
  }, [acceptTimer]);

  function acceptCookies() {
    cookie.set('_cookies_consent', '_');
    setIsAccepted(true);
  }

  return (
    <div className={`${s.cookies} ${isAccepted && s.hide}`}>
      <Badge title='Cookies' color='#d17724' icon={BadgeTypes.cookies} />
      <p></p>
      <div className={s.node}>
        <button className={s.default}>Consent settings</button>
        <div className={s.pod}>
          <button className={`${s.default} ${s.accept}`} onClick={acceptCookies}>Accept({acceptTimer})</button>
        </div>
      </div>
    </div>
  );
}
