import { getAuthToken } from '@/dataFetching/loginHandler'

function isJsonBody(body: unknown): body is string {
	return typeof body === 'string' && body.startsWith('{')
}

export async function authFetch(url: string, options?: RequestInit) {
	const opts: RequestInit = { ...options }

	if (opts.body && isJsonBody(opts.body)) {
		opts.headers = {
			'Content-Type': 'application/json',
			...((opts.headers as Record<string, string>) || {})
		}
	}

	const authToken = await getAuthToken()
	if (authToken.token) {
		opts.headers = {
			...((opts.headers as Record<string, string>) || {}),
			Authorization: `Bearer ${authToken.token}`
		}
	}

	return fetch(url, opts)
}
