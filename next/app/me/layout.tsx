import { ReactNode } from 'react';
import { Nav } from '@/components/Nav'
import { getPlayer } from '@/preset/Player';
import { redirect } from 'next/navigation'
import cookie from '@/context/Cookie';
import { PlayerProvider } from '@/context/Player';

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	console.log(cookie.get('token'))
	if (!cookie.get('token')) {
		redirect('/login');
	}

	const player = await getPlayer();

	return (
		<PlayerProvider prefetchedPlayer={player}>
			<Nav />
			{children}
		</PlayerProvider>
	);
};