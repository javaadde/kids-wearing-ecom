import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@kidostudio.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPass
        ) {
          return { id: "1", name: "Admin", email: adminEmail, role: "admin" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: unknown }).role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "kido-secret-change-me",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
