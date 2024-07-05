import { Children } from "@/dto/Children";
import { cookies } from "next/headers";

export default function AdminLayout({ children}: Children) {
  const cookie = cookies();

  api<boolean>('/user/is-admin')

  return ({children})
}