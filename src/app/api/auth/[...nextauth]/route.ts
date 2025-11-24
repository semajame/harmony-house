import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { getDatabaseConnection } from "../../../lib/data-source";
import { User } from "../../../lib/entities/users";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure credentials are not undefined
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const db = await getDatabaseConnection();
        const userRepo = db.getRepository(User);
        const blockedUser = await userRepo.findOne({
          where: { username: credentials.username, isActive: false },
        });
        if (blockedUser) {
          throw new Error(
            "User is blocked. Please contact support for assistance."
          );
        }
        const user = await userRepo.findOne({
          where: { username: credentials.username },
        });
        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error("Invalid username or password");
        }

        return {
          id: user.id.toString(),
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as "jwt" }, // Explicitly setting type
  jwt: {
    maxAge: 60 * 60, // 1 hour in seconds
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const db = await getDatabaseConnection();
      const userRepo = db.getRepository(User);

      // When user logs in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.phone = user.phone;
      }

      // When session.update() is called
      if (trigger === "update") {
        const updatedUser = await userRepo.findOne({
          where: { id: Number(token.id) },
        });

        if (updatedUser) {
          token.username = updatedUser.username;
          token.name = updatedUser.name;
          token.role = updatedUser.role;
          token.email = updatedUser.email;
          token.phone = updatedUser.phone;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.email = token.email; // ✅ Now this will work
      session.user.phone = token.phone; // ✅ This too
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
