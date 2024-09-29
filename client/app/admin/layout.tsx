import { Children } from "@/types";
import { λCookie } from "@impactium/pattern";
import { cookies } from "next/headers";
import { redirect, useSearchParams } from "next/navigation";

interface AdminLayoutProps extends Children {}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookie = cookies();
  const token = cookie.get(λCookie.Authorization)?.value

  const isAdmin = token ? await api<boolean>('/user/admin/is', {
    headers: {
      token
    }
  }) : false;

  if (!isAdmin) {
    redirect('/');
  }

  return (<>{children}</>);
}