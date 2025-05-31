import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    // Redirect admin users away from the root path
    if (token?.role === 'admin' && pathname === '/') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Redirect customer users away from the admin dashboard
    if (token?.role === 'costumer' && pathname.startsWith('/admin/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: ['/', '/admin/dashboard/:path*'],
}
