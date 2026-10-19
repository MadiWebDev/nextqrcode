import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, isAuthConfigured } from '@/lib/auth';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in — QR Studio',
  description:
    'Sign in to QR Studio to save your QR codes, view scan analytics, and manage your account.',
  alternates: { canonical: `${siteConfig.url}/login` },
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  const configured = isAuthConfigured();
  const providers: string[] = [];
  if (configured) {
    if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) providers.push('google');
    if (process.env.EMAIL_SERVER) providers.push('email');
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Sign in', url: '/login' },
        ]}
        baseUrl={siteConfig.url}
      />
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sign in to QR Studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save your QR codes, unlock scan analytics, and sync across devices.
        </p>
      </header>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <LoginForm providers={providers} />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Just want a QR code?{' '}
        <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
          Use the free generator
        </Link>{' '}
        — no account needed.
      </p>
    </div>
  );
}
