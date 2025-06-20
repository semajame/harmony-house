import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    console.log('TOKEN:', token)
    console.log('PATH:', pathname)

    // 🚫 If logged in as admin or staff, block access to "/" and redirect to /admin/dashboard
    if (
      (token?.role === 'admin' || token?.role === 'staff') &&
      pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // 🚫 Customers should not access admin dashboard
    if (token?.role === 'customer' && pathname.startsWith('/admin/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // 🚫 Staff should not access /admin/dashboard/users
    if (
      token?.role === 'staff' &&
      pathname.startsWith('/admin/dashboard/users')
    ) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/signin', // Redirect unauthenticated users trying to access protected pages
    },
  }
)

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/users/:path*'],
}
