import { werkzeugFuer, werkzeugSvg, zufall, LOCHWAND } from './werkzeuge.js';
import { ablageOeffnen, eintrag, groesse, sorte } from './ablage.js';

const ALLEE = 'https://jade-hs-vibecoding-wpk.github.io/.github/';
const QUELLE = `${ALLEE}projects.json`;
const SELBST = 'Jade-Werkbank';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- Lochwand ----------
$('#haken').innerHTML = LOCHWAND.map((t) => `<span class="haengt" title="${t.titel}" style="width:${t.b}px">${t.svg}</span>`).join('');

// ---------- Projekte laden ----------
let projekte = [];

async function laden() {
  try {
    const r = await fetch(QUELLE, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    $('#quelle').innerHTML = `Werkzeuge live aus der <a href="${ALLEE}">Vibecoding-Allee</a> · Stand ${new Date(j.generatedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}`;
    return j.projects;
  } catch (e) {
    console.warn('Allee nicht erreichbar, nehme die mitgelieferte Liste:', e);
    const j = await (await fetch('projekte.json')).json();
    $('#quelle').textContent = 'Die Allee ist gerade nicht erreichbar, hier liegt die mitgelieferte Liste.';
    return j.projects;
  }
}

function werkzeugKarte(p, i) {
  const w = werkzeugFuer(p);
  const dreh = (zufall(p.name) - 0.5) * 22;
  const versatz = (zufall(p.name + 'y') - 0.5) * 10;
  return `<li class="werkzeug${p.demo ? '' : ' ohne-demo'}" style="--dreh:${dreh.toFixed(1)}deg;--versatz:${versatz.toFixed(1)}px;--i:${i}">
    <button type="button" data-i="${i}" aria-label="${esc(w.name)}: ${esc(p.title || p.name)}">
      ${werkzeugSvg(w, { drehen: dreh * 0.6 })}
      <span class="anhaenger"><small>${p.number ?? ''}</small>${esc(p.title || p.name)}</span>
    </button>
  </li>`;
}

function auslegen() {
  const n = projekte.length, links = Math.ceil(n / 2);
  $('#werkzeuge-links').innerHTML = projekte.slice(0, links).map((p, i) => werkzeugKarte(p, i)).join('');
  $('#werkzeuge-rechts').innerHTML = projekte.slice(links).map((p, i) => werkzeugKarte(p, i + links)).join('');
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('.werkzeug button');
  if (b) zeigen(+b.dataset.i);
});

// ---------- Werkzeugschein ----------
const schein = $('#schein');
let aktuell = -1;

function zeigen(i, { verlauf = true } = {}) {
  const p = projekte[i];
  if (!p) return;
  aktuell = i;
  const w = werkzeugFuer(p);
  $('#schein-werkzeug').innerHTML = werkzeugSvg(w);
  $('#schein-ueber').textContent = `Haus ${p.number ?? '–'} · ${w.name}`;
  $('#schein-titel').textContent = p.title || p.name;
  $('#schein-warum').textContent = w.warum;
  $('#schein-text').textContent = p.description || 'Noch ohne Beschreibung.';
  const img = $('#schein-vorschau');
  img.hidden = !p.image;
  if (p.image) { img.src = p.image; img.onerror = () => { img.hidden = true; }; }
  $('#schein-team').innerHTML = (p.team ?? []).map((t) => `<li><a href="${esc(t.url)}" target="_blank" rel="noopener"><img src="${esc(t.avatar)}&s=48" alt="" width="24" height="24" loading="lazy">${esc(t.login)}</a></li>`).join('');
  const demo = $('#schein-demo');
  $('#schein-ohne').hidden = !!p.demo;
  $('#schein-probe').hidden = !p.demo;
  demo.hidden = !p.demo;
  if (p.demo) demo.href = p.demo;
  $('#schein-code').href = p.url;
  $('#schein-allee').href = `${ALLEE}#${encodeURIComponent(p.name)}`;
  if (!schein.open) schein.showModal();
  if (verlauf) history.replaceState(null, '', `#${encodeURIComponent(p.name)}`);
}

function scheinZu() {
  if (schein.open) schein.close();
}
schein.addEventListener('close', () => {
  if (probe.hidden) history.replaceState(null, '', location.pathname + location.search);
});
schein.addEventListener('click', (e) => {
  if (e.target === schein || e.target.closest('[data-close]')) scheinZu();
});

// ---------- Ausprobieren ----------
const probe = $('#probe');
let rahmen = $('#probe-rahmen');

// jedes Mal ein frischer Rahmen: ein laufender Ladevorgang hängt sonst am alten
function neuerRahmen(src) {
  const neu = rahmen.cloneNode(false);
  neu.removeAttribute('src');
  neu.addEventListener('load', () => brueckeBauen(neu));
  rahmen.replaceWith(neu);
  rahmen = neu;
  if (src) rahmen.src = src;
}

function ausprobieren(i) {
  const p = projekte[i];
  if (!p?.demo) return;
  scheinZu();
  $('#probe-titel').textContent = p.title || p.name;
  $('#probe-werkzeug').innerHTML = werkzeugSvg(werkzeugFuer(p));
  $('#probe-tab').href = p.demo;
  neuerRahmen(p.demo);
  probe.hidden = false;
  document.body.classList.add('probiert');
  history.replaceState(null, '', `#${encodeURIComponent(p.name)}/probe`);
  $('#probe-zu').focus();
}

function probeZu() {
  probe.hidden = true;
  neuerRahmen(null);
  document.body.classList.remove('probiert');
  history.replaceState(null, '', location.pathname + location.search);
}

// ---------- Brücke: Zettel ins Werkzeug legen ----------
// Browser geben beim Ziehen in einen anderen Rahmen nur Text weiter, nicht die Datei.
// Die Demos liegen aber auf derselben Adresse wie die Werkbank (github.io der Organisation),
// also legt die Werkbank die Datei selbst hinein: als Drop an der Stelle oder ins Dateifeld.
function rahmenDoc() {
  try { return rahmen.contentDocument?.defaultView ? rahmen.contentDocument : null; } catch { return null; }
}

function akzeptiert(accept, rec) {
  if (!accept) return true;
  const ext = `.${(rec.name.split('.').pop() || '').toLowerCase()}`;
  return accept.split(',').map((a) => a.trim().toLowerCase()).some((a) =>
    a === ext || a === rec.type || (a.endsWith('/*') && rec.type.startsWith(a.slice(0, -1))));
}

function insWerkzeug(id, punkt) {
  const rec = zettel.find((r) => r.id === id);
  const doc = rahmenDoc();
  if (!rec) return 'weg';
  if (!doc) return 'fremd';
  const W = doc.defaultView;
  const datei = new W.File([rec.blob], rec.name, { type: rec.type || 'application/octet-stream', lastModified: rec.added });
  const paket = () => { const dt = new W.DataTransfer(); dt.items.add(datei); return dt; };
  const fallen = (ziel, x, y) => {
    const o = { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y };
    ziel.dispatchEvent(new W.DragEvent('dragenter', { ...o, dataTransfer: paket() }));
    ziel.dispatchEvent(new W.DragEvent('dragover', { ...o, dataTransfer: paket() }));
    return !ziel.dispatchEvent(new W.DragEvent('drop', { ...o, dataTransfer: paket() }));
  };
  // 1. dort fallen lassen, wo losgelassen wurde
  if (punkt && fallen(doc.elementFromPoint(punkt.x, punkt.y) ?? doc.body, punkt.x, punkt.y)) return 'drop';
  // 2. ein passendes Dateifeld befüllen
  const felder = [...doc.querySelectorAll('input[type=file]:not([disabled])')];
  const feld = felder.find((f) => akzeptiert(f.accept, rec));
  if (feld) {
    feld.files = paket().files;
    feld.dispatchEvent(new W.Event('input', { bubbles: true }));
    feld.dispatchEvent(new W.Event('change', { bubbles: true }));
    return 'feld';
  }
  // 3. ohne Ort: in die Mitte fallen lassen
  if (!punkt) {
    const x = W.innerWidth / 2, y = W.innerHeight / 2;
    if (fallen(doc.elementFromPoint(x, y) ?? doc.body, x, y)) return 'drop';
  }
  return 'nichts';
}

function einlegenMelden(ergebnis, id) {
  const name = zettel.find((r) => r.id === id)?.name ?? 'Datei';
  toast({
    drop: `„${name}“ liegt jetzt im Werkzeug.`,
    feld: `„${name}“ steckt jetzt im Dateifeld des Werkzeugs.`,
    nichts: 'Das Werkzeug nimmt hier keine Datei an. Lade sie mit ↓ herunter und öffne sie dort.',
    fremd: 'Dieses Werkzeug lässt sich von außen nicht befüllen. Lade die Datei mit ↓ herunter.',
    weg: 'Die Datei liegt nicht mehr in der Ablage.',
  }[ergebnis]);
}

function brueckeBauen(f) {
  if (f !== rahmen) return;
  const doc = rahmenDoc();
  if (!doc) return;
  const unser = (e) => [...(e.dataTransfer?.types ?? [])].includes('application/x-werkbank');
  doc.addEventListener('dragover', (e) => {
    if (!unser(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, true);
  doc.addEventListener('drop', (e) => {
    if (!unser(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const id = e.dataTransfer.getData('application/x-werkbank');
    einlegenMelden(insWerkzeug(id, { x: e.clientX, y: e.clientY }), id);
  }, true);
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ein]');
  if (b) einlegenMelden(insWerkzeug(b.dataset.ein), b.dataset.ein);
});

$('#schein-probe').addEventListener('click', () => ausprobieren(aktuell));
$('#probe-zu').addEventListener('click', probeZu);
$('#probe-ablage-knopf').addEventListener('click', (e) => {
  const an = probe.classList.toggle('ohne-ablage');
  e.currentTarget.setAttribute('aria-pressed', String(!an));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !probe.hidden && !schein.open && !$('#notiz').open) probeZu();
});

// ---------- Schublade ----------
$('#schublade').addEventListener('click', (e) => {
  const ueber = $('#ueber');
  ueber.hidden = !ueber.hidden;
  e.currentTarget.setAttribute('aria-expanded', String(!ueber.hidden));
  e.currentTarget.classList.toggle('offen', !ueber.hidden);
});

// ---------- Ablage ----------
const store = await ablageOeffnen();
let zettel = [];
const urls = new Map();

function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('da');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('da'), 2600);
}

function zettelHtml(rec, i) {
  const { sorte: s, ext } = sorte(rec);
  const url = urls.get(rec.id);
  const dreh = ((zufall(rec.id) - 0.5) * 5).toFixed(1);
  const bild = s === 'bild' || s === 'vektor'
    ? `<img src="${url}" alt="">`
    : `<span class="ext">${esc(ext || '?')}</span>`;
  const datum = new Date(rec.added).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `<li class="zettel sorte-${s}" draggable="true" data-id="${rec.id}" style="--dreh:${dreh}deg;--i:${i}">
    <span class="zettel-bild">${bild}</span>
    <span class="zettel-text"><b title="${esc(rec.name)}">${esc(rec.name)}</b><small>${groesse(rec.size)} · ${datum}</small></span>
    <span class="zettel-knoepfe">
      <button type="button" class="mini nur-probe" data-ein="${rec.id}" title="Ins Werkzeug legen" aria-label="${esc(rec.name)} ins Werkzeug legen">←</button>
      <a class="mini" href="${url}" download="${esc(rec.name)}" title="Herunterladen" aria-label="${esc(rec.name)} herunterladen">↓</a>
      <button type="button" class="mini" data-weg="${rec.id}" title="Wegräumen" aria-label="${esc(rec.name)} wegräumen">×</button>
    </span>
  </li>`;
}

async function neuZeichnen() {
  zettel = (await store.alle()).sort((a, b) => b.added - a.added);
  const ids = new Set(zettel.map((z) => z.id));
  for (const [id, u] of urls) if (!ids.has(id)) { URL.revokeObjectURL(u); urls.delete(id); }
  for (const z of zettel) if (!urls.has(z.id)) urls.set(z.id, URL.createObjectURL(z.blob));
  const html = zettel.map(zettelHtml).join('');
  $('#zettel-liste').innerHTML = html;
  $('#probe-liste').innerHTML = html;
  const summe = zettel.reduce((s, z) => s + z.size, 0);
  $('#ablage-zahl').textContent = zettel.length ? `${zettel.length} ${zettel.length === 1 ? 'Datei' : 'Dateien'} · ${groesse(summe)}` : '';
  $('#ablage-leer').hidden = zettel.length > 0;
  $('#ablage-leeren').hidden = zettel.length === 0;
  $('#ablage').classList.toggle('voll', zettel.length > 0);
  if (!store.dauerhaft) $('#ablage-hinweis').textContent = 'Dieser Browser erlaubt keinen Speicher: die Ablage hält nur bis zum Neuladen.';
}

let dauerhaftGefragt = false;
async function ablegen(dateien) {
  const liste = [...dateien].filter((d) => d && d.size >= 0);
  if (!liste.length) return;
  try {
    for (const d of liste) await store.rein(eintrag(d));
  } catch (e) {
    console.error(e);
    toast('Konnte nicht ablegen. Ist der Speicher voll?');
    return;
  }
  if (!dauerhaftGefragt && navigator.storage?.persist) { dauerhaftGefragt = true; navigator.storage.persist().catch(() => {}); }
  await neuZeichnen();
  toast(liste.length === 1 ? `„${liste[0].name}“ liegt in der Ablage.` : `${liste.length} Dateien liegen in der Ablage.`);
}

document.addEventListener('click', async (e) => {
  const weg = e.target.closest('[data-weg]');
  if (weg) {
    await store.raus(weg.dataset.weg);
    await neuZeichnen();
  }
});

$('#ablage-leeren').addEventListener('click', async () => {
  if (!confirm(`Alle ${zettel.length} Dateien aus der Ablage wegräumen? Das lässt sich nicht rückgängig machen.`)) return;
  await store.leeren();
  await neuZeichnen();
  toast('Ablage ist leer.');
});

for (const id of ['#datei-wahl', '#probe-wahl']) {
  $(id).addEventListener('change', (e) => { ablegen(e.target.files); e.target.value = ''; });
}

// Zettel herausziehen: auf den Desktop (Chrome) oder in ein Werkzeug, das Dateien annimmt
document.addEventListener('dragstart', (e) => {
  const z = e.target.closest?.('.zettel');
  if (!z) return;
  const rec = zettel.find((r) => r.id === z.dataset.id);
  if (!rec) return;
  const dt = e.dataTransfer;
  dt.effectAllowed = 'copy';
  dt.setData('application/x-werkbank', rec.id);
  try { dt.items.add(new File([rec.blob], rec.name, { type: rec.type || 'application/octet-stream' })); } catch { /* nicht überall erlaubt */ }
  const url = urls.get(rec.id);
  dt.setData('DownloadURL', `${rec.type || 'application/octet-stream'}:${rec.name}:${url}`);
  dt.setData('text/uri-list', url);
  dt.setData('text/plain', rec.name);
  z.classList.add('zieht');
});
document.addEventListener('dragend', (e) => e.target.closest?.('.zettel')?.classList.remove('zieht'));

// Dateien von außen annehmen, überall auf der Seite
let ziehTiefe = 0;
const vonAussen = (e) => e.dataTransfer && [...e.dataTransfer.types].includes('Files') && ![...e.dataTransfer.types].includes('application/x-werkbank');
const ziel = () => (probe.hidden ? $('#ablage') : $('#probe-ablage'));

window.addEventListener('dragenter', (e) => {
  if (!vonAussen(e)) return;
  e.preventDefault();
  ziehTiefe++;
  ziel().classList.add('drueber');
});
window.addEventListener('dragover', (e) => {
  if (!vonAussen(e)) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('dragleave', (e) => {
  if (!vonAussen(e)) return;
  if (--ziehTiefe <= 0) { ziehTiefe = 0; document.querySelectorAll('.drueber').forEach((el) => el.classList.remove('drueber')); }
});
window.addEventListener('drop', (e) => {
  ziehTiefe = 0;
  document.querySelectorAll('.drueber').forEach((el) => el.classList.remove('drueber'));
  if (!vonAussen(e)) return;
  e.preventDefault();
  ablegen(e.dataTransfer.files);
});

// Einfügen mit Strg+V: Dateien und Bilder, sonst Text als Notiz
document.addEventListener('paste', (e) => {
  if (e.target.closest?.('input, textarea, [contenteditable]')) return;
  const cd = e.clipboardData;
  if (!cd) return;
  const files = [...cd.files];
  if (files.length) {
    e.preventDefault();
    const stamp = zeitstempel();
    ablegen(files.map((f, i) => (f.name && f.name !== 'image.png' ? f : new File([f], `Eingefügt-${stamp}${files.length > 1 ? `-${i + 1}` : ''}.${(f.type.split('/')[1] || 'bin').replace('jpeg', 'jpg')}`, { type: f.type }))));
    return;
  }
  const text = cd.getData('text/plain');
  if (text?.trim()) {
    e.preventDefault();
    ablegen([new File([text], `Notiz-${zeitstempel()}.txt`, { type: 'text/plain' })]);
  }
});

function zeitstempel() {
  const d = new Date(), p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

// Notizzettel schreiben
const notiz = $('#notiz');
$('#notiz-neu').addEventListener('click', () => {
  $('#notiz-name').value = '';
  $('#notiz-text').value = '';
  notiz.showModal();
  $('#notiz-text').focus();
});
notiz.addEventListener('close', () => {
  const text = $('#notiz-text').value;
  if (notiz.returnValue !== 'ok' || !text.trim()) return;
  let name = $('#notiz-name').value.trim().replace(/[\\/:*?"<>|]+/g, '-') || `Notiz-${zeitstempel()}`;
  if (!/\.[a-z0-9]{1,5}$/i.test(name)) name += '.txt';
  ablegen([new File([text], name, { type: 'text/plain' })]);
});

// ---------- Start ----------
await neuZeichnen();
projekte = (await laden())
  .filter((p) => p.name !== SELBST)
  .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
auslegen();
document.body.classList.add('bereit');

const [hashName, hashModus] = decodeURIComponent(location.hash.slice(1)).split('/');
const start = projekte.findIndex((p) => p.name === hashName);
if (start >= 0) (hashModus === 'probe' && projekte[start].demo ? ausprobieren : zeigen)(start);
