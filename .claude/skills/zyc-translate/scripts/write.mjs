// Write assembled en-us payloads to a Prismic migration release.
// Usage: node write.mjs <tmpdir> --only type[/uid]     (trial run, one/few docs)
//        node write.mjs <tmpdir> --all [--except type/uid,type/uid]  (everything else)
// Requires PRISMIC_WRITE_TOKEN in .env.local. Documents land in a migration
// release in Prismic — nothing is published by this script.
import * as prismic from '@prismicio/client';
import { readFileSync } from 'node:fs';

const tmp = process.argv[2];
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
if (!only && !process.argv.includes('--all')) {
  console.error('refusing to run without --only <type[/uid]> or --all');
  process.exit(1);
}

const token = readFileSync('.env.local', 'utf8')
  .split('\n').find((l) => l.startsWith('PRISMIC_WRITE_TOKEN='))
  ?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
if (!token) { console.error('PRISMIC_WRITE_TOKEN not found in .env.local'); process.exit(1); }

const rd = (f) => JSON.parse(readFileSync(`${tmp}/${f}`, 'utf8'));
let payloads = rd('payloads.json');
const en = rd('docs-en-us.json');
const de = rd('docs-de-ch.json');
const enById = new Map(en.map((d) => [d.id, d]));
const deById = new Map(de.map((d) => [d.id, d]));

if (only) {
  const [t, u] = only.split('/');
  payloads = payloads.filter((p) => p.type === t && (u === undefined || p.uid === u));
}
const except = process.argv.includes('--except')
  ? process.argv[process.argv.indexOf('--except') + 1].split(',')
  : [];
payloads = payloads.filter((p) => !except.includes(`${p.type}/${p.uid}`));
if (!payloads.length) { console.error('nothing matches'); process.exit(1); }
console.log(`writing ${payloads.length} docs (${payloads.filter((p) => p.action === 'update').length} updates, ${payloads.filter((p) => p.action === 'create').length} creates)`);

const client = prismic.createWriteClient('zurichyouthclassical', { writeToken: token });
const reporter = (e) => {
  if (e.type === 'documents:creating' || e.type === 'documents:updating')
    console.log(`${e.type} ${e.data.current ?? ''}/${e.data.total ?? ''} ${e.data.document?.title ?? ''}`);
};

// Phase A: creates run one migration each, so an "already has a translation"
// conflict (e.g. an unpublished en-us draft, invisible to the public
// Document API the inventory uses) skips that document instead of killing
// the whole run before any updates happen.
const skipped = [];
for (const p of payloads.filter((x) => x.action === 'create')) {
  const m = prismic.createMigration();
  m.createDocument(
    { type: p.type, uid: p.uid ?? null, lang: 'en-us', tags: p.tags, data: p.data },
    p.title,
    { masterLanguageDocument: deById.get(p.deId) },
  );
  try {
    await client.migrate(m, { reporter });
    console.log(`created: ${p.title}`);
  } catch (e) {
    if (
      String(e.message).includes('already an existing translation') ||
      String(e.message).includes('A document with this UID already exists')
    ) {
      skipped.push(p);
      console.log(`SKIP create ${p.title}: an en-us variant already exists (unpublished draft or earlier run)`);
    } else throw e;
  }
}

// Phase B: updates, one migration each (idempotent, safe to re-run), so a
// single model-validation failure can't block the rest.
const failed = [];
const updates = payloads.filter((x) => x.action === 'update');
for (const [i, p] of updates.entries()) {
  const enDoc = structuredClone(enById.get(p.enId));
  if (!enDoc) { console.error(`SKIP ${p.title}: en doc ${p.enId} not in dump`); continue; }
  enDoc.data = p.data;
  const m = prismic.createMigration();
  m.updateDocument(enDoc, p.title);
  try {
    await client.migrate(m, { reporter: () => {} });
    console.log(`updated ${i + 1}/${updates.length}: ${p.title}`);
  } catch (e) {
    failed.push({ p, details: e.response?.details ?? e.message });
    console.log(`FAILED ${p.title}: ${JSON.stringify(e.response?.details ?? e.message)}`);
  }
}

console.log('\nmigration executed — documents are in the migration release in Prismic (not published)');
if (failed.length) console.log(`update failures: ${failed.length}`);
if (skipped.length)
  console.log(`skipped creates needing manual attention (existing en-us draft the pipeline cannot see): ${skipped.map((p) => `${p.type}/${p.uid}`).join(', ')}`);
