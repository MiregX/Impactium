import { ReactNode } from 'react';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';
import { getPlayer } from '@/context/Player';
import { getServerLink } from '@/dto/master';
import { error } from 'console';
export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const authorization = cookies().get('Authorization');

	if (!authorization) {
		return redirect('/');
	}
	
	const player = await fetch(`${getServerLink()}/api/player/get`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			authorization: authorization.value
		}
	})
	.then(async (res) => {
		return await res.json();
	})
	.catch(error => {
		redirect('/')
	});
	
	console.log(player);
	return (
		<PlayerProvider>
			{children}
		</PlayerProvider>
	);
};