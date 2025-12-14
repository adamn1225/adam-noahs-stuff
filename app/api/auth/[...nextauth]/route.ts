import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface User {
    id: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;
        
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          console.error('ADMIN_PASSWORD not set in environment variables');
          return null;
        }

        // For first-time setup, the password is plain text
        // After first login, it should be hashed
        const isValid = credentials.password === adminPassword;
        
        if (isValid) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@portfolio.local',
          };
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
