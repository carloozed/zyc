---
name: zyc-alt-texts
description: Fill missing image alt texts in the ZYC Prismic repository — inventory, Sonnet subagent looks at each image and writes de/en alts, ledger prevents rework, writes land in a migration release. Use when asked to add, fix, or audit image alt texts.
---

# ZYC image alt-text workflow

Finds Prismic image fields with a missing `alt` in both locales (`de-ch`,
`en-us`), has a **Sonnet subagent** look at each image and write descriptive
alt texts, and writes the updates to a **migration release** that Carlo
reviews and publishes in Prismic. A committed ledger records every image
already handled so re-runs never redo work.

Token budget rule: the image viewing and alt writing is the expensive part —
it MUST run in a subagent with `model: "sonnet"`, never in the main (Fable)
context. The main agent only orchestrates, validates, and writes.

## Files

- `scripts/inventory-images.mjs <outdir>` — fetches both locales, dumps them
  to `<outdir>`, lists image fields missing alt, and consults the ledger.
  Writes `<outdir>/missing-alts.json` and prints what needs review vs. what
  the ledger already covers.
- `scripts/apply-alts.mjs <outdir> [--write]` — merges ledger +
  `<outdir>/review-alts.json`, validates every entry, updates the documents
  (dry run by default), and appends newly reviewed images to the ledger
  after a successful write.
- `ledger.json` — image asset id (URL basename) → `{de, en, decided}`.
  Committed to git. An entry with `null` texts means "deliberately left
  empty (decorative)" — the inventory skips it. The ledger is authoritative:
  unpublished release changes are invisible to the public Document API, so
  "alt still missing in the API" does NOT mean "not yet handled".

## Workflow

1. **Preflight** — `cut -d= -f1 .env.local` must list `PRISMIC_WRITE_TOKEN`
   (never print or ask for the value). Use a tmp dir under the scratchpad
   for `<outdir>`.
2. **Inventory** — `node .claude/skills/zyc-alt-texts/scripts/inventory-images.mjs <outdir>`.
   If everything is covered by the ledger, skip to step 4.
3. **Subagent review** — spawn ONE general-purpose agent with
   `model: "sonnet"`. Give it verbatim: the list of images needing review
   from `missing-alts.json` (unique `imageId` + `url` + `context`), the
   style guide below, and these instructions: for each image, download
   `<url>?w=600` into the tmp dir with curl (append `&fm=jpg` for .webp),
   Read the file to actually look at it, then write one German and one
   English alt text. Save the result as `<outdir>/review-alts.json` shaped
   `{ "<imageId>": { "de": "…", "en": "…" } }` — exactly the given ids, no
   extras. The subagent must report which images it could not interpret.
4. **Validate + write** — dry-run `apply-alts.mjs <outdir>`, check its
   output (every entry `ok`, texts sensible — spot-check 1–2 against the
   images if the subagent's output looks doubtful). Then run with `--write`.
   Writes go one migration call per document; de-ch documents are updated
   WITHOUT a title so their editor names stay untouched; en-us documents use
   the naming convention (`<type>/<uid> (en)`, foldoutelements
   `<Parent> - <topic>`). The script updates `ledger.json` afterwards —
   commit that change.
5. **Handoff** — tell Carlo the documents are in the migration release in
   Prismic, ready to review and publish.

## Alt-text style guide (for the subagent prompt)

- Describe what is actually in the picture, concisely (aim ≤ 120 chars).
  Lead with the subject: who/what, doing what, where.
- German for de-ch with inclusive forms (`Musiker:innen`, `Pianist:innen`);
  US English for en-us. The two texts describe the same thing, idiomatic in
  each language — not word-for-word translations.
- Name people only when the context row makes them identifiable (e.g. a
  jury portrait with the member's name) — never guess identities.
- Text-heavy graphics (posters, quote cards): state the type and transcribe
  the key content, e.g. "Einladungsplakat: ZYC Qualifikation, 6.-8. März
  2026 …". Dates stay numeric dd.mm. in German, "March 6-8, 2026" style in
  English.
- Logos: "Logo von Zurich Youth Classical (ZYC)" / "Zurich Youth Classical
  (ZYC) logo".
- No quotation marks or guillemets inside alt texts.
- Only if an image is genuinely uninterpretable: "Bild von Zurich Youth
  Classical" / "Image from Zurich Youth Classical", and flag it.

## Pitfalls

- **Pending release edits get clobbered**: an update built from the
  published dump replaces the document's copy in the migration release. If
  other unpublished work is in flight for a document (check the session
  context / ask Carlo), re-apply those edits in the same payload — see the
  2026-09-02 feedback-edit run for the pattern.
- The scripts set the same alt on an image field's nested responsive views;
  rich-text image blocks are image fields too and are handled.
- An image reused across documents/locales is reviewed once (keyed by asset
  id) and filled everywhere.
- Never overwrite a non-empty alt — the scripts refuse; narrowing or fixing
  existing alts is a separate, explicit ask.
- The Migration API validates against the CURRENT custom types: a document
  carrying since-removed fields is rejected — strip the stale keys from the
  payload (e.g. `past_title` on the_contest's jury_grid, 2026-09-02).
- Frontend images outside Prismic (raw `<img>`, emails) are not covered
  here; last audited 2026-09-02, all had alts.
