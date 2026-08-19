// Validate translated batches and assemble full en-us document payloads.
// Usage: node assemble.mjs <tmpdir>
// Reads docs-*.json, extraction.json, batch-*.json, out-*.json.
// Writes payloads.json (create/update actions with full data) + prints review.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const tmp = process.argv[2];
const rd = (f) => JSON.parse(readFileSync(`${tmp}/${f}`, 'utf8'));
const de = rd('docs-de-ch.json');
const en = rd('docs-en-us.json');
const { entries } = rd('extraction.json');
const enById = new Map(en.map((d) => [d.id, d]));
const deById = new Map(de.map((d) => [d.id, d]));

// ---- gather translations --------------------------------------------------
const translated = {};
const problems = [];
for (const bf of readdirSync(tmp).filter((f) => /^batch-\d+\.json$/.test(f))) {
  const n = bf.match(/\d+/)[0];
  const batch = rd(bf);
  let out;
  try { out = rd(`out-${n}.json`); } catch { problems.push(`out-${n}.json missing/unparsable`); continue; }
  for (const k of Object.keys(batch)) {
    if (!(k in out) || typeof out[k] !== 'string' || !out[k].trim()) problems.push(`batch ${n}: missing/empty key ${k}`);
    else translated[k] = out[k];
  }
  for (const k of Object.keys(out)) if (!(k in batch)) problems.push(`batch ${n}: unexpected key ${k}`);
}

// ---- marker parsing (same as extract.mjs) ---------------------------------
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
      spans.push({ ...spanMeta[n], start: open[n], end: text.length });
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

// ---- path helpers ---------------------------------------------------------
function pathTokens(path) {
  return [...path.matchAll(/([^[.\]]+)|\[(\d+)\]/g)].map((m) => (m[2] !== undefined ? Number(m[2]) : m[1]));
}
function getAt(obj, tokens) { return tokens.reduce((o, t) => (o == null ? o : o[t]), obj); }
function setAt(obj, tokens, fn) {
  const parent = getAt(obj, tokens.slice(0, -1));
  const k = tokens.at(-1);
  if (parent == null || parent[k] === undefined) throw new Error(`path not found`);
  parent[k] = fn(parent[k]);
}

// ---- de->en document link remapping ---------------------------------------
let linkRemapped = 0;
const linkUnmapped = [];
function remapLinks(node, docLabel) {
  if (Array.isArray(node)) { node.forEach((v) => remapLinks(v, docLabel)); return; }
  if (!node || typeof node !== 'object') return;
  if (node.link_type === 'Document' && node.lang === 'de-ch' && node.id) {
    const target = deById.get(node.id);
    const alt = target?.alternate_languages?.find((a) => a.lang === 'en-us');
    if (alt) {
      node.id = alt.id;
      node.lang = 'en-us';
      if (alt.uid !== undefined) node.uid = alt.uid;
      linkRemapped++;
    } else {
      linkUnmapped.push(`${docLabel}: link to ${node.type}/${node.uid ?? node.id} has no en-us variant`);
    }
  }
  Object.values(node).forEach((v) => remapLinks(v, docLabel));
}

// ---- German leftover heuristic (soft) -------------------------------------
const DE_RE = /\b(der|die|das|und|für|mit|nicht|werden|sind|eine?|wir|sie|bei|auf|zum|zur|über)\b/i;

// ---- assemble -------------------------------------------------------------
const byDoc = new Map();
for (const e of entries) {
  if (!byDoc.has(e.docId)) byDoc.set(e.docId, []);
  byDoc.get(e.docId).push(e);
}

const payloads = [];
const overwriteSamples = [];
const germanish = [];
for (const [docId, es] of byDoc) {
  const deDoc = deById.get(docId);
  const label = `${deDoc.type}/${deDoc.uid ?? 'single'}`;
  const data = structuredClone(deDoc.data);
  const alt = deDoc.alternate_languages.find((a) => a.lang === 'en-us');
  const enDoc = alt ? enById.get(alt.id) : undefined;
  let applied = 0;
  for (const e of es) {
    const t = translated[e.key];
    if (t === undefined) { problems.push(`${label}: no translation for ${e.path}`); continue; }
    if (DE_RE.test(e.kind === 'rich' ? t.replace(/⟦\/?\d+⟧/g, '') : t)) germanish.push(`${label} ${e.path}: ${t.slice(0, 80)}`);
    const tokens = pathTokens(e.path);
    try {
      if (e.kind === 'rich') {
        const { text, spans } = parseMarked(t, e.spanMeta);
        setAt(data, tokens, (block) => ({ ...block, text, spans }));
      } else {
        setAt(data, tokens, () => t);
      }
      applied++;
    } catch (err) {
      problems.push(`${label} ${e.path}: ${err.message}`);
      continue;
    }
    // overwrite warning: existing en value differs from BOTH de source and new translation
    if (enDoc) {
      const prev = getAt(enDoc.data, tokens);
      const prevStr = e.kind === 'rich' ? prev?.text : (e.kind === 'alt' || e.kind === 'linktext' ? prev : prev);
      const newStr = e.kind === 'rich' ? parseMarked(t, e.spanMeta).text : t;
      const srcStr = e.kind === 'rich' ? e.value.replace(/⟦\/?\d+⟧/g, '') : e.value;
      if (typeof prevStr === 'string' && prevStr.trim() && prevStr !== srcStr && prevStr !== newStr)
        overwriteSamples.push({ doc: label, path: e.path, prev: prevStr.slice(0, 90), next: newStr.slice(0, 90) });
    }
  }
  remapLinks(data, label);
  payloads.push({
    action: enDoc ? 'update' : 'create',
    type: deDoc.type,
    uid: deDoc.uid ?? undefined,
    deId: deDoc.id,
    enId: enDoc?.id,
    tags: deDoc.tags,
    title: `${label} (en)`,
    strings: applied,
    data,
  });
}

writeFileSync(`${tmp}/payloads.json`, JSON.stringify(payloads, null, 1));

const creates = payloads.filter((p) => p.action === 'create');
console.log(`assembled ${payloads.length} docs · ${payloads.filter((p) => p.action === 'update').length} updates · ${creates.length} creates`);
if (creates.length) console.log('creates: ' + creates.map((c) => `${c.type}/${c.uid}`).join(', '));
console.log(`document links remapped de->en: ${linkRemapped}`);
if (linkUnmapped.length) { console.log(`links WITHOUT en-us target (${linkUnmapped.length}):`); [...new Set(linkUnmapped)].forEach((l) => console.log('  ' + l)); }
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); problems.slice(0, 30).forEach((p) => console.log('  ' + p)); }
else console.log('\nno structural problems — all keys returned, all markers parsed');
if (germanish.length) { console.log(`\npossibly-untranslated (soft heuristic, ${germanish.length}):`); germanish.slice(0, 20).forEach((g) => console.log('  ' + g)); }
if (overwriteSamples.length) {
  console.log(`\nexisting distinct en-us values being overwritten (${overwriteSamples.length}):`);
  overwriteSamples.slice(0, 25).forEach((o) => console.log(`  ${o.doc} ${o.path}\n    old: ${o.prev}\n    new: ${o.next}`));
}
