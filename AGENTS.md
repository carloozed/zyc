# AGENTS.md

This file is the working guide for coding agents in this repository. Keep it current when changing architecture, routing, data flow, or layout behavior that is easy to misunderstand later.

## Project Snapshot

- App: Zurich Youth Classical website.
- Framework: Next.js 15 App Router, React 19, TypeScript strict mode.
- CMS: Prismic with Slice Machine custom types in `customtypes/` and generated types in `prismicio-types.d.ts` plus `src/prismicio-types.ts`.
- Styling: CSS Modules for components and slices, global design tokens in `src/app/globals.css`.
- Animation: GSAP via `@gsap/react`, plus `next-view-transitions` and Lenis smooth scrolling.
- Client state: small Zustand stores in `src/stores/`.
- Forms/integrations: Resend contact email route and Brevo newsletter subscription route.

## Commands

- `npm run dev`: runs Next dev server and Slice Machine together.
- `npm run next:dev`: runs only Next dev server.
- `npm run slicemachine`: runs Slice Machine.
- `npm run email`: runs React Email preview.
- `npm run build`: production build.
- `npm run lint`: Next lint.
- `npx tsc --noEmit`: TypeScript check.
- `npm run format`: Prettier write across the repo.

When validating normal code changes, run at least `npx tsc --noEmit` and `npm run lint`.

## Important Paths

- `src/app/layout.tsx`: root layout. Wraps the app in `ViewTransitions`, `Providers`, global Lenis provider, signup button, scroll indicator, Simple Analytics script, and `PrismicPreview`.
- `src/app/[lang]/layout.tsx`: locale layout. Adds `AlertOverlay`, navigation, footer, newsletter form, and contact form around localized pages.
- `src/middleware.ts`: locale rewrite middleware. Fetches Prismic repository languages once, rewrites missing-locale paths to `de-ch`, and redirects `/en-us` in non-development environments.
- `src/prismicio.ts`: Prismic client factory, route resolver list, cache settings, and preview enabling.
- `src/slices/index.ts`: SliceZone component registry.
- `customtypes/`: Prismic document and slice model definitions.
- `src/app/api/`: API routes for Prismic preview, cache revalidation, Brevo subscribe, and Resend emails.

## Route Map

- `/[lang]`: landing page, Prismic `page` UID `home`, homepage navigation, dynamic landing content, background, and event visibility.
- `/[lang]/the_contest`: contest page with criteria, foldouts, signup link, downloads mute state, and "we are here" icon.
- `/[lang]/the_cadenza`: Cadenza page with foldouts and signup link.
- `/[lang]/the_crescendo`: Crescendo page with foldouts and signup link. Note the component/file spelling is currently `CreschendoContent`.
- `/[lang]/termine`: dates/schedule page with signup link.
- `/[lang]/magazin`: magazine index with filters, sorting, focus posts, and grouped month sections.
- `/[lang]/magazin/[uid]`: magazine post page with post body, gallery, and lightbox.
- `/[lang]/galerie`: gallery page using Prismic slices and `GalleryYear`.
- `/[lang]/ueber_zyc`: about page with foldouts.
- `/[lang]/impressum` and `/[lang]/datenschutz`: legal text pages.
- `/slice-simulator`: Prismic Slice Machine simulator.

## Data And Content Flow

- Server route files fetch Prismic documents with `createClient()` and pass typed documents into client content components.
- Metadata is generated from Prismic `meta_title`, `meta_description`, and `meta_image`.
- Prismic routes are resolved in `src/prismicio.ts`; update that list when adding a new Prismic-backed page type.
- Production Prismic fetches use `force-cache` tagged with `prismic`; `/api/revalidate` calls `revalidateTag('prismic')`.
- Development Prismic fetches use `revalidate: 5`.

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
  - Tablet: `48rem` to `74rem`.
  - Desktop: `min-width: 74rem`.
- The design relies heavily on large responsive CSS variables such as `--page-title`, `--subtitle-l`, and `--padding-l`.
- Cards generally use `border: var(--border-thin)` and `border-radius: 6px`.

## Animation Conventions

- `src/app/components/FadeIn/FadeIn.tsx` is the common wrapper for GSAP fade/translate/scale animations. It accepts `vars` and merges them over defaults.
- `src/app/components/RevealText/RevealText.tsx` splits Prismic rich text into words and animates `.reveal-text-word`.
- Many page components use fixed intro delays around 1-3 seconds. Be careful when changing mount order because staggered delays are visually coordinated.
- Global view transitions are configured in `src/app/globals.css`.
- Lenis is provided by `src/contexts/LenisContext.tsx`.

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

Current grid CSS:

- `.postsGrid` in `BlogContainer.module.css` is CSS Grid:
  - `display: grid`
  - `grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(12rem + 12vw)), 1fr))`
  - `gap: var(--padding-l)`
- Mobile switches `.postsGrid` to one column.

Current ordering workaround:

- `BlogContainer.tsx` defines `MASONRY_ROW_COUNT = 4` and `MASONRY_LAYOUT_QUERY = '(min-width: 48rem)'`.
- On tablet/desktop widths, `orderPostsForColumnFilledLayout(group.posts, 4)` reorders the render array so a layout that visually fills top-to-bottom in four rows still reads newest-to-oldest left-to-right.
- On mobile widths, the component renders the original date-sorted `group.posts` order so the one-column feed remains chronological.
- The `index` passed to `PostPreview` remains the original chronological index so animation delay still follows date order rather than the transformed render order.

Important caution:

- If the magazine grid CSS changes from column-filled/masonry-like behavior to normal CSS Grid row flow, revisit `orderPostsForColumnFilledLayout()`. With a normal row-major grid, that helper is no longer needed and can make the visual order wrong.

## Gallery Grid Contrast

- `src/slices/GalleryYear/index.module.css` uses CSS columns: `columns: 4 250px`.
- CSS columns naturally fill top-to-bottom before moving to the next column.
- If gallery images ever need left-to-right chronological order, use a similar ordering transform or switch away from CSS columns.

## API Routes And Environment

- `/api/subscribe`: expects `BREVO_API_KEY` and `BREVO_LIST_ID`.
- `/api/emails/main`: expects `RESEND_TOKEN`.
- Prismic environment can be controlled by `NEXT_PUBLIC_PRISMIC_ENVIRONMENT`; otherwise Slice Machine config is used.
- `.env.local` exists locally and should not be committed.

## Known Risks And Cleanup Targets

- `src/contexts/MobileContext.tsx` adds an anonymous `orientationchange` listener but removes `handleResize`; cleanup does not remove the same function reference.
- `src/app/layout.tsx` has a leftover `/* hello */` comment.
- `src/app/[lang]/magazin/[uid]/page.tsx` has a stray nonsense comment.
- There are many client components; some could likely be server components if they only render Prismic content.
- Several pages fetch Prismic documents sequentially where `Promise.all` would be cleaner and faster.
- `GalleryContent` sorts `slice.primary.gallery` in place inside `useMemo`; avoid mutating Prismic-provided arrays.
- Some type shapes are loose, for example `string | KeyTextField` in stores where normalized strings would simplify comparisons.
- No test suite is configured. Current safety net is TypeScript plus lint/build.
- There are generated/build/local artifacts in the working tree such as `.next/`, `node_modules/`, `.DS_Store`; avoid touching or committing them.

## Working Style For Future Agents

- Prefer existing patterns before introducing new architecture.
- Use Prismic generated document types from `@/prismicio-types` where available.
- Keep visual changes scoped and test responsive breakpoints.
- Be especially careful with components that combine animation delay, filtering, and ordering. Visual order and source order are not always the same in this project.
- Do not remove client boundaries casually; GSAP, Lenis, Zustand, lightboxes, and browser resize/media-query logic require the browser.
- When adding a page backed by Prismic, update Prismic routes, create or update custom types, add metadata, and check locale behavior.
