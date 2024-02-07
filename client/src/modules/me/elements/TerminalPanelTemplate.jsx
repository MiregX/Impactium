import React, { useState, useEffect } from 'react';
import './TerminalPanelTemplate.css'
import { useLanguage } from '../../language/Lang';

const TerminalPanelTemplate = ({ index }) => {
  const terminalPanelTemplateMap = [
    {
      title: "lastSkinFetch",
      timestamp: 1705622952306,
      icon: '',
      action: "someAction()"
    },
    {
      title: "lastStatFetch",
      timestamp: 1707330163379,
      icon: "https://cdn.impactium.fun/ux/chart-simple-white.svg",
      action: "someAction()"
    },
    {
      title: "mcsWsConnection",
      status: 1707196751,
      icon: "https://cdn.impactium.fun/ux/microchip-white.svg",
      action: "someAction()"
    },
    {
      title: "verifyUser",
      inputs: ['nickname'],
      icon: "https://cdn.impactium.fun/ux/verified.svg",
      action: "someAction()"
    },
    {
      title: "changeUserBalance",
      inputs: ['nickname', 'balance'],
      icon: "",
      action: "someAction()"
    }
  ]
  const { lang } = useLanguage();
  const [selfObject, setSelfObject] = useState(terminalPanelTemplateMap[parseInt(index)]);
  
  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const difference = now - timestamp;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    if (hours > 0) {
      const hoursLabel =
        hours === 1
          ? lang.hour
          : hours > 1 && hours < 5
          ? lang.hours_2_4
          : lang.hours_5;
  
      const minutesLabel =
        minutes % 60 === 1
          ? lang.minutes_1
          : (minutes % 60 > 1 && minutes % 60 < 5) || (minutes > 20 && minutes < 25)
          ? lang.minutes_2_4
          : lang.minutes_5;
  
      return `${hours} ${hoursLabel} ${minutes % 60} ${minutesLabel} ${lang.ago}`;
    } else if (minutes > 0) {
      const minutesLabel =
        minutes === 1
          ? lang.minute
          : (minutes > 1 && minutes < 5) || (minutes > 20 && minutes < 25)
          ? lang.minutes_2_4
          : lang.minutes_5;
  
      return `${minutes} ${minutesLabel} ${lang.ago}`;
    } else {
      return `${lang.right_now}`;
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Уменьшаем временную метку на 1000 миллисекунд (1 секунда)
      setSelfObject((prevObject) => ({
        ...prevObject,
        timestamp: prevObject.timestamp - 60000,
      }));
    }, 60000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [setSelfObject]);

  return (
    <div className='terminalPanel'>
      <img src={selfObject.icon} alt="Icon" />
      <div>
        <h6>{lang[selfObject.title]}</h6>
        <div className='bottomLine'>
          {selfObject.timestamp ? (
            <>
              <p>{formatTimeAgo(selfObject.timestamp)}</p>
              <button>
                <img src='https://cdn.impactium.fun/svg/refresh.svg' alt="Arrow" />
              </button>
            </>
          ) : selfObject.inputs ? (
            <>
              {selfObject.inputs.map((input, index) => (
                <input
                  key={index}
                  type="text"
                  id={`${input}Field`}
                  placeholder={lang['_' + input]}
                  autoComplete="new-password"
                />
              ))}
              <button>
                <img src='https://cdn.impactium.fun/ux/right-arrow-white.svg' alt="Arrow" />
              </button>
            </>
          ) : (
            <>
              <p>{lang.serverStatus[selfObject.status]}</p>
              <button>
                <img src='https://cdn.impactium.fun/svg/refresh.svg' alt="Arrow" />
              </button>
            </>
            )
          }
        </div>
      </div>
    </div>
  );  
};

export default TerminalPanelTemplate;