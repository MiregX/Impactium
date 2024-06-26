'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User";
import { Badge, BadgeType } from "@/ui/Badge";

export function Email() {
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <Card className={s.account} id='email' description={lang.account.email_description}>
      <h6>{lang.account.email}</h6>
      <p>{lang.account.email_content}</p>
      <section>
        {user!.email
          ? <>{user!.email}<Badge type={BadgeType.verified} /><Badge type={BadgeType.primary}/></>
          : <p>{lang.account.no_email}</p>}
      </section>
    </Card>
  );
}