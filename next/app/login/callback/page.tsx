import { redirect } from 'next/navigation'
import cookie from '@/context/Cookie';
import { getUser, setToken } from '@/context/User';

async function loginCallback(code: string, referal?: string | false) {
  const res = await fetch(`https://impactium.fun/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, { method: 'GET' })
  if (!res.ok) return undefined
  return res.json()
}

export default async function CallbackPage(request, response) {
  const referal = cookie.get('ref') || false;
 
  const code = request.searchParams.code || false;
  const token = request.searchParams.token || false;

  if (code) {
    const authorizationResult = await loginCallback(code, referal);
    setToken(authorizationResult.token || false);
    const user = await getUser();
  } else if (token) {
    setToken(token);
    const user = await getUser();
  }

  redirect('/');
};