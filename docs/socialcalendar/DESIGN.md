# Design — Social Media Calendar

## Identity

- Original calendar-plus-nodes logo mark (`public/socialcalendar-logo.svg`),
  sky-blue family palette shared with the sibling tools.
- Own header/footer and chrome: the main site's header/footer are hidden
  on this subdomain via the scoped `:has()` rule in `src/app/globals.css`
  (external stylesheet on purpose — see the CSP lesson recorded there).

## System

- Tailwind v4 + the repo's shadcn/ui kit and design tokens; no new
  design system was introduced.
- Themes: light / dark / system via the repo's theme machinery, plus a
  high-contrast token set (`[data-contrast='high']` in globals.css).
- Reduced-motion: animations respect `prefers-reduced-motion`; drag uses
  dnd-kit sensors with a full keyboard alternative.
- RTL: layout uses logical properties where the app chrome flips;
  Urdu/Arabic locales set `dir=rtl` (scaffold locales — see README).

## Layout rules

- The workspace is a tabbed single page (Calendar, Campaigns & brand,
  Library, Intelligence, Analytics, Overview, Workspaces, Data &
  backup) so state never unloads while working.
- The post editor is a modal sheet: bottom sheet on mobile, centred
  dialog on desktop, Escape to close, focus labelled throughout.
- AdSlot appears only on the landing page and guide articles — never in
  the workspace, editors, dialogs, the share viewer, or print.

## Accessibility

- All interactive elements are native buttons/inputs/selects with
  visible labels or aria-labels; status is never conveyed by colour
  alone (chips carry text, bars carry values and data tables).
- Charts are bar lists with an accompanying data-table alternative.
- Axe-core runs over the key routes in e2e (see TESTING.md).
