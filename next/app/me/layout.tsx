import { ReactNode } from 'react';
import { Nav } from '@/components/Nav'
import s from '@/styles/Me.module.css'
import cookie from '@/context/Cookie';
import { useUser } from '@/context/User';
import { useRouter } from 'next/navigation'

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
	const { user, token } = useUser();
	if (!token || !user) {
		router.push('/login');
	}
	const player = fetch('https://impactium.fun/api/player/get', {
		method: 'GET',
		headers: {
			'token': cookie.get('token')
		}
	}).then((data) => { return data.json() })

	return (
		<div className={s.me}>
			<Nav />
			{children}
		</div>
	);
};