import { Children } from "@/types";
import { cookiePattern, cookieSettings } from "@impactium/pattern";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from 'next/headers';

export default async function AdminLayout({ children }: Children) {
  const cookie = cookies();
  const headersList = headers();
  const token = cookie.get('Authorization')?.value

  const isAdmin = token ? await api<boolean>('/user/admin/is', {
    headers: {
      token
    }
  }) : false;

  const fullUrl = headersList.get('referer') || "";

  if (!isAdmin && fullUrl.endsWith('/admin')) {
    redirect('/');
  }

  return (<>{children}</>);
}