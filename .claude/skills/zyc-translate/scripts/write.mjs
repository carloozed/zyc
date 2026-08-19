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
const migration = prismic.createMigration();

for (const p of payloads) {
  if (p.action === 'update') {
    const enDoc = structuredClone(enById.get(p.enId));
    if (!enDoc) { console.error(`SKIP ${p.title}: en doc ${p.enId} not in dump`); continue; }
    enDoc.data = p.data;
    migration.updateDocument(enDoc, p.title);
  } else {
    const deDoc = deById.get(p.deId);
    migration.createDocument(
      { type: p.type, uid: p.uid ?? null, lang: 'en-us', tags: p.tags, data: p.data },
      p.title,
      { masterLanguageDocument: deDoc },
    );
  }
}

await client.migrate(migration, {
  reporter: (e) => {
    if (e.type === 'documents:creating' || e.type === 'documents:updating')
      console.log(`${e.type} ${e.data.current ?? ''}/${e.data.total ?? ''} ${e.data.document?.title ?? ''}`);
    else if (!String(e.type).includes('assets')) console.log(e.type);
  },
});
console.log('\nmigration executed — documents are in the migration release in Prismic (not published)');
