import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { db } from "../../../../../db";
import { users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import CryptoJS from "crypto-js";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any) {
        const { email, password } = credentials;

        const user = await db
          .select()
          .from(users)
          .limit(1)
          .where(eq(users.email, email));

        var bytes = CryptoJS.AES.decrypt(
          user[0].password,
          process.env.SECRET_KEY!
        );

        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (user.length === 0 || decryptedPassword !== password) return null;

        return user[0];
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    //@ts-ignore
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.image) {
        token.image = user.image;
      }

      return token;
    }, //@ts-ignore
    async session({ session, token }) {
      session.id = token.id;
      session.name = token.name;
      session.email = token.email;
      session.image = token.image;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
