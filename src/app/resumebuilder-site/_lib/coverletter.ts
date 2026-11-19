/**
 * Cover letters (spec §9): a starter generator that scaffolds an
 * honest letter from the resume's own facts (role, strongest recent
 * experience, top skills) with [bracketed] prompts where only the
 * user can supply the truth — plus plain-text and DOCX rendering.
 */
import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { CoverLetter, ResumeDoc } from './schema';
import { rt } from './schema';
import { uid } from './defaults';

export type LetterTone = 'formal' | 'warm' | 'confident';

export function newCoverLetter(resumeId: string): CoverLetter {
  return {
    schemaVersion: 1,
    id: uid('letter'),
    resumeId,
    recipient: '',
    subject: '',
    body: [],
    updatedAt: Date.now(),
  };
}

export function letterPlainText(letter: CoverLetter, doc: ResumeDoc): string {
  const lines: string[] = [];
  lines.push(doc.basics.name);
  const contact = [doc.basics.email, doc.basics.phone, doc.basics.location].filter(Boolean).join(' · ');
  if (contact) lines.push(contact);
  lines.push('');
  if (letter.recipient) lines.push(letter.recipient);
  if (letter.subject) lines.push(`Re: ${letter.subject}`);
  lines.push('');
  for (const block of letter.body) lines.push(rt.plain([block]), '');
  return lines.join('\n').trimEnd();
}

/**
 * Build a starter letter. Every factual claim comes from the resume
 * itself; anything else is a bracketed prompt. Three tones change the
 * framing, never the facts.
 */
export function starterLetter(
  doc: ResumeDoc,
  opts: { company: string; role: string; hiringManager?: string; tone: LetterTone },
): CoverLetter {
  const letter = newCoverLetter(doc.id);
  letter.recipient = opts.hiringManager?.trim() || 'Hiring Manager';
  letter.subject = `Application for ${opts.role}${opts.company ? ` — ${opts.company}` : ''}`;
  const exp = doc.sections.find((s) => s.kind === 'experience')?.experience?.[0];
  const skills =
    doc.sections
      .find((s) => s.kind === 'skills')
      ?.skillGroups?.flatMap((g) => g.skills.map((sk) => sk.name))
      .slice(0, 3) ?? [];
  const greeting =
    opts.tone === 'formal'
      ? `Dear ${letter.recipient},`
      : opts.tone === 'warm'
        ? `Hello ${letter.recipient},`
        : `Dear ${letter.recipient},`;
  const opener =
    opts.tone === 'formal'
      ? `I am writing to apply for the position of ${opts.role}${opts.company ? ` at ${opts.company}` : ''}. ${doc.basics.headline ? `I currently work as ${doc.basics.headline.toLowerCase().startsWith('a ') || doc.basics.headline.toLowerCase().startsWith('an ') ? doc.basics.headline : `a ${doc.basics.headline}`},` : 'In my current work,'} and I believe my experience matches what this role requires.`
      : opts.tone === 'warm'
        ? `I was glad to see the ${opts.role} opening${opts.company ? ` at ${opts.company}` : ''} — it describes the work I most enjoy. ${doc.basics.headline ? `I am ${doc.basics.headline.toLowerCase().startsWith('a ') ? doc.basics.headline : `a ${doc.basics.headline}`},` : ''} and I would love to bring that experience to your team.`
        : `I am applying for the ${opts.role} role${opts.company ? ` at ${opts.company}` : ''} because it sits exactly where my strongest work has been: ${skills.length ? skills.join(', ') : '[your two or three strongest, most relevant skills]'}.`;
  const evidence = exp
    ? `In my current role as ${exp.role} at ${exp.organization}, ${rt.plain(exp.bullets).split('\n')[0]?.replace(/^- /, '').replace(/^./, (c) => c.toLowerCase()) ?? '[add your strongest recent achievement, with a number if you can]'}. [Add one more sentence here about a result that matters for this specific employer — something you can back up in an interview.]`
    : '[Write 3–4 sentences here about your most relevant experience. Pick the achievement closest to this job, say what you did, and give the result with a number where you honestly can.]';
  const fit =
    opts.tone === 'formal'
      ? `[Explain in 2–3 sentences why this employer, specifically: a product, a value, a recent project of theirs that connects to your work. Generic praise reads as generic — name something real.]`
      : opts.tone === 'warm'
        ? `[Say in 2–3 sentences what draws you to this team in particular — their work, their customers, their way of working — and connect it to something true about you.]`
        : `[Name one thing this employer is trying to do that you have already done before, and say how you would approach it in the first months.]`;
  const closingLine =
    opts.tone === 'formal'
      ? 'I would welcome the opportunity to discuss my application at interview. Thank you for your consideration.'
      : opts.tone === 'warm'
        ? 'Thank you for reading this far — I would be delighted to talk through how I could contribute.'
        : 'I am confident I can deliver [the specific outcome this role exists for] and would welcome the chance to show you how.';
  const signoff = opts.tone === 'formal' ? 'Yours faithfully,' : opts.tone === 'warm' ? 'Warm regards,' : 'Best regards,';
  letter.body = [
    rt.p(greeting),
    rt.p(opener),
    rt.p(evidence),
    rt.p(fit),
    rt.p(closingLine),
    rt.p(signoff),
    rt.p(doc.basics.name),
  ];
  return letter;
}

export async function buildLetterDocx(letter: CoverLetter, doc: ResumeDoc): Promise<Blob> {
  const paragraphs = letterPlainText(letter, doc)
    .split('\n')
    .map((line, i) =>
      line.trim() === ''
        ? new Paragraph({ children: [] })
        : new Paragraph({
            children: [new TextRun({ text: line, bold: i === 0, size: i === 0 ? 28 : 22 })],
          }),
    );
  const document = new Document({
    creator: doc.basics.name,
    title: letter.subject || 'Cover letter',
    sections: [{ children: paragraphs }],
  });
  return Packer.toBlob(document);
}
