'use client';

import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';

export function ImageContactForm({ email }: { email: string }) {
  const [name, setName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [topic, setTopic] = useState('Question about an image tool');
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `[Image Resizer] ${topic} — from ${name || 'a visitor'}`;
    const body = [
      message,
      '',
      '—',
      `Name: ${name}`,
      `Reply to: ${fromEmail}`,
      'Sent from the Image Resizer contact page',
    ].join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="image-contact-name" className="block text-sm font-medium mb-1.5">
            Your name
          </label>
          <input
            id="image-contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Sara Ahmed"
          />
        </div>
        <div>
          <label htmlFor="image-contact-email" className="block text-sm font-medium mb-1.5">
            Your email
          </label>
          <input
            id="image-contact-email"
            type="email"
            required
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="image-contact-topic" className="block text-sm font-medium mb-1.5">
          Topic
        </label>
        <select
          id="image-contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={inputClass}
        >
          <option>Question about an image tool</option>
          <option>Feature request</option>
          <option>Report a problem</option>
          <option>Privacy question</option>
          <option>Business / partnership</option>
          <option>Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="image-contact-message" className="block text-sm font-medium mb-1.5">
          Message
        </label>
        <textarea
          id="image-contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="Tell us what you need — the tool's name, your browser, and the file's format and size help us answer."
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Send className="w-4 h-4" /> Open in my email app
      </button>

      <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
        <Mail className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          This opens your email app with the message addressed and written — nothing is sent
          through our servers, and the form itself stores nothing.
          {opened && (
            <span className="block mt-1.5 font-medium text-foreground">
              Your email app should have opened. If it didn&rsquo;t, write to us directly at{' '}
              {email}.
            </span>
          )}
        </span>
      </p>
    </form>
  );
}
