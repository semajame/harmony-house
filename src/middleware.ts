import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    console.log('Middleware triggered for:', req.nextUrl.pathname)

    const token = req.nextauth?.token
    console.log('Token:', token)

    if (token?.role === 'costumer') {
      console.log('Redirecting costumer away from dashboard')
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
  matcher: ['/admin/dashboard/:path*'],
}
