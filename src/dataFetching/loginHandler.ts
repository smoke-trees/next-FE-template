'use server'

import { cookies } from 'next/headers'
import { API_URL } from './api.config'

function handleLogin(username: string, password: string) {
	return fetch(`${API_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	}).then((res) => res.json())
}

export async function handleRefreshToken(refreshToken: string) {
	return fetch(`${API_URL}/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			refreshToken
		})
	}).then((res) => res.json())
}

async function setTokensAsCookie(token: string, refreshToken: string) {
	const nextCookies = await cookies()
	const decodedToken = JSON.parse(
		Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
	)
	const expiryDate = new Date(decodedToken.exp * 1000)
	const refreshDecodedToken = JSON.parse(
		Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf-8')
	)
	const refreshExpiryDate = new Date(refreshDecodedToken.exp * 1000)
	nextCookies.set('authToken', token, {
		path: '/',
		httpOnly: true,
		maxAge: expiryDate.getTime() - Date.now()
	})
	nextCookies.set('refreshToken', refreshToken, {
		path: '/',
		httpOnly: true,
		maxAge: refreshExpiryDate.getTime() - Date.now()
	})
	nextCookies.set('tokenExpiryDate', expiryDate.toISOString(), {
		path: '/',
		httpOnly: true,
		maxAge: expiryDate.getTime() - Date.now()
	})
	return
}

export async function login(username: string, password: string) {
	const loginRes = await handleLogin(username, password)
	if (
		loginRes.status.error ||
		!loginRes.result.accessToken ||
		!loginRes.result.refreshToken
	) {
		return { error: true, message: loginRes.message }
	}
	await setTokensAsCookie(
		loginRes.result.accessToken,
		loginRes.result.refreshToken
	)
	return {
		token: loginRes.result.accessToken,
		refreshToken: loginRes.result.refreshToken,
		error: false
	}
}

export async function getAuthToken() {
	const nextCookies = await cookies()
	const tokenCookie = nextCookies.get('authToken')
	const expiryDateCookie = nextCookies.get('tokenExpiryDate')
	const refreshTokenCookie = nextCookies.get('refreshToken')
	return {
		token: tokenCookie?.value,
		refreshToken: refreshTokenCookie?.value,
		expiry: expiryDateCookie?.value
	}
}
