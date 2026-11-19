import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TemplateView } from '../TemplateView';
import { loadTemplate } from '../../_lib/templates/registry';

describe('TemplateView', () => {
  it('renders the sample document with header, sections and entries', async () => {
    const template = await loadTemplate('teacher-classroom-classic');
    const doc = template.sample();
    render(<TemplateView doc={doc} template={template} />);
    const view = screen.getByTestId('template-view');
    expect(view).toHaveTextContent('Maryam Siddiqui');
    expect(view).toHaveTextContent('Secondary School Mathematics Teacher');
    expect(view).toHaveTextContent('EXPERIENCE');
    expect(view).toHaveTextContent('Raised the grade 9 class average');
    expect(view.querySelectorAll('.resume-page').length).toBeGreaterThanOrEqual(1);
  });

  it('renders a sidebar template with its side-column content present', async () => {
    const template = await loadTemplate('mechanical-engineer-sidebar');
    const doc = template.sample();
    render(<TemplateView doc={doc} template={template} />);
    const view = screen.getByTestId('template-view');
    expect(view).toHaveTextContent('Tomasz Nowak');
    expect(view).toHaveTextContent('SolidWorks');
    expect(view).toHaveTextContent('CERTIFICATIONS & LICENCES');
  });

  it('renders RTL documents with dir=rtl', async () => {
    const template = await loadTemplate('one-page-compact');
    const doc = { ...template.sample(), meta: { ...template.sample().meta, direction: 'rtl' as const, language: 'ur' } };
    render(<TemplateView doc={doc} template={template} />);
    expect(screen.getByTestId('template-view').getAttribute('dir')).toBe('rtl');
  });
});
