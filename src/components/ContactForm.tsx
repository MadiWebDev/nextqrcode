'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['general', 'bug', 'feature', 'partnership'], {
    required_error: 'Please select a subject',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjectLabels: Record<string, string> = {
  general: 'General Enquiry',
  bug: 'Bug Report',
  feature: 'Feature Request',
  partnership: 'Partnership',
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const subjectValue = watch('subject');

  function onSubmit(data: ContactFormValues) {
    const subjectLine = `[QR Studio] ${subjectLabels[data.subject]} from ${data.name}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${subjectLabels[data.subject]}\n\n${data.message}`;
    const mailtoUrl = `mailto:contact@qrstudio.app?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    toast.success('Message opened in your mail client!');
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <Label htmlFor="contact-name" className="text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-name"
          type="text"
          autoComplete="name"
          className="mt-1.5"
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="contact-email" className="text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          className="mt-1.5"
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <Label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Select
          value={subjectValue}
          onValueChange={(val) =>
            setValue('subject', val as ContactFormValues['subject'], { shouldValidate: true })
          }
        >
          <SelectTrigger id="contact-subject" className="mt-1.5">
            <SelectValue placeholder="Select a subject…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Enquiry</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="contact-message" className="text-sm font-medium text-foreground">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contact-message"
          rows={6}
          className="mt-1.5 resize-y"
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-destructive mt-1" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
}
