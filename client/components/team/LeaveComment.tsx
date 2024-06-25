'use client'
import { Input } from '@/ui/Input'
import s from './Comments.module.css'
import { Button, ButtonTypes } from '@/ui/Button'
import { useUser } from '@/context/User'
import { useLanguage } from '@/context/Language'


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
      <img src={user.login.avatar}  />
      <Input options={{
        placeholder: lang.comments.leave,
        style: [s.input]
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