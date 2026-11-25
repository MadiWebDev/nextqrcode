#!/usr/bin/env python3
"""
build-content-inventory.py — content-program inventory, step 2.

Merges /tmp/sitemap-urls.json (from extract-sitemap-urls.mts) with the
Step-4 classification (seo-agent/output/url-actions.csv) and the GSC
Performance export (~/workspace/gsc-2026-11-23/Pages.csv) into:

  seo-agent/content-program/INVENTORY.csv  — every sitemap URL + every
      classified URL not emitted by the sitemap (REMOVE-410 / ASSET).
  seo-agent/content-program/QUEUE.csv      — the ordered work queue for
      the remaining pages (Batch 1's 10 excluded; REMOVE/ASSET excluded).

Run from the repo root:  python3 seo-agent/tools/build-content-inventory.py
"""
import csv, json, os, collections

ROOT = os.path.expanduser('~/workspace/invoice-platform/build')
GSC = os.path.expanduser('~/workspace/gsc-2026-11-23/Pages.csv')
OUT_DIR = os.path.join(ROOT, 'seo-agent/content-program')
BATCH_SIZE = 12

BATCH1_SLUGS = {
    'qr-code-for-travel-agencies', 'qr-code-for-airport-luggage',
    'kenya-mpesa-qr-code', 'qr-code-for-car-dealerships',
    'qr-code-vs-data-matrix', 'printing-bulk-shipping-labels-qr-codes',
    'qr-code-for-food-labelling', 'how-to-print-a-qr-code-on-a-business-card',
    'qr-code-for-outdoor-billboards', 'qr-code-for-hotels-and-hospitality',
}

data = json.load(open('/tmp/sitemap-urls.json'))
sitemap_urls = data['urls']
policy = data['policy']
batch_by_slug = data['batchBySlug']
seed_slugs = set(data['seedSlugs'])

actions = {}
with open(os.path.join(ROOT, 'seo-agent/output/url-actions.csv')) as f:
    for r in csv.DictReader(f):
        actions[r['url']] = r

gsc = {}
with open(GSC) as f:
    for r in csv.DictReader(f):
        gsc[r['Top pages']] = r

APEX = 'https://freeqrcode.tools'
SUBSITES = {8: 'invoice', 9: 'imageresizer', 10: 'socialcalendar', 11: 'resumebuilder'}


def exists(rel):
    return os.path.exists(os.path.join(ROOT, rel))


def page_type(section, url):
    path = url[len(APEX):] if url.startswith(APEX) else ''
    if section == 0: return 'core page'
    if section == 1: return 'tool page'
    if section == 2: return 'generator page'
    if section == 3: return 'bulk tool page'
    if section == 4: return 'suite page'
    if section == 5: return 'blog article'
    if section == 6:
        for p, t in [('/glossary/', 'glossary'), ('/scan-guide/', 'scan-guide'),
                     ('/industries/', 'industry page'), ('/templates/', 'template page'),
                     ('/qr-size-guide/', 'qr-size-guide')]:
            if path.startswith(p): return t
        return 'family page'
    if section == 7:
        for p, t in [('/qr-labels/', 'label sheet page'), ('/whatsapp-qr/', 'whatsapp country page'),
                     ('/payment-qr/', 'payment scheme page')]:
            if path.startswith(p): return t
        return 'label/scheme page'
    if section in SUBSITES: return f'sub-site page ({SUBSITES[section]})'
    return 'other'


def content_location(section, url, ptype):
    path = url[len(APEX):] if url.startswith(APEX) else None
    if ptype == 'blog article' or (path and path.startswith('/blog/') and section is None):
        slug = (path or url.rsplit('/', 1)[-1]).replace('/blog/', '')
        if slug in seed_slugs:
            return 'src/lib/articles-seed.ts'
        n = batch_by_slug.get(slug)
        return f'src/lib/pages/Batch{n}.ts' if n is not None else 'src/lib/pages/ (batch unresolved)'
    if section == 6 and path:
        slug = path.rsplit('/', 1)[-1]
        fam = {'/glossary/': 'glossary', '/industries/': 'industries', '/scan-guide/': 'scan-guide',
               '/qr-size-guide/': 'size-guide', '/templates/': 'templates'}
        for p, fn in fam.items():
            if path.startswith(p):
                return f'src/content/families/{fn}.ts (slug: {slug})'
    if section == 7 and path:
        slug = path.rsplit('/', 1)[-1]
        if path.startswith('/qr-labels/'):
            return f'src/data/labels.ts (slug: {slug}) + src/app/qr-labels/[slug]/page.tsx'
        if path.startswith('/whatsapp-qr/'):
            return f'src/data/countries.ts (slug: {slug}) + src/app/whatsapp-qr/[country]/page.tsx'
        if path.startswith('/payment-qr/'):
            return f'src/data/payments.ts (slug: {slug}) + src/app/payment-qr/[scheme]/page.tsx'
    if section in SUBSITES:
        host = SUBSITES[section]
        hosturl = {'invoice': 'https://invoicegenerator.freeqrcode.tools',
                   'imageresizer': 'https://imageresizer.freeqrcode.tools',
                   'socialcalendar': 'https://socialcalendar.freeqrcode.tools',
                   'resumebuilder': 'https://resumebuilder.freeqrcode.tools'}[host]
        sub = url[len(hosturl):] or '/'
        base = f'src/app/{host}-site'
        if host == 'resumebuilder' and ('/guides/' in sub or '/resume-templates/' in sub or '/cv-templates/' in sub):
            return f'src/app/resumebuilder-site/_lib/seo-pages.ts (path: {sub})'
        cand = f'{base}{"" if sub == "/" else sub}/page.tsx'
        if exists(cand): return cand
        if host == 'imageresizer':
            return f'src/app/imageresizer-site/_lib/registry.ts (tool: {sub})'
        return cand
    if path is not None:
        cand = 'src/app/page.tsx' if path in ('', '/') else f'src/app{path}/page.tsx'
        return cand if exists(cand) else f'{cand} (verify)'
    return ''


rows = []
seen = set()
for item in sitemap_urls:
    url, section = item['url'], item['section']
    seen.add(url)
    a = actions.get(url, {})
    g = gsc.get(url, {})
    ptype = page_type(section, url)
    rows.append({
        'url': url,
        'host': url.split('/')[2],
        'sitemap_section': section,
        'in_sitemap': 'yes',
        'type': ptype,
        'step4_class': a.get('class', ''),
        'step4_action': a.get('action', ''),
        # getPolicyClass() matches by pathname, so sub-site URLs inherit
        # apex classes spuriously — only record it for the apex host.
        'policy_class': policy.get(url, '') if url.startswith(APEX) else '',
        'content_location': content_location(section, url, ptype),
        'gsc_clicks': g.get('Clicks', ''),
        'gsc_impressions': g.get('Impressions', ''),
        'gsc_position': g.get('Position', ''),
    })

# Classified URLs the sitemap does not emit (REMOVE-410, ASSET-UTILITY, …)
for url, a in actions.items():
    if url in seen: continue
    g = gsc.get(url, {})
    fam = a.get('family', '')
    ptype = {'blog': 'blog article', 'scan-guide': 'scan-guide', 'glossary': 'glossary',
             'industries': 'industry page', 'templates': 'template page',
             'qr-size-guide': 'qr-size-guide'}.get(fam, 'classified non-sitemap URL')
    rows.append({
        'url': url,
        'host': url.split('/')[2],
        'sitemap_section': '',
        'in_sitemap': 'no',
        'type': ptype,
        'step4_class': a.get('class', ''),
        'step4_action': a.get('action', ''),
        'policy_class': '',
        'content_location': content_location(None, url, ptype) if fam == 'blog' else '',
        'gsc_clicks': g.get('Clicks', ''),
        'gsc_impressions': g.get('Impressions', ''),
        'gsc_position': g.get('Position', ''),
    })

os.makedirs(OUT_DIR, exist_ok=True)
inv_path = os.path.join(OUT_DIR, 'INVENTORY.csv')
with open(inv_path, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)

# ── QUEUE ────────────────────────────────────────────────────────────────────
def eff_class(r):
    return r['step4_class'] or r['policy_class']

def score_of(url):
    a = actions.get(url, {})
    try: return float(a.get('score') or 0)
    except ValueError: return 0.0

def earn_key(r):
    def num(v, d=0.0):
        try: return float(v)
        except (TypeError, ValueError): return d
    return (-num(r['gsc_clicks']), -num(r['gsc_impressions']),
            num(r['gsc_position'], 999.0), -score_of(r['url']), r['url'])

queue = []
sitemap_rows = [r for r in rows if r['in_sitemap'] == 'yes']

def is_batch1(r):
    return r['type'] == 'blog article' and r['url'].rsplit('/', 1)[-1] in BATCH1_SLUGS

def apex(r):
    return r['sitemap_section'] != '' and int(r['sitemap_section']) <= 7

g1 = sorted([r for r in sitemap_rows if apex(r) and eff_class(r) == 'IMPROVE' and not is_batch1(r)], key=earn_key)
g2 = sorted([r for r in sitemap_rows if apex(r) and eff_class(r) == 'KEEP-INDEX-READY'], key=earn_key)
g3 = sorted([r for r in sitemap_rows if apex(r) and eff_class(r) == 'PROTECT'], key=earn_key)
classified = {id(r) for r in g1 + g2 + g3}
g4 = sorted([r for r in sitemap_rows if id(r) not in classified and apex(r) and not is_batch1(r)],
            key=lambda r: (int(r['sitemap_section']),) + earn_key(r))
g5 = sorted([r for r in sitemap_rows if r['sitemap_section'] != '' and int(r['sitemap_section']) >= 8],
            key=lambda r: (int(r['sitemap_section']), r['url']))

groups = [(g1, 'rewrite-full'), (g2, 'verify-and-strengthen'), (g3, 'light-touch'),
          (g4, 'standard-update'), (g5, 'sub-site-adapt')]
order = 0
for grp, treatment in groups:
    for r in grp:
        order += 1
        queue.append({
            'queue_order': order,
            'planned_batch': 2 + (order - 1) // BATCH_SIZE,
            'url': r['url'],
            'type': r['type'],
            'class': eff_class(r) or 'UNCLASSIFIED',
            'treatment': treatment,
            'content_location': r['content_location'],
            'gsc_clicks': r['gsc_clicks'],
            'gsc_impressions': r['gsc_impressions'],
            'gsc_position': r['gsc_position'],
        })

q_path = os.path.join(OUT_DIR, 'QUEUE.csv')
with open(q_path, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(queue[0].keys()))
    w.writeheader(); w.writerows(queue)

print('inventory rows:', len(rows), '(sitemap:', sum(1 for r in rows if r['in_sitemap'] == 'yes'), ')')
print('inventory by type:', collections.Counter(r['type'] for r in rows).most_common())
print('inventory by step4 class:', collections.Counter(r['step4_class'] or '(none)' for r in rows))
print('queue rows:', len(queue), '| groups:', [len(g) for g, _ in groups],
      '| planned batches 2..', 2 + (len(queue) - 1) // BATCH_SIZE)
