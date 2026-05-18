import React from 'react'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { Navbar } from '@/shared/components/navbar'
import '@/shared/styles/globals.css'

export const metadata: Metadata = {
	title: 'Event Management System',
	description: 'Browse, create, and discover events.',
}

interface IProps {
	children: React.ReactNode;
}

const RootLayout: React.FC<IProps> = ({ children, },) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<Providers>
					<Navbar />
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	)
}

export default RootLayout
