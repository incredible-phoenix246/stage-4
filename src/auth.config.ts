import Google from "next-auth/providers/google";

import { GOOGLE_SIGN_IN } from "./actions/google";

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
  ],
  callbacks: {
    async signIn({ account, profile, user }: any) {
      if (account && account.provider === "google") {
        const res = await GOOGLE_SIGN_IN(profile);
        const use = res.user;

        return { user: { ...use } };
      }
      return { ...account, ...profile, ...user };
    },

    async jwt({ token, user, profile, account }) {
      if (account && account.provider !== "google") {
        return { ...token, ...user };
      }
      const res = await GOOGLE_SIGN_IN(profile);
      const use = res.user;

      user = use;

      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
