# Zurich Youth Classical

Website of Zurich Youth Classical (ZYC): [www.zurichyouthclassical.ch](https://www.zurichyouthclassical.ch).

Built with Next.js 15 (App Router), React 19 and TypeScript. All content comes from [Prismic](https://prismic.io). Styling is CSS Modules, and animation uses GSAP with Lenis smooth scrolling.

The site is bilingual. German is the default and lives on bare URLs (`/the_contest`), and English lives under `/en-us` (`/en-us/the_contest`).

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on [localhost:3000](http://localhost:3000).

Create a `.env.local` in the project root. It is gitignored, so never commit it.

| Variable | Used by |
|---|---|
| `RESEND_TOKEN` | Contact form emails (`/api/emails/main`) |
| `BREVO_API_KEY`, `BREVO_LIST_ID` | Newsletter signup (`/api/subscribe`) |
| `PRISMIC_WRITE_TOKEN` | Content scripts only (translation, alt texts), not the site itself |
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | Optional: read from a Prismic environment other than the main repository |

Reading content needs no token, because the Prismic repository `zurichyouthclassical` is public.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npm run email` | Preview the email templates in `src/emails` |

There is no test suite. Before merging, run `npx tsc --noEmit` and `npm run lint`, and check the change in the browser in both languages.

Don't run `npm run format`: there is no Prettier config, so it rewrites the whole codebase to double quotes. Format only the files you touched with `npx prettier --single-quote --write <files>`.

## Project structure

```
src/
  app/[lang]/        pages, one folder per route (magazin, galerie, the_contest, ...)
  app/api/           Prismic preview and revalidation, newsletter, contact email
  app/components/    shared components (navigation, footer, forms, lightbox, ...)
  slices/            Prismic slice components, registered in slices/index.ts
  helpers/           locale, SEO, gallery and download helpers
  stores/            small Zustand stores (filters, modal state)
  middleware.ts      locale routing: bare URLs are German, /de-ch redirects to them
  prismicio.ts       Prismic client and route resolvers
customtypes/         Prismic page type models
prismicio-types.d.ts generated Prismic types
```

## Content and Prismic

Editors change text, images and videos in Prismic. Publishing there updates the live site through a webhook that clears the cache, with no deploy needed.

The content models (page types in `customtypes/`, slices in `src/slices/*/model.json`) are kept in the repository and synced with the Prismic CLI:

```bash
npx prismic pull   # bring model changes made in Prismic into the repo
npx prismic push   # send model changes made in the repo to Prismic
```

Commit model files before pulling. Don't use `push --force`, because it overwrites changes made in the Prismic editor.

Videos:

- **Gallery page:** videos are embedded from Vimeo, and Prismic holds the Vimeo URL.
- **Magazine post galleries:** use a Cloudinary link, or upload small clips (a few MB) to the Prismic media library. Larger files count against the Prismic bandwidth allowance.

## Workflow and deployment

Every task gets its own branch off `main`. Changes are reviewed on the branch and then merged into `main`. Pushing `main` deploys to production automatically on Vercel, and there is no separate CI.

## For coding agents

[`AGENTS.md`](AGENTS.md) is the detailed guide to the codebase: routing and locales, the Prismic data flow, layout and animation conventions, known pitfalls, and cleanup targets. Keep it current when architecture or behavior changes.

Content work has two agent skills in `.claude/skills/`:

- `zyc-translate`: translates German content to English through a Prismic migration release.
- `zyc-alt-texts`: fills missing image alt texts in both languages.

Both write to a migration release that is reviewed and published in Prismic. Neither publishes anything directly.
