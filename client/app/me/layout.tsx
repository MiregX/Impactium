import { ReactNode } from 'react';
import { getPlayer } from '@/preset/Player';
import { redirect } from 'next/navigation'
import { PlayerProvider } from '@/context/Player';
import { cookies } from 'next/headers';

export default async function MeLayout({ children }: Readonly<{ children: ReactNode }>) {
	const token = cookies().get('token');

	

	const player = await getPlayer({ token: token.value });

	return (
		<PlayerProvider prefetchedPlayer={player}>
			{children}
		</PlayerProvider>
	);
};