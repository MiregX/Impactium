'use client'
import { ExternalToast, Toaster as Sonner, toast as _toast } from 'sonner';
import s from './styles/Toaster.module.css';
import Cookies from 'universal-cookie';
import locale, { Template } from '@/public/locale';
import { success } from '@/public/success';

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className={s.toaster}
      toastOptions={{
        classNames: {
          toast: s.toast,
          description: s.description,
          actionButton: s.actionButton,
          cancelButton: s.cancelButton,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

export function useToast(key: string, data: ExternalToast = {}, onSuccess?: string | boolean) {
  const l: keyof Template = new Cookies().get('_language') || 'us'
  const error = locale.error as any

  const phrase = typeof onSuccess === 'string' && !key
    ? (success[onSuccess]?.[l] || null)
    : typeof error[key]?.[l] === 'string'
      ? error[key]?.[l]
      : (data.description = error[key]?.description?.[l] || error.not_inplemented_description[l],
        error[key]?.title?.[l]);
  
  phrase ? _toast(phrase, data) : console.error(`Key '${onSuccess}' for toast not found`);
}
