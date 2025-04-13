import { useEffect, useMemo } from 'react';
import s from '../Login.module.css';

export function TelegramWidget() {
  const bot = useMemo(() => process.env.NODE_ENV === 'production' ? 'impactium_bot' : 'manyshield_bot', []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', bot);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '6');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-auth-url', 'http://localhost/api/oauth2/telegram/callback');
    document.getElementById('telegram-widget')!.appendChild(script);
  }, []);

  return <div className={s.telegramWidget} id='telegram-widget' />;
};
