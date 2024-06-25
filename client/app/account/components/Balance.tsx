'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User";
import { Button, ButtonTypes } from "@/ui/Button";
import { _server } from "@/decorator/api";

export function Balance() {
  const { lang } = useLanguage();
  const { user } = useUser();

  const button = <Button options={{
    type: ButtonTypes.Link,
    focused: true,
    do: `${_server()}/api/payment/top-up`,
    text: lang.balance.top_up,
    img: 'https://cdn.impactium.fun/ui/action/add-plus.svg'
  }}/>

  return (
    <Card
      className={[s.account, s.balance]}
      id='displayName'
      description={{ text: lang.account.balance_description, button }}>
      <div className={s.stack}>
        <h6>{lang.account.balance}</h6>
        <p>{lang.account.balance_content}</p>
      </div>
      <div className={s.balance_amount}>{user.balance || 0} $</div>
    </Card>
  );
}
