'use client'
import { useLanguage } from "@/context/Language";
import { Card } from "@/ui/Card";
import s from '../Account.module.css'
import { useUser } from "@/context/User";
import { Avatar } from "@/components/avatar/Avatar";

export function PersonalAvatar() {
  const { lang } = useLanguage();
  const { user } = useUser();

  return (
    <Card className={s.account} id='avatar' description={lang.account.avatar_description}>
      <h6>{lang.account.avatar}</h6>
      <p>{lang.account.avatar_content}</p>
      <Avatar
        size={78}
        src={user!.login.avatar}
        alt={useUsername(user!)}
        className={s.avatar} />
    </Card>
  );
}