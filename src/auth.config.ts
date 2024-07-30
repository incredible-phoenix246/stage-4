/* eslint-disable unicorn/prevent-abbreviations */
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { GOOGLE_SIGN_IN } from "./actions/google";
import { nextlogin } from "./actions/login";
import { LoginSchema } from "./schemas";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return;
        }
        const { email, password } = validatedFields.data;
        const res = await nextlogin({ email, password });

        if (!res.user) {
          return;
        }
        const user = res.user;

        return user;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ account, profile, user }: any) {
      return { ...account, ...profile, ...user };
    },
    async jwt({ token, user, account }) {
      if (account && account.provider !== "google") {
        return { ...token, ...user };
      }

      const res = await GOOGLE_SIGN_IN(account);

      const use = res.user;

      user = use;

      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
