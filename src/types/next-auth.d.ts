// types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      name: string
      email: string
      role: string
      phone?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    username: string
    name: string
    email: string
    role: string
    phone?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    name: string
    email: string
    role: string
    phone?: string
  }
}
