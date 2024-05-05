import { ReactNode } from 'react';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';
import { _server } from '@/dto/master';
export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const authorization = cookies().get('Authorization');

	if (!authorization) {
		return redirect('/');
	}
	
	const player = await fetch(`${_server()}/api/player/get`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			authorization: authorization.value
		}
	})
	.then(async (res) => {
		if (!res.ok) throw new Error();
		return await res.json();
	})
	.catch(_ => {
		redirect('/')
	});

	return (
		<PlayerProvider prefetched={player}>
			{children}
		</PlayerProvider>
	);
};