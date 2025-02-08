"use server"

import { Suspense } from "react"
import LoginClient from "./loginClient"

export default async function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  )
}
