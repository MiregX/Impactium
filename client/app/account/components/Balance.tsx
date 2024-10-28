'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Button } from "@/ui/Button";
import { _server } from "@/decorator/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Balance() {
  const { lang } = useLanguage();
  const { user } = useUser<UserRequiredContext>();

  const button = <Button variant='default' onClick={() => toast(lang.error.Forbidden, {
    description: lang.error.not_inplemented_description
  })}>{lang.balance.top_up}</Button>

  return (
    <Card
      className={cn(s.account, s.balance)}
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
