"use client"

import { login } from "@/dataFetching/loginHandeler"
import { redirect } from "next/navigation"

export default function LoginClient() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")?.toString() || ""
    const password = formData.get("password")?.toString() || ""
    const tokens = await login(username, password)
    if (tokens) {
      redirect("/")
    } else {
      alert("Invalid username or password")
    }
    return
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
