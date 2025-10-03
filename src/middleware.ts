import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    console.log("TOKEN:", token)
    console.log("PATH:", pathname)

    // 🚫 Block /admin root for everyone
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // 🚫 Customer trying to access any admin pages
    if (token?.role === "customer" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // 🚫 Staff trying to access restricted admin pages
    if (
      token?.role === "staff" &&
      (pathname.startsWith("/admin/users") || pathname === "/admin/dashboard")
    ) {
      return NextResponse.redirect(
        new URL("/admin/dashboard/reservation", req.url)
      )
    }

    // 🚫 Admin trying to access customer dashboard
    if (token?.role === "admin" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // 🚫 Admin/staff trying to access root "/"
    if (
      (token?.role === "admin" || token?.role === "staff") &&
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*", // match all admin subpaths
    "/dashboard/:path*", // customer dashboard
    "/", // root
  ],
}
