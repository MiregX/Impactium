'use client'
import { useLanguage } from '@/context/Language.context'
import _ from './styles/Comments.module.css'

export function NoComments() {
  const { lang } = useLanguage();
  return (
    <p className={_.empty}>{lang.comments.empty}</p>
  )
}