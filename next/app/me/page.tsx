import { useRouter } from 'next/navigation'
 
export default async function Page() {
  const router = useRouter()
  router.push('/me/account');
  return null;
}