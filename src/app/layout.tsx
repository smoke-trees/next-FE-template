"use server"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { getAuthToken } from "@/dataFetching/loginHandeler"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const unAuthenticatedRoutes = ["/login", "/test", "/_not-found"]

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || "/"
  let token:
    | {
        token: string
        refreshToken: string
      }
    | undefined
    | null
  const shouldCheckAuth = unAuthenticatedRoutes.filter((e) => pathname.includes(e)).length === 0
  console.log(pathname, shouldCheckAuth)
  if (shouldCheckAuth) {
    token = await getAuthToken()
    if (!token) {
      return redirect("/login", RedirectType.replace)
    }
  }

  console.log(token)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  )
}
