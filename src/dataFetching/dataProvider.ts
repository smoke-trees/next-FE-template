import { authFetch } from '@/utils/authFetch'
import { API_URL } from './api.config'

export type Result<T> = {
	status: {
		error: boolean
		code: string
	}
	message: string
	result: T
	count?: number
}

type baseQueryFilters =
	| string
	| number
	| boolean
	| (string | number | boolean)[]

type QueryParams = Record<string, baseQueryFilters>

function buildUrl(
	resource: string,
	queryParams?: QueryParams,
	identifier?: string
): string {
	let url = `${API_URL}/${resource}`
	if (identifier) url += `/${identifier}`

	if (!queryParams) return url

	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(queryParams)) {
		if (Array.isArray(value)) {
			for (const v of value) params.append(key, String(v))
		} else {
			params.append(key, String(value))
		}
	}

	const qs = params.toString()
	if (!qs) return url

	return url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`
}

function buildLikeFilter(
	like: Record<string, string | undefined> | undefined,
	params: URLSearchParams
): void {
	if (!like) return

	for (const [key, value] of Object.entries(like)) {
		const v = value ?? ''
		params.append(`like[${key}]`, v.includes('%') ? v : `%${v}%`)
	}
}

function buildFilterUrl(
	resource: string,
	queryParams: Record<string, unknown> | undefined,
	identifier?: string
): string {
	let url = `${API_URL}/${resource}`
	if (identifier) url += `/${identifier}`

	if (!queryParams) return url

	const params = new URLSearchParams()
	const like = queryParams.like as Record<string, string | undefined> | undefined
	buildLikeFilter(like, params)

	for (const [key, value] of Object.entries(queryParams)) {
		if (key === 'like') continue
		if (Array.isArray(value)) {
			for (const v of value) params.append(key, String(v))
		} else {
			params.append(key, String(value))
		}
	}

	const qs = params.toString()
	if (!qs) return url

	return url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`
}

async function handleResponse<T>(response: Response): Promise<T> {
	return response.json()
}

export type filter<T, K extends object> =
	T extends object ?
		{
			like?: Partial<Record<keyof T, string>>
		} & Partial<Record<keyof T | keyof K, baseQueryFilters>>
	:	{
			like?: Record<string, string>
		} & Record<string, baseQueryFilters>

export type listFilter<T extends object, K extends object> = (
	| {
			like?: Partial<Record<keyof T, string>>
			orderBy?: keyof T
			order?: 'ASC' | 'DESC'
			nonPaginated: true
			toCreatedDate?: string
			fromCreatedDate?: string
	  }
	| {
			like?: Partial<Record<keyof T, string>>
			orderBy?: keyof T
			order?: 'ASC' | 'DESC'
			count?: number
			page?: number
			nonPaginated?: false | undefined
			toCreatedDate?: string
			fromCreatedDate?: string
	  }
) &
	Partial<Record<keyof T | keyof K, baseQueryFilters>>

export const dataProvider = {
	create: async <TEntity extends object, TResult = string | number>(
		resource: string,
		body: TEntity,
		queryParams?: QueryParams
	) => {
		return authFetch(buildUrl(resource, queryParams), {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then((res) => res.json())
			.then((data) => data as Result<TResult>)
	},

	post: async <TResult>(
		resource: string,
		body?: Record<string, unknown>,
		queryParams?: QueryParams
	) => {
		return authFetch(buildUrl(resource, queryParams), {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then((res) => res.json())
			.then((data) => data as Result<TResult>)
	},

	get: async <K extends object, TResult = Result<K>>(
		resource: string,
		identifier?: string,
		queryParams?: filter<TResult, K>
	) => {
		return authFetch(
			buildFilterUrl(resource, queryParams, identifier)
		)
			.then(handleResponse<TResult>)
	},

	getList: async <K extends object, TResult extends object = K>(
		resource: string,
		queryParams?: listFilter<TResult, K>
	) => {
		return authFetch(buildFilterUrl(resource, queryParams))
			.then((res) => res.json())
			.then((data) => data as Result<TResult[]>)
	},

	update: async <TEntity extends object, TResult extends object = Record<string, never>>(
		resource: string,
		identifier: string,
		body: Partial<TEntity>,
		queryParams?: QueryParams
	) => {
		return authFetch(buildUrl(`${resource}/${identifier}`, queryParams), {
			method: 'PUT',
			body: JSON.stringify(body)
		})
			.then((res) => res.json())
			.then((data) => data as Result<TResult>)
	},

	delete: async <TResult>(
		resource: string,
		identifier: string,
		queryParams?: QueryParams
	) => {
		return authFetch(buildUrl(`${resource}/${identifier}`, queryParams), {
			method: 'DELETE'
		})
			.then((res) => res.json())
			.then((data) => data as Result<TResult>)
	}
}
