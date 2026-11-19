// Ablage: Dateien im Browser zwischenspeichern (IndexedDB).
// Ohne IndexedDB (manche private Fenster) bleibt sie im Speicher, bis die Seite neu lädt.

const DB = 'jade-werkbank', STORE = 'ablage';

function oeffnen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blockiert'));
  });
}

function speicher(db) {
  const run = (mode, fn) => new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error ?? new Error('abgebrochen'));
  });
  return {
    dauerhaft: true,
    alle: () => run('readonly', (s) => s.getAll()),
    rein: (rec) => run('readwrite', (s) => s.put(rec)),
    raus: (id) => run('readwrite', (s) => s.delete(id)),
    leeren: () => run('readwrite', (s) => s.clear()),
  };
}

function imSpeicher() {
  const m = new Map();
  return {
    dauerhaft: false,
    alle: async () => [...m.values()],
    rein: async (rec) => { m.set(rec.id, rec); },
    raus: async (id) => { m.delete(id); },
    leeren: async () => { m.clear(); },
  };
}

export async function ablageOeffnen() {
  try {
    if (!('indexedDB' in window)) throw new Error('kein IndexedDB');
    const s = speicher(await oeffnen());
    await s.alle();
    return s;
  } catch (e) {
    console.warn('Ablage nur im Speicher:', e);
    return imSpeicher();
  }
}

const neueId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export function eintrag(datei, name = datei.name) {
  return {
    id: neueId(),
    name: name || 'Datei',
    type: datei.type || '',
    size: datei.size,
    added: Date.now(),
    blob: datei,
  };
}

export function groesse(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const u = ['KB', 'MB', 'GB'];
  let v = bytes / 1024, i = 0;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toLocaleString('de-DE', { maximumFractionDigits: v < 10 ? 1 : 0 })} ${u[i]}`;
}

// grobe Sorte für Symbol und Farbe des Zettels
const SORTEN = [
  ['bild', /^(png|jpe?g|gif|webp|avif|bmp|heic)$/],
  ['vektor', /^(svg|ai|eps)$/],
  ['pdf', /^pdf$/],
  ['modell', /^(stl|obj|3dm|ifc|dxf|dwg|glb|gltf|fbx|skp|ply|3ds|step|stp|blend)$/],
  ['daten', /^(json|geojson|csv|tsv|xml|kml|gpx|osm|pbf|xlsx?|ods)$/],
  ['text', /^(txt|md|rtf|docx?|odt|html?|js|py|css)$/],
  ['archiv', /^(zip|rar|7z|tar|gz)$/],
];

export function sorte(rec) {
  const ext = (rec.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  if (rec.type.startsWith('image/') && ext !== 'svg') return { sorte: 'bild', ext };
  for (const [s, re] of SORTEN) if (re.test(ext)) return { sorte: s, ext };
  if (rec.type.startsWith('text/')) return { sorte: 'text', ext };
  return { sorte: 'sonst', ext };
}
