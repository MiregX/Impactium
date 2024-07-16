import { Children } from "@/dto/Children";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: Children) {
  const cookie = cookies();

  const token = cookie.get('Authorization')?.value

  const isAdmin = token ? await api<boolean>('/user/is-admin', {
    headers: {
      token
    }
  }) : false;

  if (!isAdmin) {
    redirect('/');
  }

  return (<>{children}</>);
}