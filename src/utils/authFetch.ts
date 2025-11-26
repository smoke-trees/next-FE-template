import { getAuthToken } from '@/dataFetching/loginHandler'

export async function authFetch(url: string, options?: RequestInit) {
	if (!options) options = {}
	if(options.body && typeof options.body === 'string') {
		if(options.body[0] === '{') {
			if(options.headers) {
				(options.headers as any)['Content-Type'] = 'application/json'
			} else {
				options.headers = {
					'Content-Type': 'application/json'
				}
			}
		}
	}
	const authToken = await getAuthToken()
	if (authToken.token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${authToken.token}`
		}
	}
	return fetch(url, options)
}

