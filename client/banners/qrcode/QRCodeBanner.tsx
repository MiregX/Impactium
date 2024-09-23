import { QRCode } from "@/dto/QRCode.dto";
import { Banner } from "@/ui/Banner";
import { Button } from "@/ui/Button";
import { Separator } from "@/ui/Separator";
import Image from "next/image";

interface QRCodeBannerProps {
  QRCode: QRCode
}

export async function QRCodeBanner({ QRCode }: QRCodeBannerProps) {
  return (
    <Banner title='Поделись QR-кодом с тем, кого хочешь пригласить'>
      {/* <Image src={QRCode.image} alt='' height={256} width={256} /> */}
      <Separator><i>ИЛИ</i></Separator>
      <Button img='Share'>{QRCode.url}</Button>
    </Banner>
  )
}