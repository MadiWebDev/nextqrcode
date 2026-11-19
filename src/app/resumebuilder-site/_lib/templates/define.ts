import type { TemplateDef, TemplateTokens } from './types';

/** Fill token defaults so each template file states only what differs. */
export function tokens(partial: Partial<TemplateTokens>): TemplateTokens {
  return {
    accent: '#0f766e',
    palettes: ['#0f766e', '#1d4ed8', '#7c2d12', '#334155'],
    ink: '#171717',
    muted: '#525252',
    surface: '#ffffff',
    headingFont: 'Georgia, "Times New Roman", serif',
    bodyFont: 'Arial, Helvetica, sans-serif',
    baseSize: 13.5,
    headingSize: 13,
    nameSize: 26,
    lineHeight: 1.45,
    sectionGap: 16,
    entryGap: 8,
    bullet: 'disc',
    divider: 'rule',
    ...partial,
  };
}

type DefInput = Omit<TemplateDef, 'tokens' | 'supportsRtl' | 'pageSizes'> & {
  tokens: Partial<TemplateTokens>;
  supportsRtl?: boolean;
  pageSizes?: Array<'a4' | 'letter'>;
};

export function defineTemplate(input: DefInput): TemplateDef {
  return {
    ...input,
    tokens: tokens(input.tokens),
    supportsRtl: input.supportsRtl ?? true,
    pageSizes: input.pageSizes ?? ['a4', 'letter'],
  };
}
