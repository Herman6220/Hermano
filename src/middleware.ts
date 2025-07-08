import { NextRequest, NextResponse } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest){
    const token = await getToken({req: request})
    const url = request.nextUrl

    if(
        url.pathname.startsWith('cart') ||
        url.pathname.startsWith('profile') ||
        url.pathname.startsWith('orders') ||
        url.pathname === '/' ||
        url.pathname.startsWith('/professionals')
    ){
        return NextResponse.next()
    }
    if(token && token.activeRole === "CUSTOMER"
        && (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up')
        )
    ){
        return NextResponse.redirect(new URL('/', request.url))
    }
    if(token && token.activeRole === "PROFESSIONAL"
        && (
            url.pathname.startsWith('/professional/sign-in') ||
            url.pathname.startsWith('/professional/sign-up')
        )
    ){
        return NextResponse.redirect(new URL('/professional', request.url))
    }
    if((!token || token.activeRole !== "CUSTOMER") && (
        url.pathname.startsWith('/checkout')
    ) ){
        return NextResponse.redirect(new URL('/unauthorized'))
    }
    if((!token || token.activeRole !== "PROFESSIONAL") && (
        url.pathname.startsWith('/professionals/')
    )){
        return NextResponse.redirect(new URL('/unauthorized'))
    }
}

export const config = {
  matcher: [
    '/:path*'
  ]
}