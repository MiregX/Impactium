import { redirect } from 'next/navigation'
 
export default async function Page() {
  redirect('/me/account');
}