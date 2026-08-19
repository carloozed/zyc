// Inventory of Prismic documents in both locales.
// Usage: node .claude/skills/zyc-translate/scripts/inventory.mjs <outdir>
// Writes <outdir>/docs-de-ch.json and <outdir>/docs-en-us.json (full documents,
// reused by later steps) and prints a per-document status table.
import * as prismic from '@prismicio/client';
import { writeFileSync } from 'node:fs';

const outdir = process.argv[2] || '.';
const client = prismic.createClient('zurichyouthclassical');

const [de, en] = await Promise.all([
  client.dangerouslyGetAll({ lang: 'de-ch' }),
  client.dangerouslyGetAll({ lang: 'en-us' }),
]);
writeFileSync(`${outdir}/docs-de-ch.json`, JSON.stringify(de, null, 1));
writeFileSync(`${outdir}/docs-en-us.json`, JSON.stringify(en, null, 1));

const enById = new Map(en.map((d) => [d.id, d]));

// First text-ish value in the document, as a human label for the table.
function label(doc) {
  const found = [];
  (function walk(v) {
    if (found.length) return;
    if (typeof v === 'string' && v.trim().length > 2) found.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      if (typeof v.text === 'string' && v.text.trim()) found.push(v.text);
      else Object.values(v).forEach(walk);
    }
  })(doc.data);
  return (found[0] || '').replace(/\s+/g, ' ').slice(0, 40);
}

const rows = de
  .map((d) => {
    const alt = d.alternate_languages.find((a) => a.lang === 'en-us');
    const enDoc = alt ? enById.get(alt.id) : undefined;
    const status = !alt
      ? 'MISSING'
      : enDoc && new Date(d.last_publication_date) > new Date(enDoc.last_publication_date)
        ? 'STALE'
        : 'ok';
    return { type: d.type, uid: d.uid || '—', status, label: label(d) };
  })
  .sort((a, b) => a.type.localeCompare(b.type) || (a.uid || '').localeCompare(b.uid || ''));

console.log(`de-ch: ${de.length} docs · en-us: ${en.length} docs\n`);
console.log('STATUS   TYPE                      UID                        LABEL');
for (const r of rows)
  console.log(`${r.status.padEnd(8)} ${r.type.padEnd(25)} ${String(r.uid).padEnd(26)} ${r.label}`);

// en-us docs with no de-ch counterpart (shouldn't happen, but flag)
const deAltIds = new Set(de.flatMap((d) => d.alternate_languages.map((a) => a.id)));
const orphans = en.filter((d) => !deAltIds.has(d.id));
if (orphans.length)
  console.log(`\nen-us docs not linked from any de-ch doc: ${orphans.map((d) => `${d.type}/${d.uid || d.id}`).join(', ')}`);
