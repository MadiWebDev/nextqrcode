import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — QR Studio',
  description: 'Get in touch with the QR Studio team.',
  alternates: { canonical: 'https://qrstudio.app/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
      <p className="text-muted-foreground leading-relaxed">Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.</p>
      <div className="space-y-3 text-sm">
        <div className="flex gap-3"><span className="font-medium w-24 shrink-0">General</span><a href="mailto:contact@qrstudio.app" className="text-primary hover:underline">contact@qrstudio.app</a></div>
        <div className="flex gap-3"><span className="font-medium w-24 shrink-0">Privacy</span><a href="mailto:privacy@qrstudio.app" className="text-primary hover:underline">privacy@qrstudio.app</a></div>
        <div className="flex gap-3"><span className="font-medium w-24 shrink-0">Security</span><a href="mailto:security@qrstudio.app" className="text-primary hover:underline">security@qrstudio.app</a></div>
      </div>
    </div>
  );
}
