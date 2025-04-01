'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Badge, BadgeType } from "@/ui/Badge";

export function Email() {
  const { lang } = Language.use();
  const { user } = useUser<UserRequiredContext>();

  return (
    <Card className={s.account} id='email' description={lang.account.email_description}>
      <h6>{lang.account.email}</h6>
      <p>{lang.account.email_content}</p>
      <section>
        {user.email
          ? <>{user.email}<Badge type={BadgeType.verified} /><Badge type={BadgeType.primary}/></>
          : <p>{lang.account.no_email}</p>}
      </section>
    </Card>
  );
}