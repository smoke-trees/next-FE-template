'use server' //! Should never change under any circumstances
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import CustomErrorBoundary from '@/component/ErrorBoundary'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})
export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<CustomErrorBoundary>{children}</CustomErrorBoundary>
			</body>
		</html>
	)
}
