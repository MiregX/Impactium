import { ReactNode } from 'react';
import { getPlayer } from '@/preset/Player';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';
import { Overlay } from '@/components/me/Overlay';

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const token = cookies().get('token');

	console.log(token);

	if (!token) {
		redirect('/login');
	}

	const player = await getPlayer(token.value);

	console.log(player);

	if (!player) {
		redirect(token ? '/' : '/login');
	}

	return (
		<PlayerProvider prefetchedPlayer={player}>
			{children}
		</PlayerProvider>
	);
};