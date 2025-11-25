import { getAuthToken } from '@/dataFetching/loginHandler'

export async function authFetch(url: string, options?: RequestInit) {
	if (!options) options = {}
	const authToken = await getAuthToken()
	if (authToken.token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${authToken.token}`
		}
	}
	return fetch(url, options)
}
