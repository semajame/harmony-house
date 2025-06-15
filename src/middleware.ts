import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    console.log('TOKEN:', token)
    console.log('PATH:', pathname)

    // Redirect admin users away from the root path
    if (token?.role === 'admin' && pathname === '/') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Redirect customer users away from the admin dashboard
    if (token?.role === 'customer' && pathname.startsWith('/admin/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (
      token?.role === 'staff' &&
      pathname.startsWith('/admin/dashboard/users')
    ) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url)) // Or redirect wherever you like
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
  matcher: ['/admin/dashboard/:path*', '/admin/users/:path*'],
}
