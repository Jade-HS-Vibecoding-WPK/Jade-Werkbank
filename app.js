import { PROJEKTE, BLOECKE } from './projekte.js';
import { symbolBild, dateiBild, texturen, zufall } from './pixel.js';
import { ablageOeffnen, eintrag, groesse, sorte } from './ablage.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- Texturen ----------
const tex = texturen();
const wurzel = document.documentElement.style;
const url = (u) => `url("${u}")`;
wurzel.setProperty('--tex-wb-seite', url(tex.werkbankSeite));
wurzel.setProperty('--tex-wb-oben', url(tex.werkbankOben));
wurzel.setProperty('--tex-kt-seite', url(tex.kartentischSeite));
wurzel.setProperty('--tex-kt-oben', url(tex.kartentischOben));
wurzel.setProperty('--tex-erde', url(tex.erde));
wurzel.setProperty('--tex-gras', url(tex.gras));
wurzel.setProperty('--tex-stein', url(tex.stein));

// ---------- Blöcke ----------
const anzahl = Object.keys(PROJEKTE).length;

function ziel(p) {
  return p.status === 'voll' ? p.demo : p.code;
}

function itemHtml(repo, gruppe, block) {
  const p = PROJEKTE[repo];
  if (!p) return '';
  const dreh = ((zufall(repo)() - 0.5) * 14).toFixed(1);
  const art = p.status === 'voll' ? 'Live-Demo' : 'Code auf GitHub, Demo eingeschränkt';
  return `<li>
    <a class="item" href="${esc(ziel(p))}" target="_blank" rel="noopener"
       data-repo="${esc(repo)}" data-gruppe="${esc(gruppe)}" data-block="${esc(block)}"
       aria-label="${esc(p.titel)}: ${esc(p.funktion)} (${art})" style="--dreh:${dreh}deg">
      <span class="pendel"><img src="${symbolBild(p.symbol)}" alt="" draggable="false"><span class="glanz"></span></span>
    </a>
  </li>`;
}

function seiteHtml(gruppen, block) {
  return gruppen.map((g) => `
    <div class="reihe">
      <h3 class="schild">${esc(g.titel)}</h3>
      <ul class="haken" style="--proreihe:${g.projekte.length === 5 ? 3 : 4}">
        ${g.projekte.map((r) => itemHtml(r, g.titel, block)).join('')}
      </ul>
    </div>`).join('');
}

for (const b of BLOECKE) {
  const el = $(`#block-${b.id}`);
  el.innerHTML = `<div class="wuerfel">
    <div class="seite oben"></div>
    <div class="seite links">${seiteHtml(b.seiten.links, b.name)}</div>
    <div class="seite rechts">${seiteHtml(b.seiten.rechts, b.name)}</div>
  </div>`;
  const n = [...b.seiten.links, ...b.seiten.rechts].reduce((s, g) => s + g.projekte.length, 0);
  $(`#info-${b.id}`).textContent = `${b.info} · ${n} Werkzeuge`;
}

// Glanz-Maske: die Symbolgrafik selbst
for (const a of document.querySelectorAll('.item')) {
  a.style.setProperty('--sprite', url(symbolBild(PROJEKTE[a.dataset.repo].symbol)));
}

// ---------- Splash ----------
const SPRÜCHE = [
  `${anzahl} Werkzeuge!`,
  'Jetzt mit Kartentisch!',
  'Strg+V geht auch!',
  'Mit KI gebaut!',
  'Frisch aus der Allee!',
  'Blockwoche 2026!',
  'Nach Funktion sortiert!',
  'Pixel für Pixel!',
];
$('#splash').textContent = SPRÜCHE[Math.floor(Math.random() * SPRÜCHE.length)];

// ---------- Tooltip ----------
const tip = $('#tooltip');
let tipFuer = null;

function tipFuellen(a) {
  const p = PROJEKTE[a.dataset.repo];
  const voll = p.status === 'voll';
  tip.innerHTML = `
    <b>${esc(p.titel)}</b>
    <span class="tt-text">${esc(p.funktion)}</span>
    <span class="tt-gruppe">${esc(a.dataset.block)} · ${esc(a.dataset.gruppe)}</span>
    ${voll
      ? '<span class="tt-ziel ok">▶ Klick öffnet die Live-Demo</span>'
      : `<span class="tt-ziel warn">⚠ Demo eingeschränkt: Klick öffnet GitHub</span><span class="tt-hinweis">${esc(p.hinweis ?? '')}</span>`}`;
  tip.hidden = false;
  tipFuer = a;
}

function tipSetzen(x, y) {
  const r = tip.getBoundingClientRect();
  let lx = x + 18, ly = y - r.height - 10;
  if (lx + r.width > innerWidth - 8) lx = x - r.width - 18;
  if (ly < 8) ly = y + 24;
  if (ly + r.height > innerHeight - 8) ly = innerHeight - r.height - 8;
  tip.style.transform = `translate(${Math.max(8, Math.round(lx))}px, ${Math.round(ly)}px)`;
}

function tipAmElement(a) {
  const r = a.getBoundingClientRect();
  tipFuellen(a);
  tipSetzen(r.right, r.top + r.height / 2);
}

function tipWeg() {
  tip.hidden = true;
  tipFuer = null;
}

document.addEventListener('pointerover', (e) => {
  if (e.pointerType === 'touch') return;
  const a = e.target.closest?.('.item');
  if (a && a !== tipFuer) { tipFuellen(a); tipSetzen(e.clientX, e.clientY); }
});
document.addEventListener('pointermove', (e) => {
  if (tipFuer && e.pointerType !== 'touch') tipSetzen(e.clientX, e.clientY);
});
document.addEventListener('pointerout', (e) => {
  if (e.pointerType === 'touch') return;
  const a = e.target.closest?.('.item');
  if (a && !a.contains(e.relatedTarget) && !a.matches(':focus-visible')) tipWeg();
});
document.addEventListener('focusin', (e) => {
  const a = e.target.closest?.('.item');
  if (a && a.matches(':focus-visible')) tipAmElement(a);
});
document.addEventListener('focusout', (e) => {
  if (e.target.closest?.('.item')) tipWeg();
});

// Auf dem Handy: erstes Tippen wählt aus und zeigt den Tooltip, zweites Tippen öffnet
let letzterZeiger = 'mouse';
document.addEventListener('pointerdown', (e) => { letzterZeiger = e.pointerType; }, true);
document.addEventListener('click', (e) => {
  const a = e.target.closest('.item');
  if (!a) {
    if (letzterZeiger === 'touch') { document.querySelector('.item.gewaehlt')?.classList.remove('gewaehlt'); tipWeg(); }
    return;
  }
  if (letzterZeiger !== 'touch' || a.classList.contains('gewaehlt')) return;
  e.preventDefault();
  document.querySelector('.item.gewaehlt')?.classList.remove('gewaehlt');
  a.classList.add('gewaehlt');
  tipAmElement(a);
});
addEventListener('scroll', () => {
  if (!tipFuer) return;
  document.querySelector('.item.gewaehlt')?.classList.remove('gewaehlt');
  tipWeg();
}, { passive: true });

// ---------- Ablage ----------
const store = await ablageOeffnen();
let zettel = [];
let neueIds = new Set();
const urls = new Map();

function toast(titel, text) {
  $('#toast-titel').textContent = titel;
  $('#toast-text').textContent = text;
  const t = $('#toast');
  t.classList.add('da');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('da'), 2800);
}

function zeileHtml(rec) {
  const { sorte: s, ext } = sorte(rec);
  const u = urls.get(rec.id);
  const bildSrc = s === 'bild' || s === 'vektor' ? u : dateiBild(s);
  const zeit = new Date(rec.added).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `<li class="zeile${neueIds.has(rec.id) ? ' neu' : ''}" draggable="true" data-id="${rec.id}">
    <img class="z-bild" src="${bildSrc}" alt="" draggable="false">
    <span class="z-text"><b title="${esc(rec.name)}">${esc(rec.name)}</b><small>${esc(ext ? ext.toUpperCase() : 'Datei')} · ${groesse(rec.size)} · ${zeit}</small></span>
    <a class="z-aktion" href="${u}" download="${esc(rec.name)}" title="Herunterladen" aria-label="${esc(rec.name)} herunterladen">[↓]</a>
    <button type="button" class="z-aktion weg" data-weg="${rec.id}" title="Wegräumen" aria-label="${esc(rec.name)} wegräumen">[×]</button>
  </li>`;
}

async function neuZeichnen() {
  zettel = (await store.alle()).sort((a, b) => b.added - a.added);
  const ids = new Set(zettel.map((z) => z.id));
  for (const [id, u] of urls) if (!ids.has(id)) { URL.revokeObjectURL(u); urls.delete(id); }
  for (const z of zettel) if (!urls.has(z.id)) urls.set(z.id, URL.createObjectURL(z.blob));
  $('#zettel-liste').innerHTML = zettel.map(zeileHtml).join('');
  neueIds = new Set();
  const summe = zettel.reduce((s, z) => s + z.size, 0);
  $('#ablage-zahl').textContent = zettel.length ? `${zettel.length} ${zettel.length === 1 ? 'Datei' : 'Dateien'} · ${groesse(summe)}` : 'leer';
  $('#ablage-leer').hidden = zettel.length > 0;
  $('#ablage-leeren').hidden = zettel.length === 0;
  if (!store.dauerhaft) $('#ablage-hinweis').textContent = 'Dieser Browser erlaubt keinen Speicher: Die Ablage hält nur bis zum Neuladen.';
}

let dauerhaftGefragt = false;
async function ablegen(dateien) {
  const liste = [...dateien].filter((d) => d && d.size >= 0);
  if (!liste.length) return;
  try {
    for (const d of liste) {
      const rec = eintrag(d);
      neueIds.add(rec.id);
      await store.rein(rec);
    }
  } catch (e) {
    console.error(e);
    toast('Nicht abgelegt', 'Konnte nicht ablegen. Ist der Speicher voll?');
    return;
  }
  if (!dauerhaftGefragt && navigator.storage?.persist) { dauerhaftGefragt = true; navigator.storage.persist().catch(() => {}); }
  await neuZeichnen();
  $('#chat-verlauf').scrollTop = 0;
  toast('Abgelegt!', liste.length === 1 ? liste[0].name : `${liste.length} Dateien`);
}

document.addEventListener('click', async (e) => {
  const weg = e.target.closest('[data-weg]');
  if (!weg) return;
  await store.raus(weg.dataset.weg);
  await neuZeichnen();
});

$('#ablage-leeren').addEventListener('click', async () => {
  if (!confirm(`Alle ${zettel.length} Dateien aus der Ablage wegräumen? Das lässt sich nicht rückgängig machen.`)) return;
  await store.leeren();
  await neuZeichnen();
  toast('Ablage geleert', 'Alle Dateien sind weggeräumt.');
});

$('#datei-wahl').addEventListener('change', (e) => { ablegen(e.target.files); e.target.value = ''; });

// Notiz über die Chatzeile
function zeitstempel() {
  const d = new Date(), p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
$('#notiz-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const feld = $('#notiz-text');
  const text = feld.value;
  if (!text.trim()) return;
  ablegen([new File([text], `Notiz-${zeitstempel()}.txt`, { type: 'text/plain' })]);
  feld.value = '';
});
$('#notiz-knopf').addEventListener('click', () => $('#notiz-text').focus());

// T öffnet die Chatzeile, wie im Spiel
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 't' || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  e.preventDefault();
  $('#notiz-text').focus();
});

// Zeile herausziehen: auf den Desktop (Chrome) oder in ein Programm, das Dateien annimmt
document.addEventListener('dragstart', (e) => {
  const z = e.target.closest?.('.zeile');
  if (!z) return;
  const rec = zettel.find((r) => r.id === z.dataset.id);
  if (!rec) return;
  const dt = e.dataTransfer;
  dt.effectAllowed = 'copy';
  dt.setData('application/x-werkbank', rec.id);
  try { dt.items.add(new File([rec.blob], rec.name, { type: rec.type || 'application/octet-stream' })); } catch { /* nicht überall erlaubt */ }
  const u = urls.get(rec.id);
  dt.setData('DownloadURL', `${rec.type || 'application/octet-stream'}:${rec.name}:${u}`);
  dt.setData('text/uri-list', u);
  dt.setData('text/plain', rec.name);
  z.classList.add('zieht');
});
document.addEventListener('dragend', (e) => e.target.closest?.('.zeile')?.classList.remove('zieht'));

// Dateien von außen annehmen, überall auf der Seite
let ziehTiefe = 0;
const vonAussen = (e) => e.dataTransfer && [...e.dataTransfer.types].includes('Files') && ![...e.dataTransfer.types].includes('application/x-werkbank');
const chat = $('#ablage');

addEventListener('dragenter', (e) => {
  if (!vonAussen(e)) return;
  e.preventDefault();
  ziehTiefe++;
  chat.classList.add('drueber');
});
addEventListener('dragover', (e) => {
  if (!vonAussen(e)) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});
addEventListener('dragleave', (e) => {
  if (!vonAussen(e)) return;
  if (--ziehTiefe <= 0) { ziehTiefe = 0; chat.classList.remove('drueber'); }
});
addEventListener('drop', (e) => {
  ziehTiefe = 0;
  chat.classList.remove('drueber');
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

await neuZeichnen();
