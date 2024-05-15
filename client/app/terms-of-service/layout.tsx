import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Terms'
}

export default function TermsLayout({ children }: Readonly<{ children: ReactNode }>) {
	return children;
};