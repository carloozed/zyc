// Inventory of Prismic image fields missing alt text, both locales.
// Usage: node .claude/skills/zyc-alt-texts/scripts/inventory-images.mjs <outdir>
// Dumps both locales to <outdir> (reused by apply-alts.mjs), writes
// <outdir>/missing-alts.json and prints needs-review vs. ledger-covered.
import * as prismic from '@prismicio/client';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outdir = process.argv[2];
if (!outdir) { console.error('usage: inventory-images.mjs <outdir>'); process.exit(1); }
const ledgerPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'ledger.json');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

const client = prismic.createClient('zurichyouthclassical');
const [de, en] = await Promise.all([
  client.dangerouslyGetAll({ lang: 'de-ch' }),
  client.dangerouslyGetAll({ lang: 'en-us' }),
]);
writeFileSync(`${outdir}/docs-de-ch.json`, JSON.stringify(de, null, 1));
writeFileSync(`${outdir}/docs-en-us.json`, JSON.stringify(en, null, 1));

const isImage = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) && 'dimensions' in v && 'url' in v && 'alt' in v;
const imageId = (url) => decodeURIComponent(new URL(url).pathname.split('/').pop());

// First text in the document, as a context hint for the reviewer.
function docLabel(doc) {
  let found = '';
  (function walk(v) {
    if (found) return;
    if (typeof v === 'string' && v.trim().length > 2 && !v.startsWith('http')) found = v;
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object' && !('dimensions' in v)) {
      if (typeof v.text === 'string' && v.text.trim()) found = v.text;
      else Object.values(v).forEach(walk);
    }
  })(doc.data);
  return found.replace(/\s+/g, ' ').slice(0, 80);
}

const entries = [];
for (const [lang, docs] of [['de-ch', de], ['en-us', en]]) {
  for (const doc of docs) {
    (function walk(v, path, inside) {
      if (isImage(v)) {
        if (!inside && v.url && (!v.alt || !String(v.alt).trim()))
          entries.push({
            lang,
            docKey: `${doc.type}/${doc.uid ?? 'single'}`,
            path,
            url: v.url.split('?')[0],
            imageId: imageId(v.url),
            context: docLabel(doc),
          });
        for (const [k, x] of Object.entries(v)) if (isImage(x)) walk(x, `${path}.${k}`, true);
        return;
      }
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, inside));
      else if (v && typeof v === 'object')
        for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k, inside);
    })(doc.data, '', false);
  }
}

writeFileSync(`${outdir}/missing-alts.json`, JSON.stringify({ generated: new Date().toISOString(), entries }, null, 1));

const langKey = (lang) => (lang === 'de-ch' ? 'de' : 'en');
const needsReview = new Map();
let covered = 0, decorative = 0;
for (const e of entries) {
  const known = ledger[e.imageId];
  if (known && known[langKey(e.lang)] === null) decorative++;
  else if (known && known[langKey(e.lang)]) covered++;
  else {
    if (!needsReview.has(e.imageId)) needsReview.set(e.imageId, { ...e, uses: [] });
    needsReview.get(e.imageId).uses.push(`${e.lang} ${e.docKey} :: ${e.path}`);
  }
}

console.log(`${entries.length} image fields missing alt (${covered} covered by ledger, ${decorative} deliberately empty)`);
console.log(`${needsReview.size} unique images NEED REVIEW:\n`);
for (const [id, e] of needsReview) {
  console.log(`imageId: ${id}`);
  console.log(`  url: ${e.url}`);
  console.log(`  context: ${e.context}`);
  for (const u of e.uses) console.log(`  used: ${u}`);
}
if (!needsReview.size && (covered || decorative))
  console.log('nothing to review — run apply-alts.mjs to fill from the ledger');
if (!entries.length) console.log('nothing to do — every image has an alt text');
