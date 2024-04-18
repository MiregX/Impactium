import React, { useEffect, useState } from "react";
import s from '@/styles/header/Cookies.module.css'
import { Badge, BadgeTypes } from "@/ui/Badge";

export function Cookies() {
  const [acceptTimer, setAcceptTimer] = useState(7);
  const [isAccepted, setIsAccepted] = useState(getCookie("_cookies_consent"));

  function setCookie(name: string, value: string, options = {}): void {
    options = {
      path: '/',
      expires: "Fri, 31 Dec 9999 23:59:59 GMT",
      ...options
    };

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  }

  function getCookie(name: string): boolean {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? Boolean(decodeURIComponent(matches[1])) : false;
  }

  useEffect(() => {
    console.log(isAccepted);
    if (!isAccepted && acceptTimer > 0) {
      setTimeout(() => {
        setAcceptTimer(acceptTimer - 1);
      }, 1000);
    } else if (!isAccepted) {
      acceptCookies();
    }
  }, [acceptTimer]);

  function acceptCookies() {
    setCookie('_cookies_consent', 'true');
    setIsAccepted(true);
  }

  return (
    <>
      {
        !isAccepted && acceptTimer > 0 ?
          <>
            <div className={s.cookies}>
              <Badge title='Cookies' color='#d17724' icon={BadgeTypes.cookies} />
              <p></p>
              <div className={s.node}>
                <button className={s.default}>Consent settings</button>
                <div className={s.pod}>
                  <button className={`${s.default} ${s.acceptBtn}`} onClick={acceptCookies}>Accept({acceptTimer})</button>
                </div>
              </div>
            </div>
          </>
          : null
      }
    </>
  );
}
