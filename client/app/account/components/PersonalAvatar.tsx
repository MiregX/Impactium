'use client'
import { Language } from "@/context/Language.context";
import s from '../Account.module.css'
import { User } from "@/context/User.context";
import { Avatar } from "@/ui/Avatar";
import { Card } from "@/ui/card";
import { Stack } from "@impactium/components";

export function PersonalAvatar() {
  const { lang } = Language.use();
  const { user } = User.use<User.RequiredExport>();

  return (
    <Card.Root className={s.account}  >
      <Card.Title>
        {lang.account.avatar}
      </Card.Title>
      <Card.Content>
        <Avatar
          size={78}
          src={user.avatar}
          alt={user.displayName}
          className={s.avatar} />
      </Card.Content>
      <Card.Description>
        <p>{lang.account.avatar_content}</p>
      </Card.Description>
    </Card.Root>
  );
}