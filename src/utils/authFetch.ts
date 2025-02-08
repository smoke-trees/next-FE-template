import { getAuthToken } from '@/dataFetching/loginHandler'

export async function authFetch(url: string, options: RequestInit) {
	const authToken = await getAuthToken()
	if (authToken.token) {
		options.headers = {
			...options.headers,
			Authorization: authToken.token
		}
	}
	return fetch(url, options)
}
