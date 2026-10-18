import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Nodemailer from 'next-auth/providers/nodemailer';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { getMongoClient, isMongoConfigured } from '@/lib/mongodb';

/**
 * Auth.js v5 configuration: Google OAuth + email magic link.
 *
 * - Google is enabled when AUTH_GOOGLE_ID/SECRET are set.
 * - Email magic link is enabled when EMAIL_SERVER is set.
 * - With MongoDB configured, the MongoDBAdapter persists users/sessions/
 *   verification tokens; otherwise auth routes return 503 with a clear message
 *   (guests can still generate static QR codes — no account needed).
 */
function buildProviders() {
  const providers = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      })
    );
  }
  if (process.env.EMAIL_SERVER) {
    providers.push(
      Nodemailer({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM || 'noreply@freeqrcode.tools',
      })
    );
  }
  return providers;
}

export function isAuthConfigured(): boolean {
  return isMongoConfigured() && buildProviders().length > 0 && Boolean(process.env.AUTH_SECRET);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter only when MongoDB is configured; without it, auth is disabled
  // gracefully (see isAuthConfigured) instead of crashing at import time.
  ...(isMongoConfigured() ? { adapter: MongoDBAdapter(getMongoClient()) } : {}),
  providers: buildProviders(),
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.uid === 'string') {
        session.user.id = token.uid;
      }
      return session;
    },
  },
});

/** Resolve the current user id or null (never throws for anonymous visitors). */
export async function getUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}
