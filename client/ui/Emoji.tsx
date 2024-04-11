import { DetailedHTMLProps, ImgHTMLAttributes } from "react"

export function Emoji({ type, ...props}: { type: string,  props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>}) {
  const links: Record<string, string> = {
    present: '',
  }

  const link = links[type]
  if (!link) {
    throw new Error(`Emoji type _${type}_ is not in the _links_ object. `)
  }
  return  (
    <img src={link} {...props} />
  )
}