import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

/**
 * Host-routing tests for src/proxy.ts — every subdomain site, the
 * static-asset guard, and the cross-host redirects for internal site
 * trees (Resume Builder spec §4; the resume host joined in Phase 1).
 */

function req(host: string, path: string): NextRequest {
  return new NextRequest(`https://${host}${path}`, {
    headers: { host },
  });
}

function rewriteTarget(res: Response): string | null {
  return res.headers.get('x-middleware-rewrite');
}

describe('resumebuilder host routing', () => {
  it('rewrites the resume host root into the resumebuilder-site tree', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/'));
    expect(rewriteTarget(res)).toContain('/resumebuilder-site');
  });

  it('rewrites resume host subpaths into the tree', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/app'));
    expect(rewriteTarget(res)).toContain('/resumebuilder-site/app');
  });

  it('does not rewrite static assets on the resume host', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/resumebuilder-logo.svg'));
    expect(rewriteTarget(res)).toBeNull();
    expect(res.status).toBe(200);
  });

  it('does not double-prefix paths already in the tree', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/resumebuilder-site/app'));
    expect(rewriteTarget(res)).toBeNull();
  });
});

describe('cross-host redirects for internal site trees', () => {
  it('redirects another site tree requested on the resume host (301, prefix stripped)', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/invoice-site/dashboard'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://invoicegenerator.freeqrcode.tools/dashboard');
  });

  it('redirects the resume tree requested on the main host to the resume host', () => {
    const res = proxy(req('freeqrcode.tools', '/resumebuilder-site/app'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://resumebuilder.freeqrcode.tools/app');
  });

  it('redirects the resume tree requested on the socialcalendar host', () => {
    const res = proxy(req('socialcalendar.freeqrcode.tools', '/resumebuilder-site'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://resumebuilder.freeqrcode.tools/');
  });

  it('redirects the socialcalendar tree requested on the resume host', () => {
    const res = proxy(req('resumebuilder.freeqrcode.tools', '/socialcalendar-site/guides'));
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://socialcalendar.freeqrcode.tools/guides');
  });

  it('never redirects a tree on its own host', () => {
    const res = proxy(req('invoicegenerator.freeqrcode.tools', '/invoice-site'));
    expect(res.status).not.toBe(301);
  });

  it('does not redirect on unknown/dev hosts (localhost e2e keeps working)', () => {
    const res = proxy(req('localhost', '/invoice-site/x'));
    expect(res.status).not.toBe(301);
    expect(res.headers.get('location')).toBeNull();
  });
});

describe('existing hosts keep their routing', () => {
  it('socialcalendar host still rewrites into its tree', () => {
    const res = proxy(req('socialcalendar.freeqrcode.tools', '/guides'));
    expect(rewriteTarget(res)).toContain('/socialcalendar-site/guides');
  });

  it('imageresizer host still rewrites into its tree', () => {
    const res = proxy(req('imageresizer.freeqrcode.tools', '/resize'));
    expect(rewriteTarget(res)).toContain('/imageresizer-site/resize');
  });

  it('invoice host still rewrites into its tree', () => {
    const res = proxy(req('invoicegenerator.freeqrcode.tools', '/dashboard'));
    expect(rewriteTarget(res)).toContain('/invoice-site/dashboard');
  });

  it('invoice tool paths on the invoice host are served as-is', () => {
    const res = proxy(req('invoicegenerator.freeqrcode.tools', '/invoice-generator'));
    expect(rewriteTarget(res)).toBeNull();
  });

  it('www still 308-redirects to the apex', () => {
    const res = proxy(req('www.freeqrcode.tools', '/tools'));
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('https://freeqrcode.tools/tools');
  });

  it('main host pages pass through untouched', () => {
    const res = proxy(req('freeqrcode.tools', '/tools'));
    expect(rewriteTarget(res)).toBeNull();
    expect(res.status).toBe(200);
  });
});
