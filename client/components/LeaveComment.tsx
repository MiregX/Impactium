'use client'
import { Input } from '@/ui/Input'
import s from './styles/Comments.module.css'
import { Button, ButtonTypes } from '@/ui/Button'
import { useUser } from '@/context/User.context'
import { useLanguage } from '@/context/Language.context'
import { Avatar } from './Avatar'


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
      <Avatar size={32} src={user!?.login.avatar} alt={useDisplayName(user!)} />
      <Input options={{
        placeholder: lang.comments.leave,
        className: s.input
      }}/>
      <Button options={{
        type: ButtonTypes.Button,
        text: '',
        do: send,
        img: 'https://cdn.impactium.fun/ui/specific/paper-plane.svg',
        focused: true,
        className: s.button
      }} />
    </div>
  )
}