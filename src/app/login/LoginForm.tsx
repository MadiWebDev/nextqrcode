'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

const CALLBACK_URL = '/dashboard';

interface LoginFormProps {
  /** Available providers: 'google', 'email' (nodemailer). Empty when auth is not configured. */
  providers: string[];
}

function LoginFormInner({ providers }: LoginFormProps) {
  const searchParams = useSearchParams();
  const verify = searchParams.get('verify') === '1';
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!providers.includes('google') && !providers.includes('email')) {
    return (
      <div
        role="note"
        aria-live="polite"
        className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
      >
        Sign-in is unavailable right now — guests can still use the free QR code generator without
        an account.
      </div>
    );
  }

  async function handleMagicLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const result = await signIn('nodemailer', {
        email: email.trim(),
        callbackUrl: CALLBACK_URL,
        redirect: false,
      });
      if (result?.error) {
        setError('Could not send the magic link. Please try again.');
        setSending(false);
      }
    } catch {
      setError('Could not send the magic link. Please try again.');
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {verify && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
          <p>
            <span className="font-semibold">Check your email.</span> We sent you a secure sign-in
            link — open it on this device to finish signing in.
          </p>
        </div>
      )}

      {providers.includes('google') && (
        <button
          type="button"
          onClick={() => void signIn('google', { callbackUrl: CALLBACK_URL })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
            />
          </svg>
          Continue with Google
        </button>
      )}

      {providers.includes('google') && providers.includes('email') && (
        <div className="relative" aria-hidden="true">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
      )}

      {providers.includes('email') && (
        <form onSubmit={(e) => void handleMagicLink(e)} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Mail className="h-4 w-4" aria-hidden="true" />
            )}
            {sending ? 'Sending…' : 'Continue with email'}
          </button>
          <p className="text-xs text-muted-foreground">
            We&apos;ll email you a secure magic link — no password needed.
          </p>
        </form>
      )}
    </div>
  );
}

export default function LoginForm(props: LoginFormProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
          Loading sign-in options…
        </div>
      }
    >
      <LoginFormInner {...props} />
    </Suspense>
  );
}
