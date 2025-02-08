import { NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "./dataFetching/loginHandeler"

export async function middleware(request: NextRequest) {
  console.log("In middleware")
  await getAuthToken()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
