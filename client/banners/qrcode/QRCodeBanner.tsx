import { Banner, WarnerTypes } from "@/ui/Banner";
import { Button } from "@/ui/Button";
import { Separator } from "@/ui/Separator";
import { QRCode } from '@/dto/QRCode.dto';
import QRCodeGenerator from 'react-qr-code';
import s from './QRCodeBanner.module.css';
import { λcopy } from "@/lib/utils";
import { useLanguage } from "@/context/Language.context";

interface QRCodeBannerProps {
  QRCode: QRCode
}

export function QRCodeBanner({ QRCode: QRCode }: QRCodeBannerProps) {
  const { lang } = useLanguage();

  return (
    <Banner title={lang.team.invite} className={s.banner}>
      <QRCodeGenerator
        size={256}
        value={QRCode.url}
        className={s.qrcode}
        bgColor={'#0000'}
        fgColor={'var(--meta-black)'}
        viewBox={`0 0 256 256`}
      />
      <Separator><i>{lang.or}</i></Separator>
      <Button className={s.button} img='Link' onClick={λcopy(QRCode.url)}>{lang.copyUrl}</Button>
      <Button className={s.button} variant='ghost'>{lang.team.settings}</Button>
      <span>{lang.warn_everyone_can_join}</span>
    </Banner>
  )
}