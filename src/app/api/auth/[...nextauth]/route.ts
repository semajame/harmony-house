import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/user'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Ensure credentials are not undefined
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const db = await getDatabaseConnection()
        const userRepo = db.getRepository(Users)

        const user = await userRepo.findOne({
          where: { email: credentials.email },
        })
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error('Invalid email or password')
        }

        return { id: user.id.toString(), email: user.email, name: user.name }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' }, // Explicitly setting type
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
        },
        token: token, // Include token in session
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
