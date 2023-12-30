import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/verify')) {
    return NextResponse.rewrite(new URL('/validate', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/signup?token=')) {
    return NextResponse.rewrite(new URL('/signup', req.url))
  }

  if(req.nextUrl.pathname.startsWith('/login') && req.nextUrl.searchParams.has('email') === true && req.nextUrl.searchParams.has('error') === true){
    return NextResponse.rewrite(new URL('/login-error', req.url))
  }

  return NextResponse.next();
}