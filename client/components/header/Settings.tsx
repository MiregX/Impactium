import React, { useEffect, useState } from 'react';
import s from "../../styles/header/Settngs.module.css";

const Settings = () => {
  const [cookies, setCookies] = useState(getCookie("_cookies_consent"));
  const [showWindow, setShowWindow] = useState(false);

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

    if (!matches) return false;
    else if (matches[1] === "false") return false;
    else if (matches[1] === "true") return true;
  }

  return (
    <>
      {
        showWindow ?
          <div className={s.settings_background} onClick={() => { setShowWindow(false) }}>
            <div className={s.settings} onClick={e => e.stopPropagation()}>
              <div className={s.settings__top}>
                <div className={s.settings__title}>
                  Your Privacy
                </div>
                <div className={s.settings__text}>
                  The site uses tracking technologies. You may opt in or opt out of the use of these technologies.
                </div>
                <ul className={s.settings__list}>
                  <li className={s.settings__item}>
                    <div className={s.settings__item_text}>Куки</div>
                    <div
                      className={s.settings__item_toggle}
                      style={cookies ? { backgroundColor: "#1ac221" } : { backgroundColor: "#3C3C3C" }}
                      onClick={() => { setCookies(!cookies); setCookie("_cookies_consent", `${!cookies}`); }}
                    >
                      <div
                        className={s.settings__item_toggle_ball}
                        style={cookies ? { left: 20 } : { left: "0" }}
                      ></div>
                    </div>
                  </li>
                  <li className={s.settings__item}>
                    <div className={s.settings__item_text}>Обязательные Куки</div>
                    <div
                      className={`${s.settings__item_toggle} ${s.blocked}`}
                    >
                      <div
                        className={s.settings__item_toggle_ball}
                      ></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          : <></>
      }
    </>
  );
};

export default Settings;