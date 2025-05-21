import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/signin', // Redirect unauthenticated users to signin page
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to dashboard and its subroutes
}
