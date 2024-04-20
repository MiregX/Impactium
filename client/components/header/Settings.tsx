import React, { useState } from 'react';
import s from '@/styles/header/Settngs.module.css';
import Cookies from 'universal-cookie';

const Settings = () => {
  const cookie = new Cookies();
  const [cookies, setCookies] = useState(cookie.get("_cookies_consent"));
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={`${s.background} ${visible && s.visible}`} onClick={() => { setVisible(false) }}>
      <div className={s.settings} onClick={e => e.stopPropagation()}>
        <div className={s.top}>
          <div className={s.title}>
            Your Privacy
          </div>
          <div className={s.text}>
            The site uses tracking technologies. You may opt in or opt out of the use of these technologies.
          </div>
          <ul className={s.list}>
            <li className={s.item}>
              <div className={s.text}>Куки</div>
              <div
                className={s.toggle}
                style={cookies ? { backgroundColor: "#1ac221" } : { backgroundColor: "#3C3C3C" }}
                onClick={() => { setCookies(!cookies); cookie.set("_cookies_consent", !cookies); }}
              >
                <div
                  className={s.toggle_ball}
                  style={cookies ? { left: 20 } : { left: "0" }}
                ></div>
              </div>
            </li>
            <li className={s.item}>
              <div className={s.text}>Обязательные Куки</div>
              <div
                className={`${s.toggle} ${s.blocked}`}
              >
                <div
                  className={s.toggle_ball}
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;