'use client'
import { Language } from '@/context/Language.context'
import s from './styles/Footer.module.css'
import Link from 'next/link'
import { Button, Stack } from '@impactium/components';
import { Icon } from '@impactium/icons';
import { Color } from '@impactium/design';

export function Footer() {
  const { lang } = Language.use();

  const Operational = () => 
    <Stack className={s.operational}>
      <Icon name='LogoImpactium' size={32} color={Color.toVar('text-dimmed')} />
      <p>© {new Date(Date.now()).getFullYear()}</p>
      <Button asChild style={{ color: Color.toVar('blue-800') }} variant='ghost'>
        <Link href='/status'>
          <Icon name='Status' />
          {lang.status.ok}
        </Link>
      </Button>
      
    </Stack>;

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
      <Stack jc='space-between' style={{ flexWrap: 'wrap' }}>
        <Button asChild variant='ghost'>
          <Link href='/teams'>{lang.footer.teams}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/tournaments'>{lang.footer.tournaments}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/documentation'>{lang.footer.documentation}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/services'>{lang.footer.services}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/developers'>{lang.footer.developers}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/privacy-policy'>{lang.footer.privacy}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/terms-of-service'>{lang.footer.terms}</Link>
        </Button>
        <Button asChild variant='ghost'>
          <Link href='/changelog'>{lang.footer.changelog}</Link>
        </Button>
      </Stack>
    </div>;

  return (
    <footer className={s.wrapper}>
      <Stack className={s.content} dir='column' ai='stretch'>
        <Operational />
        <Addictional />
      </Stack>
    </footer>
  )
}
