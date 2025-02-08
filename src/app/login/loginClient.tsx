'use client'

import { login } from '@/dataFetching/loginHandler'
import { redirect, useSearchParams } from 'next/navigation'

export default function LoginClient() {
	const searchParams = useSearchParams()
	const next = searchParams.get('next')?.toString() || '/'
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const username = formData.get('username')?.toString() || ''
		const password = formData.get('password')?.toString() || ''
		const tokens = await login(username, password)
		if (!tokens.error) {
			redirect(next)
		} else {
			alert(tokens.message || 'Invalid username or password')
		}
		return
	}
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<input type='text' name='username' placeholder='Username' />
				<input type='password' name='password' placeholder='Password' />
				<button type='submit'>Login</button>
			</form>
		</div>
	)
}
