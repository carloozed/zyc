// Apply alt texts from the ledger + a review round to the documents listed
// in <outdir>/missing-alts.json, one migration call per document.
// Usage: node .claude/skills/zyc-alt-texts/scripts/apply-alts.mjs <outdir> [--write]
// Dry run by default. On a successful --write, new review entries are merged
// into ledger.json (commit that change).
import * as prismic from '@prismicio/client';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outdir = process.argv[2];
if (!outdir) { console.error('usage: apply-alts.mjs <outdir> [--write]'); process.exit(1); }
const dryRun = !process.argv.includes('--write');

const ledgerPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'ledger.json');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
const review = existsSync(`${outdir}/review-alts.json`)
  ? JSON.parse(readFileSync(`${outdir}/review-alts.json`, 'utf8'))
  : {};
const { entries } = JSON.parse(readFileSync(`${outdir}/missing-alts.json`, 'utf8'));
const dumps = {
  'de-ch': JSON.parse(readFileSync(`${outdir}/docs-de-ch.json`, 'utf8')),
  'en-us': JSON.parse(readFileSync(`${outdir}/docs-en-us.json`, 'utf8')),
};

const isImage = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) && 'dimensions' in v && 'url' in v && 'alt' in v;
const resolvePath = (obj, path) => {
  let cur = obj;
  for (const p of path.match(/[^.[\]]+/g)) cur = cur?.[/^\d+$/.test(p) ? Number(p) : p];
  return cur;
};
const langKey = (lang) => (lang === 'de-ch' ? 'de' : 'en');

// Editor display names (en-us only; de-ch updates omit the title so the
// existing name is kept). Convention: see zyc-translate SKILL.md.
const FOLDOUT_PARENTS = {
  contestfaq: 'Contest FAQ', cadenzafaq: 'Cadenza FAQ', crescendofaq: 'Crescendo FAQ',
  juryfaq: 'Jury FAQ', aboutfoldout: 'About ZYC',
};
function enTitle(doc) {
  if (doc.type === 'foldoutelement') {
    const parent = FOLDOUT_PARENTS[doc.data.belongs_to_foldout] ?? doc.data.belongs_to_foldout;
    const topic = doc.data.foldout_element_topic?.find((b) => b.text?.trim())?.text?.trim();
    return `${parent} - ${topic ?? doc.uid}`;
  }
  return `${doc.type}${doc.uid ? '/' + doc.uid : ''} (en)`;
}

// Group entries per document, resolve each alt from ledger/review.
const byDoc = new Map();
let ok = true, skippedDecorative = 0;
for (const e of entries) {
  const source = ledger[e.imageId] ?? review[e.imageId];
  if (!source) { console.error(`BAD no alt available for ${e.imageId} (${e.lang} ${e.docKey})`); ok = false; continue; }
  const alt = source[langKey(e.lang)];
  if (alt === null) { skippedDecorative++; continue; }
  if (!alt || !String(alt).trim()) { console.error(`BAD empty ${langKey(e.lang)} alt for ${e.imageId}`); ok = false; continue; }
  const k = `${e.lang}:${e.docKey}`;
  if (!byDoc.has(k)) byDoc.set(k, []);
  byDoc.get(k).push({ ...e, alt });
}

const updates = [];
for (const [k, es] of byDoc) {
  const [lang, docKey] = [k.slice(0, 5), k.slice(6)];
  const [type, uid] = docKey.split('/');
  const doc = structuredClone(
    dumps[lang].find((d) => d.type === type && (uid === 'single' ? d.uid == null : d.uid === uid)),
  );
  if (!doc) { console.error(`BAD doc not found: ${k}`); ok = false; continue; }
  for (const e of es) {
    const field = resolvePath(doc.data, e.path);
    if (!isImage(field)) { console.error(`BAD not an image: ${k} ${e.path}`); ok = false; continue; }
    if (field.alt && String(field.alt).trim()) { console.error(`BAD alt already set (refusing to overwrite): ${k} ${e.path}`); ok = false; continue; }
    field.alt = e.alt;
    for (const v of Object.values(field)) if (isImage(v) && (!v.alt || !String(v.alt).trim())) v.alt = e.alt;
    console.log(`ok  ${k} :: ${e.path}\n      -> ${e.alt}`);
  }
  updates.push({ lang, docKey, doc, title: lang === 'en-us' ? enTitle(doc) : undefined });
}

if (!ok) { console.error('\nvalidation failed — nothing written'); process.exit(1); }
if (skippedDecorative) console.log(`${skippedDecorative} fields skipped (ledger: deliberately empty)`);
console.log(`\n${updates.length} documents to update (${dryRun ? 'DRY RUN, pass --write to execute' : 'writing now'})`);
if (dryRun || !updates.length) process.exit(0);

const token = readFileSync('.env.local', 'utf8')
  .split('\n').find((l) => l.startsWith('PRISMIC_WRITE_TOKEN='))
  ?.split('=').slice(1).join('=').trim();
if (!token) { console.error('PRISMIC_WRITE_TOKEN not found in .env.local'); process.exit(1); }

const client = prismic.createWriteClient('zurichyouthclassical', { writeToken: token });
let failures = 0;
for (const [i, u] of updates.entries()) {
  const m = prismic.createMigration();
  m.updateDocument(u.doc, u.title);
  try {
    await client.migrate(m, { reporter: () => {} });
    console.log(`updated ${i + 1}/${updates.length}: ${u.lang} ${u.docKey}`);
  } catch (e) {
    failures++;
    console.log(`FAILED ${u.lang} ${u.docKey}: ${JSON.stringify(e.response?.details ?? e.message)}`);
  }
}

if (!failures) {
  const today = new Date().toISOString().split('T')[0];
  let added = 0;
  for (const [id, texts] of Object.entries(review)) {
    if (!ledger[id]) { ledger[id] = { ...texts, decided: today }; added++; }
  }
  if (added) {
    writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
    console.log(`ledger updated (+${added} images) — commit ledger.json`);
  }
}
console.log(`\ndone — documents are in the migration release (not published)${failures ? `; ${failures} FAILURES (ledger NOT updated)` : ''}`);
