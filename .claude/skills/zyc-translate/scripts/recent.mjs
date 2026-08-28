// Documents published recently in either locale, with en-us sync status.
// Usage: node .claude/skills/zyc-translate/scripts/recent.mjs <tmpdir> [days=4]   (run inventory.mjs <tmpdir> first)
import { readFileSync } from 'node:fs';
const tmp = process.argv[2];
const days = Number(process.argv[3] || 4);
const since = new Date(Date.now() - days * 864e5);
const de = JSON.parse(readFileSync(`${tmp}/docs-de-ch.json`, 'utf8'));
const en = JSON.parse(readFileSync(`${tmp}/docs-en-us.json`, 'utf8'));
const enById = new Map(en.map((d) => [d.id, d]));
const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 16).replace('T', ' ') : '—');
const rows = [];
for (const d of de) {
  const alt = d.alternate_languages.find((a) => a.lang === 'en-us');
  const enDoc = alt ? enById.get(alt.id) : undefined;
  const deRecent = new Date(d.last_publication_date) >= since;
  const enRecent = enDoc && new Date(enDoc.last_publication_date) >= since;
  if (!deRecent && !enRecent) continue;
  const status = !alt ? 'MISSING' : !enDoc ? 'EN-UNPUBLISHED' : new Date(d.last_publication_date) > new Date(enDoc.last_publication_date) ? 'STALE' : 'ok';
  rows.push({ type: d.type, uid: d.uid || '—', deId: d.id, enId: enDoc?.id || alt?.id || '—', de: fmt(d.last_publication_date), en: fmt(enDoc?.last_publication_date), status });
}
rows.sort((a, b) => a.de < b.de ? 1 : -1);
console.log(`since ${since.toISOString().slice(0,10)} · ${rows.length} docs touched (de or en)\n`);
console.log('STATUS          TYPE                  UID                        DE published      EN published      DE id / EN id');
for (const r of rows) console.log(`${r.status.padEnd(15)} ${r.type.padEnd(21)} ${r.uid.padEnd(26)} ${r.de.padEnd(17)} ${r.en.padEnd(17)} ${r.deId} / ${r.enId}`);
// en-us docs recently published that have no de counterpart in the table
const deAlt = new Set(de.flatMap((d) => d.alternate_languages.map((a) => a.id)));
const orphans = en.filter((d) => !deAlt.has(d.id) && new Date(d.last_publication_date) >= since);
if (orphans.length) console.log('\nrecent en-us docs not linked from de-ch: ' + orphans.map((d) => `${d.type}/${d.uid || d.id}`).join(', '));
