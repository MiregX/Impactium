'use client';
import { Card } from '@/ui/Card';
import s from '../Account.module.css';
import { cn } from '@impactium/utils';
import { useLanguage } from '@/context/Language.context';
import { useUser } from '@/context/User.context';
import { UserRequiredContext } from '@/context/User.context';
import { UserCombination } from '@/components/UserCombination';
import { Badge } from '@/ui/Badge';
import { BadgeType } from '@/ui/Badge';

export function Overview() {
  const { user } = useUser<UserRequiredContext>();
  const { lang } = useLanguage();

  return (
    <Card
      className={cn(s.account, s.overview)}
      id='displayName'>
      <UserCombination size='heading' user={user} />
      <div className={s.badges}>
        {user.verified && <Badge type={BadgeType.verified} />}
        {user.register && <Badge type={BadgeType.Registered} title={lang.created_at + user.register} />}
      </div>
    </Card>
  );
}
