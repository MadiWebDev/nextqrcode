import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TemplateView } from '../TemplateView';
import { loadTemplate } from '../../_lib/templates/registry';

/**
 * Phase 9 security regression: a resume that arrives via import or a
 * share link is untrusted data. A `javascript:` (or other unsafe-scheme)
 * link mark must never become a clickable anchor in the renderer; a
 * normal https link must still render as one.
 */
describe('TemplateView link safety', () => {
  it('renders unsafe-scheme link marks as plain text, keeps https links', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    const summary = doc.sections.find((s) => s.kind === 'summary');
    expect(summary).toBeTruthy();
    if (summary && summary.kind === 'summary') {
      summary.text = [
        {
          type: 'paragraph',
          spans: [
            { text: 'Click the ' },
            { text: 'unsafe link', marks: { link: 'javascript:alert(1)' } },
            { text: ' or the ' },
            { text: 'safe link', marks: { link: 'https://example.com/portfolio' } },
            { text: '.' },
          ],
        },
      ];
    }
    render(<TemplateView doc={doc} template={template} />);
    const view = screen.getByTestId('template-view');
    expect(view).toHaveTextContent('unsafe link');
    const anchors = [...view.querySelectorAll('a')];
    expect(anchors.some((a) => (a.getAttribute('href') || '').startsWith('javascript:'))).toBe(false);
    expect(anchors.some((a) => a.getAttribute('href') === 'https://example.com/portfolio')).toBe(true);
  });
});
