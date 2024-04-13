import { ReactNode } from 'react';
import { getPlayer } from '@/dto/Player';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';
import { getServerLink } from '@/dto/master';

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const cookie = cookies();
	console.log(cookie.getAll());
	console.log(getServerLink());
	
	const player = await getPlayer();
	const response = await fetch(`${getServerLink()}/api/player/get`, {
		method: 'GET',
		credentials: 'include',
	});

	console.log(response);

	if (!player) {
		redirect('/login')
	}

	return (
		<PlayerProvider prefetchedPlayer={player}>
			{children}
		</PlayerProvider>
	);
};