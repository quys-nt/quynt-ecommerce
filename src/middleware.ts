import { NextRequest, NextResponse } from "next/server";
const isLoggedIn: boolean = true;

export function middleware(request: NextRequest) {
  if (isLoggedIn) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
