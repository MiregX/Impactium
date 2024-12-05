'use client'
import { Input } from '@/ui/Input'
import s from './styles/Comments.module.css'
import { Button } from '@impactium/components'
import { useUser } from '@/context/User.context'
import { useLanguage } from '@/context/Language.context'
import { Avatar } from '../ui/Avatar'


export function LeaveComment() {
  const { user } = useUser();
  const { lang } = useLanguage();
  
  const send = async () => {
    await api('/comment/send', {
      method: 'POST',
      credentials: 'include'
    });
  }

  return (
    <div className={s.leave}>
      <Avatar size={32} src={user?.avatar || user?.login?.avatar || ''} alt={user?.displayName || ''} />
      <Input
        placeholder={lang.comments.leave}
        className={s.input} />
      <Button
        img='SendHorizontal'
        onClick={send}
        size='icon' />
    </div>
  );
};
