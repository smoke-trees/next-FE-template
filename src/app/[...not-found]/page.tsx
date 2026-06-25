import Link from 'next/link'

export default function Custom404() {
	return (
		<div className='flex h-dvh flex-col items-center justify-center bg-gray-50 text-center'>
			<h1 className='animate-bounce text-6xl font-bold text-red-500'>404</h1>
			<p className='mt-4 text-2xl text-gray-700 opacity-0 animate-[fadeIn_2s_ease-in-out_0.5s_forwards]'>
				Oops! The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<Link
				href='/'
				prefetch={true}
				className='mt-5 rounded bg-blue-500 px-5 py-2 text-xl text-white no-underline transition-colors hover:bg-blue-600'
			>
				Go Home
			</Link>
		</div>
	)
}
