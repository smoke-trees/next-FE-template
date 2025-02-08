import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"
import { handleRefreshToken } from "./dataFetching/loginHandler"
import { unAuthenticatedRoutes } from "./utils/nonAuthRoutes"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (request.method === "GET") {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-pathname", pathname)
    const shouldSkipAuth = unAuthenticatedRoutes.filter((e) => pathname.startsWith(e)).length > 0
    const authToken = request.cookies.get("authToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value
    const expiryDate = request.cookies.get("tokenExpiryDate")?.value
    if (!refreshToken) {
      if (!shouldSkipAuth) {
        return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url))
      }
      return NextResponse.next()
    }
    const response = NextResponse.next({
      headers: requestHeaders,
    })
    if (!authToken || new Date(expiryDate || "").getTime() - new Date().getTime() <= 1000 * 60 * 30) {
      const refreshedTokens = await handleRefreshToken(refreshToken)
      if (refreshedTokens.status.error || !refreshedTokens.accessToken || !refreshedTokens.refreshToken) {
        return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url))
      }
      const tokenSplit = JSON.parse(Buffer.from(refreshedTokens.accessToken.split(".")[1], "base64").toString("utf-8"))
      const refreshTokenSplit = JSON.parse(Buffer.from(refreshedTokens.refreshToken.split(".")[1], "base64").toString("utf-8"))
      response.cookies.set("authToken", refreshedTokens.accessToken, {
        maxAge: tokenSplit.exp * 1000 - Date.now(),
        httpOnly: true,
      })
      response.cookies.set("tokenExpiryDate", new Date(tokenSplit.exp * 1000).toISOString(), {
        maxAge: tokenSplit.exp * 1000 - Date.now(),
        httpOnly: true,
      })
      response.cookies.set("refreshToken", refreshedTokens.refreshToken, {
        maxAge: refreshTokenSplit.exp * 1000 - Date.now(),
        httpOnly: true,
      })
    }
    return response
  }
  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.webp|logo.png).*)"],
}
