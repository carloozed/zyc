// Model-driven extraction of translatable strings from de-ch documents.
// Usage: node extract.mjs <tmpdir>   (expects <tmpdir>/docs-de-ch.json)
// Writes <tmpdir>/extraction.json: entries keyed docId::path, plus flags.
// Field types come from customtypes/*/index.json and src/slices/*/model.json,
// so Selects/config strings can never be mistaken for copy.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const tmp = process.argv[2];
// Optional: --types a,b restricts extraction to ONLY those types (phase 2+).
const only = process.argv.includes('--types')
  ? new Set(process.argv[process.argv.indexOf('--types') + 1].split(','))
  : null;
const docs = JSON.parse(readFileSync(`${tmp}/docs-de-ch.json`, 'utf8'));

const EXCLUDED_TYPES = new Set([
  'magazinpost', // phase 2
  'decoration_image', 'instagram_icon', 'isdownloadsmuted', 'landing_background_image',
  'logo', 'navigation_indicator', 'termine_is_visible', 'we_are_here_image',
]);
// Matcher keys: compared string-equal in code (see SKILL.md) — never translate.
const MATCHER_KEYS = new Set(['foldout_name', 'belongs_to_foldout']);

// ---- load models ----------------------------------------------------------
const typeModels = {};
for (const dir of readdirSync('customtypes')) {
  const p = `customtypes/${dir}/index.json`;
  if (!existsSync(p)) continue;
  const m = JSON.parse(readFileSync(p, 'utf8'));
  const fields = {};
  for (const tab of Object.values(m.json)) Object.assign(fields, tab);
  typeModels[m.id] = fields;
}
const sliceModels = {};
for (const dir of readdirSync('src/slices')) {
  const p = `src/slices/${dir}/model.json`;
  if (!existsSync(p)) continue;
  const m = JSON.parse(readFileSync(p, 'utf8'));
  sliceModels[m.id] = m;
}

// ---- rich text markers ----------------------------------------------------
// Serialize block text+spans to a marker string: ⟦0⟧…⟦/0⟧. Span metadata is
// kept aside under the entry; the translator only moves the markers.
function serializeBlock(block) {
  const spans = (block.spans ?? []).map((s, i) => ({ ...s, n: i }));
  // events: closes before opens at same position; longer spans open first
  const opens = [...spans].sort((a, b) => a.start - b.start || b.end - a.end);
  const closes = [...spans].sort((a, b) => a.end - b.end || b.start - a.start);
  let out = '';
  let oi = 0, ci = 0;
  for (let pos = 0; pos <= block.text.length; pos++) {
    while (ci < closes.length && closes[ci].end === pos) out += `⟦/${closes[ci++].n}⟧`;
    while (oi < opens.length && opens[oi].start === pos) out += `⟦${opens[oi++].n}⟧`;
    if (pos < block.text.length) out += block.text[pos];
  }
  return out;
}
function parseMarked(marked, spanMeta) {
  let text = '';
  const open = {};
  const spans = [];
  const re = /⟦(\/?)(\d+)⟧/g;
  let last = 0, m;
  while ((m = re.exec(marked))) {
    text += marked.slice(last, m.index);
    last = re.lastIndex;
    const n = Number(m[2]);
    if (m[1]) {
      if (!(n in open)) throw new Error(`close without open: ${n}`);
      const meta = spanMeta[n];
      spans.push({ ...meta, start: open[n], end: text.length });
      delete open[n];
    } else {
      if (n in open || n >= spanMeta.length) throw new Error(`bad open: ${n}`);
      open[n] = text.length;
    }
  }
  text += marked.slice(last);
  if (Object.keys(open).length) throw new Error('unclosed span');
  if (spans.length !== spanMeta.length) throw new Error('span count mismatch');
  spans.sort((a, b) => a.start - b.start || a.end - b.end);
  return { text, spans };
}
const stripN = (s) => s.map(({ n, start, end, ...meta }) => ({ ...meta }));
const cmpSpans = (a, b) =>
  JSON.stringify([...a].sort((x, y) => x.start - y.start || x.end - y.end).map(({ start, end, type }) => [start, end, type])) ===
  JSON.stringify([...b].sort((x, y) => x.start - y.start || x.end - y.end).map(({ start, end, type }) => [start, end, type]));

// ---- walker ---------------------------------------------------------------
const entries = [];   // {key, docId, path, kind, value, spanMeta?}
const flags = [];     // things needing attention
let richImageAlts = 0;

function addText(doc, path, kind, value, spanMeta) {
  if (typeof value !== 'string' || !value.trim()) return;
  entries.push({ key: `${doc.id}::${path}`, docId: doc.id, path, kind, value, ...(spanMeta ? { spanMeta } : {}) });
}

function handleField(doc, def, val, path, keyName) {
  if (val == null || !def) return;
  switch (def.type) {
    case 'Text':
      if (MATCHER_KEYS.has(keyName)) return;
      addText(doc, path, 'text', val);
      return;
    case 'StructuredText': {
      if (!Array.isArray(val)) return;
      val.forEach((block, i) => {
        if (block.type === 'image') { if (block.alt) richImageAlts++; return; }
        if (typeof block.text !== 'string' || !block.text.trim()) return;
        const marked = serializeBlock(block);
        // self-test round trip on the German source
        try {
          const back = parseMarked(marked, stripN(block.spans ?? []));
          if (back.text !== block.text || !cmpSpans(back.spans, block.spans ?? []))
            throw new Error('roundtrip mismatch');
        } catch (e) {
          flags.push(`${doc.type}/${doc.uid ?? doc.id} ${path}[${i}]: rich text not round-trippable (${e.message})`);
          return;
        }
        addText(doc, `${path}[${i}]`, 'rich', marked, stripN(block.spans ?? []));
      });
      return;
    }
    case 'Image':
      if (val.alt) addText(doc, `${path}.alt`, 'alt', val.alt);
      return;
    case 'Link':
      if (val.text) addText(doc, `${path}.text`, 'linktext', val.text);
      return;
    case 'Group': {
      if (!Array.isArray(val)) return;
      val.forEach((item, i) => {
        for (const [k, subdef] of Object.entries(def.config?.fields ?? {}))
          handleField(doc, subdef, item[k], `${path}[${i}].${k}`, k);
      });
      return;
    }
    case 'Slices': {
      if (!Array.isArray(val)) return;
      val.forEach((slice, i) => {
        const sm = sliceModels[slice.slice_type];
        const variation = sm?.variations?.find((v) => v.id === slice.variation);
        if (!variation) { flags.push(`${doc.type}/${doc.uid ?? doc.id}: no model for slice ${slice.slice_type}/${slice.variation}`); return; }
        for (const [k, subdef] of Object.entries(variation.primary ?? {}))
          handleField(doc, subdef, slice.primary?.[k], `${path}[${i}].primary.${k}`, k);
        (slice.items ?? []).forEach((item, j) => {
          for (const [k, subdef] of Object.entries(variation.items ?? {}))
            handleField(doc, subdef, item[k], `${path}[${i}].items[${j}].${k}`, k);
        });
      });
      return;
    }
    default:
      return; // Number, Boolean, Date, Select, Color, Embed, UID, ContentRelationship…
  }
}

const inScope = docs.filter((d) => (only ? only.has(d.type) : !EXCLUDED_TYPES.has(d.type)));
for (const doc of inScope) {
  const fields = typeModels[doc.type];
  if (!fields) { flags.push(`no custom type model for ${doc.type}`); continue; }
  for (const [k, v] of Object.entries(doc.data)) {
    if (!fields[k]) { if (v && (!Array.isArray(v) || v.length)) flags.push(`${doc.type}/${doc.uid ?? doc.id}: field '${k}' not in model (legacy, skipped)`); continue; }
    handleField(doc, fields[k], v, k, k);
  }
}

writeFileSync(`${tmp}/extraction.json`, JSON.stringify({ entries, flags }, null, 1));

const perDoc = {};
for (const e of entries) {
  const d = docs.find((x) => x.id === e.docId);
  const label = `${d.type}/${d.uid ?? '-'}`;
  perDoc[label] = (perDoc[label] ?? 0) + e.value.length;
}
const total = entries.reduce((s, e) => s + e.value.length, 0);
console.log(`in scope: ${inScope.length} docs · ${entries.length} strings · ${total} chars (~${Math.round(total / 5)} words)`);
console.log(`rich-text image alts skipped: ${richImageAlts}`);
console.log(`\nlargest docs:`);
Object.entries(perDoc).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(`  ${String(v).padStart(6)} chars  ${k}`));
if (flags.length) { console.log(`\nFLAGS (${flags.length}):`); flags.forEach((f) => console.log('  ' + f)); }
