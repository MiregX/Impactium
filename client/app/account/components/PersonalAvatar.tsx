'use client'
import { useLanguage } from "@/context/Language.context";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { UserRequiredContext, useUser } from "@/context/User.context";
import { Avatar } from "@/ui/Avatar";

export function PersonalAvatar() {
  const { lang } = useLanguage();
  const { user } = useUser<UserRequiredContext>();

  return (
    <Card className={s.account} id='avatar' description={lang.account.avatar_description}>
      <h6>{lang.account.avatar}</h6>
      <p>{lang.account.avatar_content}</p>
      <Avatar
        size={78}
        src={user.avatar}
        alt={user.displayName}
        className={s.avatar} />
    </Card>
  );
}