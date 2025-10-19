import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow the admin GitHub user to sign in
      const adminUsername = process.env.ADMIN_GITHUB_USERNAME;

      if (!adminUsername) {
        console.error('ADMIN_GITHUB_USERNAME not set');
        return false;
      }

      // @ts-ignore - GitHub profile has login property
      const username = profile?.login;

      if (username === adminUsername) {
        return true;
      }

      return false;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
