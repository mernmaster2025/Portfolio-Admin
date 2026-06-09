# Portfolio Builder

A modern, schema-driven SaaS application for visually creating, customizing,
previewing, and **exporting** professional portfolio websites — no code required.
The exported result is a standalone Next.js project you can deploy anywhere.

Built with **Next.js 16 (App Router)**, **TypeScript (strict)**, **Material UI**,
**Zustand**, **React Hook Form**, **Zod**, and **Framer Motion**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the admin
dashboard at `/admin`.

```bash
npm run build && npm start   # production
npx tsc --noEmit             # type-check
npx eslint src               # lint
```

## How it works

### Single source of truth

The entire platform renders from one schema, defined once with Zod in
[`src/schemas/portfolio.ts`](src/schemas/portfolio.ts). All TypeScript types are
**inferred** from those schemas, so validation and types can never drift. A
fully-defaulted seed lives at [`src/data/portfolio.json`](src/data/portfolio.json)
(generated from the schema).

### State management

A single persisted Zustand store, [`usePortfolioStore`](src/stores/portfolioStore.ts),
holds the schema and is the source of truth. Domain-scoped hooks
(`useThemeStore`, `useHeaderStore`, `useFooterStore`, `useSectionStore`,
`useAnimationStore`, `useSeoStore`, `useSocialsStore`) in
[`src/stores/domains.ts`](src/stores/domains.ts) are thin selectors over it, so
every edit is reflected in the live preview instantly. State persists to
`localStorage`, re-validated against the schema on rehydrate.

### Live preview

The builder shows the editor and a **real-time preview** side by side. The
preview is an `<iframe>` pointing at the standalone [`/preview`](src/app/preview)
route, so Material UI's responsive breakpoints react to the **actual** device
width — desktop / tablet / mobile previews are genuinely responsive, not just
scaled. The iframe shares `localStorage` with the builder and re-hydrates on
`storage` events, giving instant updates with full isolation.

### Export

The Export page generates a complete, **standalone Next.js project** as a
downloadable ZIP ([`src/lib/export`](src/lib/export)). It bundles your
`portfolio.json` plus a self-contained, prop-driven renderer with its own
`package.json`, configs, and README — no dependency on this builder. You can
also export/import the raw `portfolio.json`.

## Dashboard modules

| Module | Route | What it does |
| --- | --- | --- |
| Dashboard | `/admin` | Overview & quick links |
| Theme | `/admin/theme` | Mode, presets, colors, font, radius, container width |
| Header | `/admin/header` | Variant, position, animation, content toggles, socials |
| Footer | `/admin/footer` | Variant, columns, content toggles |
| Sections | `/admin/sections` | Drag-and-drop reorder + visibility (dnd-kit) |
| Section editors | `/admin/sections/[section]` | Per-section variants + content CRUD |
| Animations | `/admin/animations` | Motion preset & effect toggles |
| SEO | `/admin/seo` | Meta, keywords, OG/Twitter images, canonical |
| Preview | `/admin/preview` | Full responsive preview |
| Export | `/admin/export` | Download standalone project / import JSON |

The portfolio navigation menu is generated **automatically** from the visible
sections — there is no manual menu editing.

## Project structure

```
src/
├── app/                 # Next.js App Router (admin/* routes, /preview)
├── components/          # Admin shell, editors, live preview
│   ├── editors/         # Theme/Header/Footer/SEO/... + per-section editors
│   └── preview/         # PortfolioRenderer, LivePreview, PreviewFrame, Reveal
├── sections/            # Portfolio section components (variants) + header/footer
├── stores/              # Zustand: portfolioStore + domain hooks + UI store
├── schemas/             # Zod schema = single source of truth
├── theme/               # Admin theme + portfolio theme builder + presets
├── lib/                 # nav, social icons, typing effect, export generator
└── data/                # portfolio.json seed
```

## Forms & validation

The contact form ([`ContactForm.tsx`](src/sections/ContactForm.tsx)) uses **React
Hook Form + Zod** end to end and ships in the export. Builder inputs are
controlled for instant live preview and validate formatted fields (hex colors,
URLs, numeric ranges) inline against the same Zod constraints.

## Notes on scope

This is a commercial-grade **foundation**. Every section ships multiple variants
and the architecture is built to scale toward additional templates, AI content
generation, team accounts, and premium plans. The in-builder preview renders the
full variant set; the exported standalone renderer covers each section's primary
layouts and is the natural place to extend per-variant fidelity.
