import React, { useState, useEffect } from 'react';
import './TerminalPanelTemplate.css'
import { useLanguage } from '../../language/Lang';

const TerminalPanelTemplate = ({ index }) => {
  const terminalPanelTemplateMap = [
    {
      title: "lastSkinFetch",
      timestamp: 1707196751,
      image: "",
      action: "someAction()"
    },
    {
      title: "lastStatFetch",
      timestamp: 1707176723,
      image: "",
      action: "someAction()"
    },
    {
      title: "referalsAmount",
      timestamp: 1707176723,
      image: ""
    },
    {
      title: "mcsWsConnection",
      timestamp: 1707176723,
      image: "",
      action: "someAction()"
    },
    {
      title: "verifyUser",
      timestamp: 1707176723,
      image: "",
      action: "someAction()",
      inputsAmount: 1
    },
    {
      title: "changeUserBalance",
      timestamp: 1707176723,
      image: "",
      action: "someAction()",
      inputsAmount: 2
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
      return `${lang.now} ${lang.ago}`;
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Уменьшаем временную метку на 1000 миллисекунд (1 секунда)
      setSelfObject((prevObject) => ({
        ...prevObject,
        timestamp: prevObject.timestamp - 1000,
      }));
    }, 1000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [setSelfObject]);

  console.log(selfObject.timestamp);
  return (
    <div className='terminalPanel'>
      <img src='https://www.svgrepo.com/show/10099/t-shirt.svg' />
      <div>
        <h6>{lang[selfObject.title]}</h6>
        <div className='bottomLine'>
          <p>{formatTimeAgo(selfObject.timestamp)}</p>
          <button>
            <img src='https://cdn.impactium.fun/ux/right-arrow-white.svg'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalPanelTemplate;