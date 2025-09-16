import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token
    const pathname = req.nextUrl.pathname

    console.log("TOKEN:", token)
    console.log("PATH:", pathname)

    // 🚫 Admin/staff trying to access root ("/")
    if (
      (token?.role === "admin" || token?.role === "staff") &&
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // 🚫 Customer trying to access admin pages
    if (token?.role === "customer" && pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // 🚫 Staff trying to access admin user management (staff can't access `/admin/users`)
    if (
      token?.role === "staff" &&
      pathname.startsWith("/admin/dashboard/users")
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    // 🚫 Staff trying to access the admin dashboard itself (staff can't access `/admin/dashboard`)
    if (token?.role === "staff" && pathname === "/admin/dashboard") {
      return NextResponse.redirect(
        new URL("/admin/dashboard/reservation", req.url)
      ) // Redirect staff to a non-admin page (you can change "/home" as needed)
    }

    // 🚫 Admin trying to access the user dashboard
    if (token?.role === "admin" && pathname === "/dashboard") {
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
    "/admin/dashboard/:path*",
    "/admin/users/:path*",
    "/dashboard/:path*", // 👈 this protects /dashboard and all children like /dashboard/settings etc.
  ],
}
