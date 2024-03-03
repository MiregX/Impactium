import { ReactNode } from 'react';
import { getPlayer } from '@/preset/Player';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const token = cookies().get('token').value
	if (!token) {
		redirect('/login');
	}

	const player = await getPlayer(token);

	if (!player) {
		redirect(token ? '/' : '/login');
	}

	return (
		<PlayerProvider prefetchedPlayer={player}>
			{children}
		</PlayerProvider>
	);
};