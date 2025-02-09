'use client'
import { useLanguage } from '@/context/Language.context'
import s from './styles/Footer.module.css'
import Link from 'next/link'
import { Button } from '@impactium/components';
import { Icon } from '@impactium/icons';

export function Footer() {
  const { lang } = useLanguage();

  const Operational = () => 
    <div className={s.operational}>
      <div className={s.left}>
        <Icon name='LogoImpactium' size={32} />
        <p>© {new Date(Date.now()).getFullYear()}</p>
        <Link href='/status'>
          {lang.status.ok}
        </Link>
      </div>
      <div className={s.right} />
    </div>;

  const Addictional = () => 
    <div className={s.addictional}>
      <div className={s.socials}>
        <Button variant='ghost' size='icon' asChild>
          <Link href='https://github.com/Mireg-V'>
            <Icon variant='dimmed' name='Github' />
          </Link>
        </Button>
        <Button variant='ghost' size='icon' asChild>
          <Link href='https://t.me/impactium'>
            <Icon variant='dimmed' name='Send' />
          </Link>
        </Button>
      </div>
      <div className={s.navigation}>
        <Link href='/teams'>{lang.footer.teams}</Link>
        <Link href='/tournaments'>{lang.footer.tournaments}</Link>
        <Link href='/documentation'>{lang.footer.documentation}</Link>
        <Link href='/services'>{lang.footer.services}</Link>
        <Link href='/developers'>{lang.footer.developers}</Link>
        <Link href='/privacy-policy'>{lang.footer.privacy}</Link>
        <Link href='/terms-of-service'>{lang.footer.terms}</Link>
        <Link href='/changelog'>{lang.footer.changelog}</Link>
      </div>
    </div>;

  return (
    <footer className={s.wrapper}>
      <div className={s.content}>
        <Operational />
        <Addictional />
      </div>
    </footer>
  )
}
