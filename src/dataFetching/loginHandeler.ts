"use server"

import { cookies } from "next/headers"
import { API_URL } from "./api.config"

function handleLogin(username: string, password: string) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json() as Promise<{ token: string; refreshToken: string }>)
}

export async function handleRefreshToken(refreshToken: string) {
  return fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  }).then((res) => res.json() as Promise<{ token: string; refreshToken: string }>)
}

async function setTokensAsCookie(token: string, refreshToken: string) {
  const nextCookies = await cookies()
  console.log(token, refreshToken)
  const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"))
  const expiryDate = new Date(decodedToken.exp * 1000)
  const refreshDecodedToken = JSON.parse(Buffer.from(refreshToken.split(".")[1], "base64").toString("utf-8"))
  const refreshExpiryDate = new Date(refreshDecodedToken.exp * 1000)
  nextCookies.set("authToken", token, {
    path: "/",
    httpOnly: true,
    maxAge: expiryDate.getTime() - Date.now(),
  })
  nextCookies.set("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    maxAge: refreshExpiryDate.getTime() - Date.now(),
  })
  nextCookies.set("tokenExpiryDate", expiryDate.toISOString(), {
    path: "/",
    httpOnly: true,
    maxAge: expiryDate.getTime() - Date.now(),
  })
  return
}

export async function login(username: string, password: string) {
  const { token, refreshToken } = await handleLogin(username, password)
  if (!token || !refreshToken) {
    return null
  }
  await setTokensAsCookie(token, refreshToken)
  return { token, refreshToken }
}

export async function getAuthToken() {
  const nextCookies = await cookies()
  const tokenCookie = nextCookies.get("authToken")
  const expiryDateCookie = nextCookies.get("tokenExpiryDate")
  const refreshTokenCookie = nextCookies.get("refreshToken")
  if (!tokenCookie && !refreshTokenCookie) {
    return null
  }
  if (tokenCookie && refreshTokenCookie) {
    const expiryDate =
      expiryDateCookie?.value ||
      new Date(JSON.parse(Buffer.from(tokenCookie.value.split(".")[1], "base64").toString("utf-8")).exp * 1000)
    if (new Date(expiryDate).getTime() - new Date().getTime() < 1000 * 60 * 30) {
      const { token, refreshToken } = await handleRefreshToken(refreshTokenCookie.value)
      await setTokensAsCookie(token, refreshToken)
      return { token, refreshToken }
    } else {
      return { token: tokenCookie.value, refreshToken: refreshTokenCookie.value }
    }
  }
  return null
}
