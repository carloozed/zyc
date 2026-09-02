---
name: zyc-translate
description: Translate ZYC Prismic documents from de-ch (master) to en-us via the Migration API — inventory, Sonnet subagent translation, review gate, migration release. Use when asked to translate site content or create/update English documents in Prismic.
---

# ZYC Prismic translation workflow

Translates documents in the `zurichyouthclassical` Prismic repository from
`de-ch` (master locale) to `en-us`. Writes land in a **migration release**
that Carlo reviews and publishes in Prismic — nothing goes live from this
workflow directly.

## Standing facts

- Repo name: `zurichyouthclassical` (see `prismic.config.json`).
- Locales: `de-ch` (master) → `en-us` (target). The middleware hides
  `/en-us` in production until the language switcher launches, so
  publishing English content early is safe. Do NOT change the middleware
  as part of translation work.
- Read API is public (no token). Writes need `PRISMIC_WRITE_TOKEN` in
  `.env.local` (created in Prismic: Settings → API & Security → Write
  APIs). `.env.local` is gitignored; never commit or print the token.
- `@prismicio/client` ^7.21 is installed — it has `createWriteClient` +
  `createMigration` for the Migration API.
- Scope decision (2026-08-19): main pages + their supporting documents
  first. `magazinpost` documents are phase 2.
- Keep UIDs identical across locales (same slugs for both languages).
- Helper scripts, once written, live in
  `.claude/skills/zyc-translate/scripts/`. Intermediate payloads go in
  `$CLAUDE_JOB_DIR/tmp/` (or another tmp dir), never in the repo.

## Step 0 — Preflight (every run)

1. `cut -d= -f1 .env.local` — confirm `PRISMIC_WRITE_TOKEN` is listed.
   If missing, stop and ask Carlo to add it (never ask for the token in
   chat).
2. Verify the current Migration API contract with WebFetch on
   https://prismic.io/docs/migration-api (and the `@prismicio/client`
   migration docs). Confirm before the first write of a session:
   - how a **created** document is linked as the translation of its
     `de-ch` counterpart (alternate-language / master-language linking),
     so it appears in the document's language dropdown instead of
     becoming an unrelated document;
   - whether the demo `x-api-key` is still required and its current
     value/rate limits (the client may handle this).
3. Dev server on :3000 helps for after-the-fact spot checks but is not
   required for writing.

## Step 1 — Inventory

Write/run a small script (playwright not needed — plain node with
`@prismicio/client`): `dangerouslyGetAll` for both locales, then build a
table per document: type, uid, title, `en-us` exists? (from
`alternate_languages`), stale? (de `last_publication_date` newer than en).

Present the table and confirm scope with Carlo before translating.
Default inclusions: every document whose content renders on the main
pages — the page types (`page`/home, `the_contest`, `the_cadenza`,
`the_crescendo`, `teilnahme_termine`, `magazin`, `uber_zyc`,
`impresssum` (typo in the type id is correct), `datenschutz`, `gallery`)
**plus supporting docs with visible text**: `foldoutelement`, `faq`,
`footer`, `navbar`, `low_navigation`, `subnavigation`,
`homepage_navigation`, `alertoverlay`, `contact_form`,
`newsletter_form`, `download_bar`, `timeline`, `address`, `anmeldelink`,
`dynamiclandingcontent`, `criteriatypesubfield`. Default exclusions:
`magazinpost` (phase 2) and text-free config/visual types
(`decoration_image`, `landing_background_image`, `logo`,
`isdownloadsmuted`, `termine_is_visible`, `navigation_indicator`,
`we_are_here_image`, `instagram_icon`). The inventory decides, not this
list — include anything with translatable text.

## Step 2 — Extract translatable fields

Walk each document's `data` recursively (slices, groups, nested fields):

- **Translate:** KeyText, RichText, link display text (`text` on link
  fields), image `alt` text.
- **Never touch:** ids, uids, image/media references, link targets,
  numbers, booleans, dates, colors, selects, embeds, slice/variation
  ids.
- **Matcher keys — NEVER translate** (they are config, not copy):
  `foldout_name` on Foldout slices and `belongs_to_foldout` on
  `foldoutelement` docs. Code compares them string-equal and even
  hardcodes values (`'contestfaq'`, `'cadenzafaq'` in
  `src/slices/Foldout/ImageSlice/ImageSlice.tsx`). Treat any KeyText
  used as an identifier/matcher the same way — check the slice code
  when unsure.

**RichText:** spans (bold, italic, links) use character start/end
indices — translating text without remapping spans corrupts formatting.
Round-trip through markers: serialize each block's text with inline
markers (e.g. `**bold**`, `[link text](span-0)`), have the subagent
translate the marked-up string, then parse back to text + spans and
validate indices are in bounds. Keep block count and block types
identical.

## Step 3 — Translate with Sonnet subagents

Use the Agent tool with `model: "sonnet"`. Batch a few documents per
agent (roughly 2–4k words). Payload: flat JSON of `{stableKey: string}`;
instruct the agent to return exactly the same JSON shape with translated
values, markers intact, nothing added or dropped.

Translation conventions:

- Natural, idiomatic English for a young-musicians competition site;
  en-US spelling.
- Proper nouns unchanged: Zurich Youth Classical, ZYC, The Contest,
  The Cadenza, The Crescendo, PreCollege, person names, institutions.
- Glossary: Teilnehmer:innen → participants · Jurymitglieder → jury
  members · Anmeldung → registration · Kanton Zürich → Canton of
  Zurich · Teilnahmeberechtigung → eligibility.
- Terminology policy (proofreader feedback, applied 2026-09-02 — see
  `docs/proofread/feedback/feedback-vs-prismic-diff.md`): never call ZYC
  or The Contest a "competition"/"contest" in English. Wettbewerb →
  "The Contest" when it names the event, otherwise rephrase (the
  proofreader used "comparison" for Vergleich-like uses, "process",
  "event"). "Audition(s)" and "Final" are the fixed stage names.
- Gender-inclusive German forms (`:innen`) map to neutral English
  plurals.
- Numeric dates stay dd/mm/yyyy in BOTH locales (Carlo, 2026-08-19: the
  audience is from Zurich and used to it). Only month NAMES are
  localized — never reorder numeric date components.

Validate every returned payload: same keys, markers parse back, no
leftover German. Reject and re-run a batch that fails.

## Step 4 — Review gate (STOP)

Reassemble full `en-us` document payloads. Write them to tmp. Show
Carlo a per-document summary (doc, fields changed, created vs updated)
plus a few sample translations. **Do not write to Prismic until Carlo
approves.**

## Step 5 — Write the migration

`createWriteClient(repositoryName, { writeToken })` +
`createMigration()`. For each document: `en-us` variant exists →
update it; missing → create it linked as the translation of the `de-ch`
document (per the contract verified in Step 0). Then `migrate()` with a
reporter for progress. The client throttles to the API's rate limit
(~1 write/sec) — a full run takes minutes; that's normal.

## Step 6 — Handoff

Tell Carlo: open Prismic → the migration release → review and publish.
After publishing, spot-check `/en-us/...` pages on the dev server
(`/en-us` works in development). Report what was created vs updated and
anything skipped.

## Document naming convention (always check before writing)

The `title` passed to `createDocument`/`updateDocument` is the document's
display name in the Prismic editor list. Carlo filters the list by type, so
repeating the type in the title is redundant — the title must say what the
document contains. Verify every payload's title against this convention
before each write (`updateDocument` renames existing documents, so writes
both fix and can break names):

- `foldoutelement`: `<Parent> - <element title>` — parent derived from
  `belongs_to_foldout` (`contestfaq` → Contest FAQ · `cadenzafaq` → Cadenza
  FAQ · `crescendofaq` → Crescendo FAQ · `juryfaq` → Jury FAQ ·
  `aboutfoldout` → About ZYC; extend `FOLDOUT_PARENTS` in
  `scripts/assemble.mjs` when a new foldout appears), element title from the
  translated `foldout_element_topic` text (uid as fallback).
- Other types: `<type>/<uid> (en)`, uid omitted for singletons.

## Pitfalls

- Prismic returns `[]` (not `undefined`) for empty group fields on
  published docs.
- Don't mutate arrays returned by the Prismic client in place
  (AGENTS.md).
- A document that exists in neither locale can't be "translated" —
  flag it; authoring is a separate ask.
- The public Document API only sees PUBLISHED docs: a doc "missing" in
  en-us may exist as an unpublished draft, and the Migration API then
  rejects the create ("already an existing translation" or "A document
  with this UID already exists" — two message variants, 2026-09-02).
  `write.mjs` skips these and reports them — Carlo publishes or deletes
  the drafts, and a re-run after publishing handles them as plain
  updates.
- The Migration API validates strictly against the CURRENT model; legacy
  published content may violate it (e.g. a paragraph block in a
  heading3-only rich text on the_cadenza, 2026-08). Coerce the block to
  the allowed type when sibling documents agree on it; otherwise discuss
  a model change. The de-ch original keeps the anomaly — flag it.
- `write.mjs` runs every create and update as its own migration call, so
  one failing document can never block the rest (`migrate()` is
  all-or-nothing per call).
- After Carlo publishes a release, run the inventory again: skipped
  drafts and pending title fixes resolve as plain updates on a second
  pass.
- Post-assembly text touch-ups on rich text (e.g. normalizing Swiss
  «guillemets» to English quotes) must be LENGTH-SAFE character swaps —
  span indices are already computed, so any replacement that changes
  string length corrupts formatting.
- Re-runs are cheap: the inventory's stale-check makes this workflow
  the ongoing sync tool, not a one-shot.

## Proofread export

`scripts/build-proofread.sh` regenerates `docs/proofread/proofread-en-us.*`
(gitignored) from published Prismic content; afterwards update the date and
PDF page count in `docs/proofread/README.md` by hand. Content Carlo has
declared STALE is excluded via `STALE_TYPES` / `STALE_FIELDS` at the top of
`scripts/export-proofread.mjs` (since 2026-08-31: `teilnahme_termine`,
`gallery`, `navbar`, `subnavigation`, `anmeldelink`, `download_bar`,
`alertoverlay`, plus `magazin.sorting_options` / `magazin.filter_options`).
The coverage report prints them under "stale, excluded" — remove an entry
when Carlo says the content is current again. Note this only affects the
proofread export; these documents still get translated/synced as normal.
