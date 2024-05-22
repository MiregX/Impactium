'use client'
import { Input } from '@/ui/Input'
import s from './Comments.module.css'
import { GeistButton, GeistButtonTypes } from '@/ui/Button'
import { _server } from '@/dto/master'
import { useUser } from '@/context/User'
import { useLanguage } from '@/context/Language'


export function LeaveComment() {
  const { user } = useUser();
  const { lang } = useLanguage();
  
  const send = async () => {
    const response = await fetch(`${_server()}/api/comment/send`, {
      method: 'POST',
      credentials: 'include'
    }).then(async response => {
      return await response.json();
    }).catch(_ => {
      // handleError();
    })
  }

  return (
    <div className={s.leave}>
      <img src={user.login.avatar}  />
      <Input options={{
        placeholder: lang.comments.leave,
        style: [s.input]
      }}/>
      <GeistButton options={{
        type: GeistButtonTypes.Button,
        text: '',
        do: send,
        img: 'https://cdn.impactium.fun/ui/specific/paper-plane.svg',
        focused: true,
        style: [s.button]
      }} />
    </div>
  )
}