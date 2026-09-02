# AGENTS.md

This file is the working guide for coding agents in this repository. Keep it current when changing architecture, routing, data flow, or layout behavior that is easy to misunderstand later.

## Project Snapshot

- App: Zurich Youth Classical website.
- Framework: Next.js 15 App Router, React 19, TypeScript strict mode.
- CMS: Prismic. Models live in `customtypes/*/index.json` and `src/slices/*/model.json` and are synced with the Prismic CLI (`npx prismic pull` / `npx prismic push`), configured by `prismic.config.json`. Slice Machine is no longer installed. Generated types are in the root `prismicio-types.d.ts`; `src/prismicio-types.ts` only re-exports it.
- Locales: `de-ch` (site default, bare URLs) and `en-us` (under `/en-us`). Both are public. See "Locales And URL Canonicalization".
- Styling: CSS Modules for components and slices, global design tokens in `src/app/globals.css`.
- Animation: GSAP via `@gsap/react`, plus `next-view-transitions` and Lenis smooth scrolling.
- Client state: small Zustand stores in `src/stores/`.
- Forms/integrations: Resend contact email route and Brevo newsletter subscription route.
- Agent skills for content work live in `.claude/skills/`: `zyc-translate` (de-ch to en-us via the Migration API) and `zyc-alt-texts`. The proofreader's English text in `docs/proofread/` is the source of truth for English wording.

## Commands

- `npm run dev`: Next dev server with Turbopack. Carlo usually keeps one running on port 3000; do not restart it. For a clean build to test against, copy the repo into a scratch dir and run `npx next dev -p 3001` there.
- `npm run build`: production build.
- `npm run lint`: Next lint.
- `npx tsc --noEmit`: TypeScript check.
- `npm run format`: Prettier write across the repo. There is no Prettier config file, so this flips the codebase's single quotes to double quotes. Run Prettier with `--single-quote` on the files you touched instead.
- `npx prismic pull` / `npx prismic push`: sync Prismic models. See "Prismic CLI Workflow".
- `fallow` (global CLI, `/opt/homebrew/bin/fallow`): dead-code and duplication audit. It diffs commits, so an uncommitted tree audits as empty; commit in a scratch copy first.

When validating normal code changes, run at least `npx tsc --noEmit` and `npm run lint`. There is no CI; the hosting platform builds from the push to `main`.

## Important Paths

- `src/app/layout.tsx`: root layout. Wraps the app in `ViewTransitions`, `Providers`, global Lenis provider, signup button, scroll indicator, Simple Analytics script, and `PrismicPreview`. Its `<html lang>` is hard-coded to `en`.
- `src/app/[lang]/layout.tsx`: locale layout. Wraps everything in a `display: contents` div carrying the real `lang`, then adds `AlertOverlay`, navigation, footer, newsletter form, and contact form.
- `src/app/[lang]/[...rest]/page.tsx`: catch-all that calls `notFound()` so unknown URLs render the 404 inside the locale layout.
- `src/app/[lang]/not-found.tsx` and `src/app/not-found.tsx`: both render `src/app/components/NotFound/NotFoundContent.tsx`.
- `src/middleware.ts`: locale middleware. Fetches Prismic repository languages once, redirects `/de-ch` and `/de-ch/...` to the bare path with a permanent 308, and rewrites paths with no locale to `/de-ch/...`.
- `src/prismicio.ts`: Prismic client factory, route resolver list, cache settings, and preview enabling.
- `src/helpers/stripLocale.ts`, `src/helpers/useLocaleFromPathname.ts`: locale helpers, see below.
- `src/helpers/downloadFile.ts`: fetch-to-blob download used by the gallery lightbox and the poster slice.
- `src/slices/index.ts`: SliceZone component registry.
- `customtypes/` and `src/slices/*/model.json`: Prismic document and slice model definitions.
- `src/app/api/`: API routes for Prismic preview, cache revalidation, Brevo subscribe, and Resend emails.

## Route Map

- `/[lang]`: landing page, Prismic `page` UID `home`, homepage navigation, dynamic landing content, background, and event visibility.
- `/[lang]/the_contest`: contest page with criteria, foldouts, signup link, downloads mute state, "we are here" icon, and the poster slice.
- `/[lang]/the_cadenza`: Cadenza page with foldouts and signup link.
- `/[lang]/the_crescendo`: Crescendo page with foldouts and signup link. Note the component/file spelling is currently `CreschendoContent`.
- `/[lang]/termine`: dates/schedule page with signup link.
- `/[lang]/magazin`: magazine index with filters, sorting, focus posts, and grouped month sections.
- `/[lang]/magazin/[uid]`: magazine post page with post body, gallery, and lightbox.
- `/[lang]/galerie`: gallery page using Prismic slices and `GalleryYear`.
- `/[lang]/ueber_zyc`: about page with foldouts.
- `/[lang]/impressum` and `/[lang]/datenschutz`: legal text pages.
- `/[lang]/newsletter_confirmed`: newsletter double-opt-in landing page.
- Any other `/[lang]/...` URL: 404 page in the locale layout.
- `/slice-simulator`: Prismic slice simulator route.

## Locales And URL Canonicalization

- German (`de-ch`) is the site's default and lives on bare paths: `/the_contest`. English lives under its prefix: `/en-us/the_contest`. Every page has exactly one URL per locale.
- The Prismic repository's master language is `en-us`, not `de-ch`. This is why the route resolvers in `src/prismicio.ts` use `/:lang` and not `/:lang?`: the optional form drops the prefix for the master language, which would hand the bare URLs to English. Keep `/:lang` when adding routes.
- Because of that, every Prismic-resolved `document.url` carries a locale prefix. `TransitionLink` strips only the `/de-ch` prefix. Links rendered by other Prismic components (rich text, `PrismicNextLink` in the footer) still emit `/de-ch/...` and rely on the middleware's 308. A `linkResolver` on those would be the cleaner fix.
- `stripLocale(pathname)` removes any leading locale segment; use it for route comparisons so they hold in both locales. `useLocaleFromPathname()` returns `'de-ch' | 'en-us'` for client components that get no params, such as the 404 page.
- `LocaleToggle` (header and footer) links to the same path in the other locale. It assumes identical UIDs across locales, so keep magazine post UIDs the same in both languages or the toggle lands on a 404.
- The `routes` array in `prismic.config.json` is the CLI's and does not match the app's routes. The app only reads `repositoryName` from that file; `src/prismicio.ts` is authoritative for URLs.
- `hreflang` alternates are not implemented yet. That is the remaining SEO follow-up.
- Translation work goes through the `zyc-translate` skill into a migration release, never directly to published documents. Do not change the middleware as part of translation work.

## Data And Content Flow

- Server route files fetch Prismic documents with `createClient()` and pass typed documents into client content components.
- Metadata is generated from Prismic `meta_title`, `meta_description`, and `meta_image`.
- Prismic routes are resolved in `src/prismicio.ts`; update that list when adding a new Prismic-backed page type.
- Production Prismic fetches use `force-cache` tagged with `prismic`; `/api/revalidate` calls `revalidateTag('prismic')`.
- Development Prismic fetches use `revalidate: 5`.
- Magazine post galleries (`PostContent.tsx`) filter the `gallery` group with `isFilled.image`. When no item has an image, neither the gallery nor the lightbox renders; the lightbox receives the filtered list, not the whole document.

## Prismic CLI Workflow

- `npx prismic pull` rewrites every model JSON with alphabetically sorted keys. The first pull after a hand edit therefore shows a huge diff that is content-identical. Commit that format; later pulls come back clean.
- The CLI refuses to pull while model files have uncommitted changes. Commit them first. Do not use `push --force` to get past it: it overwrites changes made in the Prismic UI, such as a slice attached to a slice zone.
- Adding a slice in Prismic then pulling gives you `src/slices/<Name>/` with a placeholder component and its registration in `src/slices/index.ts`. Implement the component before the slice is used on a published page, or visitors see the placeholder text.
- Attaching a slice to a page type is a separate pull (it changes `customtypes/<type>/index.json` and the generated document type).

## State Stores

- `FilterStore.ts`: magazine tag filter.
- `SortingStore.ts`: magazine sort order, default `neu`.
- `GalleryFilterStore.ts`: gallery event filter.
- `GalleryYearStore.ts`: gallery year filter, default `alle`.
- `GalleryAnimationStore.ts`: prevents gallery intro animation from replaying.
- `ContactFormStore.ts` and `NewsletterStore.ts`: modal visibility.

## Styling Conventions

- Most component styles live beside components as `*.module.css`.
- Global variables for typography, colors, spacing, borders, and animation timings live in `src/app/globals.css`.
- Breakpoints commonly used:
  - Mobile: `max-width: 48rem`.
  - Tablet: `48rem` to `74rem`. Portrait tablets often share the mobile rules via `(min-width: 48rem) and (max-width: 74rem) and (orientation: portrait)`.
  - Desktop: `min-width: 74rem`.
- The design relies heavily on large responsive CSS variables such as `--page-title`, `--subtitle-l`, and `--padding-l`.
- Cards generally use `border: var(--border-thin)` and `border-radius: 6px`.
- The circle-line-circle decor (used by the locale toggle and the 404 page) is built from spans, not an image.

## Images That Must Not Jump On Load

- On mobile and portrait tablets the hero visual (`src/slices/Hero/index.module.css`) and the poster use a width-driven box: container `width: 100%`, image `width: 100%; height: auto`. With a definite width the browser reserves the box from the image's width/height attributes before the file arrives.
- A height-driven image (`height: 90vh; width: auto`) inside a `fit-content` wrapper has no definite size until load, so it renders at 0 and snaps to full size. Keep that pattern for desktop only.
- Hero visuals pass `sizes` and `priority` to `PrismicNextImage` so phones fetch a phone-sized rendition. In Next 15 `priority` emits a preload link and removes lazy loading; it does not set `fetchpriority` on the img.
- The vertical hero decoration is hidden on those breakpoints; it collapsed to 0 px anyway but flashed at full height while loading.

## Animation Conventions

- `src/app/components/FadeIn/FadeIn.tsx` is the common wrapper for GSAP fade/translate/scale animations. It accepts `vars` and merges them over defaults.
- `src/app/components/RevealText/RevealText.tsx` splits Prismic rich text into words and animates `.reveal-text-word`.
- Scroll-triggered content fades use `gsap.from` with `autoAlpha: 0`, `siteEase` from `src/helpers/siteEase.ts`, and `scrollTrigger: { start: 'top 80%' }`. The poster slice adds `y: 24` and `duration: 1.5` on purpose so it stands out from the text.
- Many page components use fixed intro delays around 1-3 seconds. Be careful when changing mount order because staggered delays are visually coordinated.
- Global view transitions are configured in `src/app/globals.css`.
- Lenis is provided by `src/contexts/LenisContext.tsx`.

## Scroll Indicator

File: `src/app/components/ScrollIndicator/ScrollIndicator.tsx`, mounted once in the root layout.

- One paused GSAP timeline animates the letters (SplitText) and the arrow (DrawSVG). Showing plays it forward, hiding plays it in reverse at 1.5x, so an interrupted entrance retraces itself instead of being cut off.
- It shows 2 s after a route change if the page is still at the top and can scroll, hides on any scroll away from the top, and returns 1 s after scrolling back to the top.
- `EXCLUDED_PAGES` lists routes that never show it, compared through `stripLocale` so both locales match.
- Any page can opt out by rendering an element with `data-hide-scroll-indicator`; the 404 page does.
- The container stays mounted with `visibility: hidden`; the timeline's `onReverseComplete` hides it again.

## Poster Slice

Files: `src/slices/PosterSlice/`, attached to the `the_contest` slice zone.

- Desktop: poster is `90vh` tall and centered. The download icon is absolutely positioned at `left: 100%` of the image container so it never shifts the poster's centering. The icon container needs an explicit width because the reset's `svg { max-width: 100% }` collapses it in a shrink-to-fit box.
- Mobile and portrait tablet: poster is width-driven with a wide horizontal inset (1.5x `--padding-xl`) and a `32rem` cap, so it reads as a poster rather than a full-bleed image; the icon moves into the flow below it.
- `PosterDownloadLink` forces a real download. For `images.prismic.io` URLs it rewrites the query to `?dl=<name>` (imgix serves the original file as an attachment; the default `auto=format,compress` query is dropped so the name matches the format). Other media go through `downloadFile()` (fetch to blob), which also powers the gallery lightbox's download button.

## Magazine: Current BlogContainer Grid Behavior

Files:

- `src/app/[lang]/magazin/components/MagazineContent.tsx`
- `src/app/[lang]/magazin/components/BlogContainer/BlogContainer.tsx`
- `src/app/[lang]/magazin/components/BlogContainer/BlogContainer.module.css`
- `src/app/[lang]/magazin/components/PostPreview/PostPreview.tsx`

Source ordering:

- `MagazineContent` sorts all magazine posts newest-first by `data.publishing_date`.
- It then filters by selected tag.
- `groupPostsByMonth()` groups posts by year/month and sorts month groups newest-first.
- `sorting === 'neu'` keeps newest-first month groups; any other sorting value reverses the month groups.
- Focus/highlighted posts are selected from Prismic tags containing `fokus` and sorted newest-first.
- "Mehr erfahren" links only render when `post.data.has_redirect_link` is set. Stub posts without it are unreachable from the UI.

Current grid CSS:

- `.postsGrid` in `BlogContainer.module.css` is CSS Grid:
  - `display: grid`
  - `grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(12rem + 12vw)), 1fr))`
  - `gap: var(--padding-l)`
- Mobile switches `.postsGrid` to one column.

Important caution:

- The magazine grid is normal CSS Grid row flow. Do not add a masonry/column reordering workaround here unless the CSS layout changes.

## Gallery Grid Behavior

- `src/slices/GalleryYear/index.module.css` uses a CSS Grid wrapper with explicit column stacks for a masonry-like look.
- Desktop uses 4 rendered columns; tablet uses 3 rendered columns; mobile uses 1 column.
- Do not use CSS `columns` here. CSS columns balance by height and fill top-to-bottom, which makes recent images read down a column instead of left-to-right.
- To keep recency reading left-to-right visually, `src/slices/GalleryYear/index.tsx` sorts gallery images by `date_added` descending (`sortByDateAddedDesc` in `src/helpers/gallery.ts`) and then uses `groupImagesIntoVisualColumns()` for the active column count. Image 1 goes to column 1, image 2 to column 2, etc.; image 5 returns to column 1 on desktop.
- The lightbox order is kept chronological by passing each image's `chronologicalIndex` to `onImageClick(sliceOffset + chronologicalIndex)`.
- `src/app/[lang]/galerie/GalleryContent/GalleryContent.tsx` builds `allSlides` from date-sorted copies of each gallery array. Do not call `.sort()` directly on Prismic arrays without copying first.

## API Routes And Environment

- `/api/subscribe`: expects `BREVO_API_KEY` and `BREVO_LIST_ID`.
- `/api/emails/main`: expects `RESEND_TOKEN`.
- Prismic environment can be controlled by `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`; otherwise `prismic.config.json` is used.
- Prismic writes (translation and alt-text skills) need `PRISMIC_WRITE_TOKEN`. Never print or commit it.
- `.env.local` exists locally and should not be committed.

## Known Risks And Cleanup Targets

- `src/contexts/MobileContext.tsx` adds an anonymous `orientationchange` listener but removes `handleResize`; cleanup does not remove the same function reference.
- `src/app/layout.tsx` has a leftover `/* hello */` comment.
- `src/app/[lang]/magazin/[uid]/page.tsx` has a stray nonsense comment.
- Prismic content links (rich text, footer) still render `/de-ch/...` and depend on the middleware redirect; a `linkResolver` would remove the hop.
- No `hreflang` alternates yet.
- Fallow (2026-09-02) flags unused dependencies `dotenv`, `zod`, `@react-email/preview-server`, and `docx`; unused files such as the empty per-page stylesheets, the splash screen, the timer, and the old reveal-line component; and two circular imports inside the foldout slice. `eslint-config-next` is a false positive (loaded as `next/core-web-vitals`).
- There are many client components; some could likely be server components if they only render Prismic content.
- Several pages fetch Prismic documents sequentially where `Promise.all` would be cleaner and faster.
- Some type shapes are loose, for example `string | KeyTextField` in stores where normalized strings would simplify comparisons.
- No test suite is configured. Current safety net is TypeScript plus lint/build, plus browser screenshot checks by hand.
- There are generated/build/local artifacts in the working tree such as `.next/`, `node_modules/`, `.DS_Store`; avoid touching or committing them.

## Working Style For Future Agents

- Prefer existing patterns before introducing new architecture.
- Use Prismic generated document types from `@/prismicio-types` where available.
- Keep visual changes scoped and test responsive breakpoints in both locales.
- Be especially careful with components that combine animation delay, filtering, and ordering. Visual order and source order are not always the same in this project.
- Do not remove client boundaries casually; GSAP, Lenis, Zustand, lightboxes, and browser resize/media-query logic require the browser.
- When adding a page backed by Prismic, update Prismic routes (`/:lang/...`), create or update custom types, add metadata, add the route to `EXCLUDED_PAGES` if the scroll indicator makes no sense there, and check both locales.
- Carlo edits files and Prismic content while a session runs. Re-check the tree and the published content before acting on earlier assumptions.
