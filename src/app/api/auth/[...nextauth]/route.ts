import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import bcrypt from 'bcryptjs'
import { getDatabaseConnection } from '../../../lib/data-source'
import { Staff } from '../../../lib/entities/staff'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Ensure credentials are not undefined
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password are required')
        }

        const db = await getDatabaseConnection()
        const userRepo = db.getRepository(Staff)

        const user = await userRepo.findOne({
          where: { username: credentials.username },
        })
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error('Invalid username or password')
        }

        return {
          id: user.id.toString(),
          username: user.username,
          role: user.role
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as 'jwt' }, // Explicitly setting type
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username // ✅ This is missing!
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
           role: token.role as string,
        },
        token,
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
