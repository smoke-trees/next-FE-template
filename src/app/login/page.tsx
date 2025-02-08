"use server"

import { getAuthToken } from "@/dataFetching/loginHandeler"
import { Suspense } from "react"
import LoginClient from "./loginClient"

export default async function Login() {
  const isAuthenticated = await getAuthToken()
  if (isAuthenticated && isAuthenticated.token && isAuthenticated.refreshToken) {
    return <div>Logged in</div>
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  )
}
