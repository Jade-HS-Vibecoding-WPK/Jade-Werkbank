// Pixelgrafik: Texturen der Blöcke und Symbole der Werkzeuge, alles selbst gezeichnet.
// Jede Grafik ist ein 16×16-Raster. Sie wird einmal auf ein Canvas gemalt (data-URL),
// der Browser vergrößert sie mit image-rendering: pixelated.

export const FARBE = {
  k: '#1e1a1c', // Umriss
  w: '#ffffff',
  W: '#dfe3e6',
  g: '#a6abb0',
  G: '#63676c',
  s: '#82868c',
  t: '#26262b',
  b: '#3a6fd6',
  B: '#1f3f8c',
  c: '#93d6f6',
  r: '#d8392b',
  R: '#8c1d16',
  o: '#f39a2b',
  y: '#f8d63e',
  Y: '#c58f1b',
  l: '#7fd14c',
  L: '#3f9a2d',
  D: '#235c1b',
  n: '#c99d64',
  N: '#8a6238',
  m: '#3f2a1a',
  p: '#f1e8cb',
  P: '#c9bb93',
  e: '#c8573c',
  E: '#8c3423',
  v: '#9b5fe0',
  S: 'rgba(0,0,0,0.32)',
};

const raster = () => Array.from({ length: 16 }, () => Array(16).fill(null));

// Zeilen aus Zeichen: '.' bleibt durchsichtig, jedes andere Zeichen ist eine Farbe aus FARBE
function zeilen(rows, g = raster()) {
  rows.forEach((z, y) => {
    if (z.length !== 16) console.warn(`Pixelzeile ${y} hat ${z.length} Zeichen: ${z}`);
    [...z].forEach((ch, x) => { if (ch !== '.') g[y][x] = FARBE[ch] ?? ch; });
  });
  return g;
}

// Umriss um alles, was nicht schon Umriss ist
function umranden(g, farbe = FARBE.k) {
  const neu = g.map((z) => z.slice());
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    if (g[y][x]) continue;
    const nachbar = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
      const f = g[y + dy]?.[x + dx];
      return f && f !== farbe && f !== FARBE.S;
    });
    if (nachbar) neu[y][x] = farbe;
  }
  return neu;
}

function malen(g, fn) {
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const f = fn(x, y);
    if (f) g[y][x] = FARBE[f] ?? f;
  }
  return g;
}

// kleiner Zufall mit Startwert, damit die Texturen bei jedem Laden gleich aussehen
export function zufall(seed) {
  let s = (typeof seed === 'string' ? [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) : seed) >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function toenen(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const k = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${k(n >> 16)},${k((n >> 8) & 255)},${k(n & 255)})`;
}

export function bild(g, skala = 8) {
  const c = document.createElement('canvas');
  c.width = c.height = 16 * skala;
  const ctx = c.getContext('2d');
  g.forEach((z, y) => z.forEach((f, x) => {
    if (!f) return;
    ctx.fillStyle = f;
    ctx.fillRect(x * skala, y * skala, skala, skala);
  }));
  return c.toDataURL('image/png');
}

// ---------- Symbole der Werkzeuge ----------

const SYMBOLE = {
  // TERRA-Sim: Unwetter über der Stadt
  sturm: () => zeilen([
    '................',
    '................',
    '.....kkkk.......',
    '....kWWWWk.kk...',
    '..kkWWWWWWkWWk..',
    '.kWWWWWWWWWWWWk.',
    'kWWWWWWWWWWWWWWk',
    'kgWWWWWWWWWWWWgk',
    '.kggggggggggggk.',
    '..kkkkkkkkkkkk..',
    '...b...yy...b...',
    '..b...yy...b....',
    '.....yyyy...b...',
    '...b...yy.......',
    '..b...y.........',
    '................',
  ]),

  // Gebäudehöhen: drei Häuser und ein Höhenmaß
  hoehen: () => zeilen([
    '................',
    '.r.....kkkkk....',
    'rrr....kcWck....',
    '.r.....kWWWk....',
    '.r.....kcWck....',
    '.r.....kWWWkkkkk',
    '.r.....kcWckcWck',
    '.r.....kWWWkWWWk',
    '.r.kkkkkcWckcWck',
    '.r.kWWWkWWWkWWWk',
    '.r.kcWckcWckcWck',
    'rrrkWWWkWWWkWWWk',
    '.r.kcWckcWckcWck',
    '...kWWWkWWWkWWWk',
    'LLLLLLLLLLLLLLLL',
    'DDDDDDDDDDDDDDDD',
  ]),

  // Laserdatei aus 3D: Laserkopf schneidet eine Platte
  laser: () => zeilen([
    '................',
    '....kkkkkkkk....',
    '....kWWWWWWk....',
    '....kggggggk....',
    '....kGGGGGGk....',
    '.....kkGGkk.....',
    '.......kk.......',
    '.......rr.......',
    '.......rr.......',
    '.....y.rr.y.....',
    '......yrry......',
    '.kkkkkkrrkkkkkk.',
    'kppppppooppppppk',
    'kpprrrrrorrrrppk',
    'kPPPPPPPPPPPPPPk',
    '.kkkkkkkkkkkkkk.',
  ]),

  // Grundstücksanalyse: gestapelte Analyse-Ebenen
  ebenen: () => {
    const g = raster();
    const hw = [1, 3, 5, 7, 5, 3, 1];
    const raute = (cy, fill, hell) => {
      hw.forEach((h, i) => {
        const y = cy - 3 + i;
        for (let x = 8 - h; x < 8 + h; x++) {
          const rand = i === 0 || i === 6 || x <= 8 - h + 1 || x >= 8 + h - 2;
          g[y][x] = rand ? FARBE.k : (i === 1 || (i === 2 && x < 8) ? hell : fill);
        }
      });
    };
    raute(11, FARBE.o, FARBE.y);
    raute(8, FARBE.b, FARBE.c);
    raute(5, FARBE.L, FARBE.l);
    return g;
  },

  // SiteKick: Schwarzplan mit Park
  schwarzplan: () => zeilen([
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kptttpptttpppk.',
    '.kptttpptttpttk.',
    '.kptttppppppttk.',
    '.kppppppttppppk.',
    '.kttppllllppttk.',
    '.kttpplLllpptpk.',
    '.kpppplllLppppk.',
    '.ktttppllppttpk.',
    '.ktttpppppptttk.',
    '.kppppttpppttpk.',
    '.kpttpttppppppk.',
    '.kpttpppptttppk.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ]),

  // Modellbau-Laserdatei: Hausansicht mit Fenster- und Türausschnitten
  zuschnitt: () => umranden(zeilen([
    '................',
    '.......rr.......',
    '......rppr......',
    '.....rppppr.....',
    '....rppppppr....',
    '...rppppppppr...',
    '..rppppppppppr..',
    '..rrrrrrrrrrrr..',
    '...rppppppppr...',
    '...rpmmppmmpr...',
    '...rpmmppmmpr...',
    '...rppppppppr...',
    '...rpppmmpppr...',
    '...rpppmmpppr...',
    '...rrrrrrrrrr...',
    '................',
  ])),

  // Energieeffizienz: Effizienzbalken und ein Haus
  energie: () => {
    const g = umranden(zeilen([
      '................',
      '.DDDD...........',
      '.DDDD...........',
      '................',
      '.LLLLLL.........',
      '.LLLLLL.........',
      '................',
      '.yyyyyyyy.......',
      '.yyyyyyyy.......',
      '................',
      '.oooooooooo.....',
      '.oooooooooo.....',
      '................',
      '.rrrrrrrrrrrr...',
      '.rrrrrrrrrrrr...',
      '................',
    ]));
    return zeilen([
      '...........kk...',
      '..........kRRk..',
      '.........kRRRRk.',
      '........kRRRRRRk',
      '.........kWWcWk.',
      '.........kWWcWk.',
      '.........kkkkkk.',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
    ], g);
  },

  // CO₂-Rechner: Taschenrechner mit grüner Anzeige
  rechner: () => zeilen([
    '..kkkkkkkkkkkk..',
    '..kGGGGGGGGGGk..',
    '..kGllllllllGk..',
    '..kGlDDlDDlDGk..',
    '..kGllllllllGk..',
    '..kGGGGGGGGGGk..',
    '..kGWWGWWGooGk..',
    '..kGWWGWWGooGk..',
    '..kGGGGGGGGGGk..',
    '..kGWWGWWGooGk..',
    '..kGWWGWWGooGk..',
    '..kGGGGGGGGGGk..',
    '..kGWWGWWGLLGk..',
    '..kGWWGWWGLLGk..',
    '..kGGGGGGGGGGk..',
    '..kkkkkkkkkkkk..',
  ]),

  // Plan-Prüfer: Bauplan mit Haken
  pruefplan: () => zeilen([
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '..............kk',
    '.............kLk',
    '............kLLk',
    '......kk...kLLk.',
    '.....kLLk.kLLk..',
    '......kLLkLLk...',
    '.......kLLLk....',
    '........kLk.....',
    '.........k......',
    '................',
  ], zeilen([
    '................',
    'kkkkkkkkkkkk....',
    'kBBBBBBBBBBk....',
    'kBccccccBBBk....',
    'kBcBBBBcBBBk....',
    'kBcBBBBcccBk....',
    'kBcBBBBBBcBk....',
    'kBccccccccBk....',
    'kBBBBBBBBBBk....',
    'kBcBcBcBBBBk....',
    'kBBBBBBBBBBk....',
    'kBBBBBBBBBBk....',
    'kBBBBBBBBBBk....',
    'kkkkkkkkkkkk....',
    '................',
    '................',
  ])),

  // 15-Minuten-Stadt: Stoppuhr mit einer Viertelstunde
  uhr: () => {
    const g = malen(raster(), (x, y) => {
      const dx = x - 7, dy = y - 8, d = Math.hypot(dx, dy);
      if (d > 6.4) return null;
      if (d > 5.3) return 'k';
      if ((x === 7 && y >= 3 && y <= 8) || (y === 8 && x >= 7 && x <= 11)) return 'k';
      if (x > 7 && y < 8) return 'l';
      if ((x === 7 && y === 13) || (x === 2 && y === 8)) return 'G';
      return 'W';
    });
    g[8][7] = FARBE.r;
    return zeilen([
      '......kkk.......',
      '.......k........',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
    ], g);
  },

  // Fassaden-Tool: halb Ziegel, halb Holz
  fassade: () => umranden(malen(raster(), (x, y) => {
    if (x < 2 || x > 13 || y < 2 || y > 13) return null;
    const fenster = (y >= 4 && y <= 5) || (y >= 9 && y <= 10);
    if (x <= 7) {
      if (fenster && (x === 3 || x === 4)) return 'c';
      const lage = Math.floor((y - 2) / 3), zeile = (y - 2) % 3;
      if (zeile === 2) return 'P';
      return (x + lage * 3) % 6 === 5 ? 'P' : 'e';
    }
    if (x === 8) return 'k';
    if (fenster && (x === 10 || x === 11)) return 'c';
    return x % 3 === 0 ? 'N' : 'n';
  })),

  // Treppenplaner: Treppe im Schnitt
  treppe: () => umranden(malen(raster(), (x, y) => {
    if (x < 2 || x > 13 || y > 13) return null;
    const stufe = Math.floor((x - 2) / 3);
    const oben = 11 - stufe * 3;
    if (y < oben) return null;
    if (y === oben) return 'W';
    return (x - 2) % 3 === 2 ? 'G' : 'g';
  })),

  // Map2Model: Karte, aus der ein Modell wächst
  karte3d: () => zeilen([
    '...........kk...',
    '.........kkWWkk.',
    '........kWWWWWWk',
    '........kgWWWWGk',
    '........kggWWGGk',
    '........kgggGGGk',
    '........kgggGGGk',
    '........kgggGGGk',
    '.........kggGGk.',
    '...........kk...',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ], zeilen([
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    'kkkkkkkkkkk.....',
    'kllpPpbbppk.....',
    'klppPbbpppk.....',
    'kppbPbpllpk.....',
    'kpbbPpplLpk.....',
    'kbbpPppllpk.....',
    'kbppPrrrppk.....',
    'kpppPpprppk.....',
    'kkkkkkkkkkk.....',
  ])),

  // Workflow-App: Klemmbrett mit Aufgaben
  klemmbrett: () => zeilen([
    '......kkkk......',
    '..kkkkgWWgkkkk..',
    '..knnkggggknnk..',
    '..knppppppppnk..',
    '..knpLpGGGGpnk..',
    '..knppppppppnk..',
    '..knpLpGGGppnk..',
    '..knppppppppnk..',
    '..knpkpGGGGpnk..',
    '..knppppppppnk..',
    '..knpkpGGpppnk..',
    '..knppppppppnk..',
    '..knppppppppnk..',
    '..knnnnnnnnnnk..',
    '..kkkkkkkkkkkk..',
    '................',
  ]),

  // Locus: Stecknadel auf der Karte
  pin: () => zeilen([
    '................',
    '................',
    '.....kkkkkk.....',
    '....krWrrrrk....',
    '...krWrrrrrRk...',
    '...krrrWWrrRk...',
    '...krrrWWrrRk...',
    '...krrrrrrrRk...',
    '....krrrrrRk....',
    '.....krrrRk.....',
    '......krRk......',
    '......krRk......',
    '.......kk.......',
    '.....SSSSSS.....',
    '................',
    '................',
  ]),

  // ImmoCheck: Haus und Münze
  hausmuenze: () => zeilen([
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '..........kkkk..',
    '.........kyyyyk.',
    '........kyyYYYyk',
    '........kyYyyyyk',
    '........kYYYYyyk',
    '........kyYyyyyk',
    '........kyyYYYyk',
    '.........kyyyyk.',
    '..........kkkk..',
  ], zeilen([
    '................',
    '.....kk.........',
    '....krrk........',
    '...krrrrk.......',
    '..krrrrrrk......',
    '.krrrrrrrrk.....',
    'kkkkkkkkkkkk....',
    '.kWWWWWWWWk.....',
    '.kWccWWccWk.....',
    '.kWccWWccWk.....',
    '.kWWWnnWWWk.....',
    '.kWWWnnWWWk.....',
    '.kkkkkkkkkk.....',
    '................',
    '................',
    '................',
  ])),

  // Urban Analyst: Fernrohr über der Stadt
  fernrohr: () => umranden(malen(raster(), (x, y) => {
    const ax = 2.5, ay = 13.5, bx = 13.5, by = 2.5;
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    const px = x + 0.5 - ax, py = y + 0.5 - ay;
    const t = (px * dx + py * dy) / len2;
    if (t < 0 || t > 1) return null;
    const d = Math.abs(px * dy - py * dx) / Math.sqrt(len2);
    const breite = t < 0.2 ? 0.9 : t < 0.3 ? 1.3 : t < 0.78 ? 1.35 : 1.9;
    if (d > breite) return null;
    if (t > 0.93) return 'c';
    if (t < 0.2) return 'G';
    if ((t >= 0.2 && t < 0.3) || (t >= 0.78 && t < 0.88)) return 'Y';
    return d < 0.5 && px * dy - py * dx > 0 ? 'w' : 'y';
  })),

  // MaterialMatch: drei Materialmuster
  muster: () => {
    const g = raster();
    const kachel = (x0, y0, fn) => {
      for (let y = y0; y < y0 + 7; y++) for (let x = x0; x < x0 + 7; x++) {
        const rand = x === x0 || y === y0 || x === x0 + 6 || y === y0 + 6;
        g[y][x] = rand ? FARBE.k : FARBE[fn(x - x0, y - y0)];
      }
    };
    const r = zufall('muster');
    kachel(1, 1, () => (r() < 0.3 ? 'G' : r() < 0.5 ? 'W' : 'g'));
    kachel(4, 5, (x, y) => (y % 2 === 0 ? 'N' : 'n'));
    kachel(8, 8, (x, y) => (y % 2 === 0 || (x + (y % 4 === 1 ? 0 : 2)) % 4 === 0 ? 'P' : 'e'));
    return g;
  },
};

// Dateisymbol für die Ablage: Zettel mit farbigem Band je Dateisorte
const SORTEN_FARBE = { bild: 'L', vektor: 'v', pdf: 'r', modell: 'b', daten: 'y', text: 'g', archiv: 'N', sonst: 'G' };
function dateiSymbol(sorte) {
  const f = SORTEN_FARBE[sorte] ?? 'G';
  return zeilen([
    '................',
    '...kkkkkkkk.....',
    '...kppppppPk....',
    '...kppppppPPk...',
    '...kppppppkkkk..',
    '...kppppppppPk..',
    '...kpGGGGGGpPk..',
    '...kppppppppPk..',
    '...kpGGGGGppPk..',
    '...kppppppppPk..',
    `...k${f.repeat(9)}k..`,
    `...k${f.repeat(9)}k..`,
    '...kppppppppPk..',
    '...kkkkkkkkkkk..',
    '................',
    '................',
  ]);
}

const cache = new Map();
export function symbolBild(name) {
  if (!cache.has(name)) {
    const fn = SYMBOLE[name];
    cache.set(name, bild(fn ? fn() : dateiSymbol('sonst'), 8));
  }
  return cache.get(name);
}
export function dateiBild(sorte) {
  const key = `datei:${sorte}`;
  if (!cache.has(key)) cache.set(key, bild(dateiSymbol(sorte), 4));
  return cache.get(key);
}

// ---------- Texturen ----------

function rauschen(g, seed, staerke = 0.08) {
  const r = zufall(seed);
  return g.map((z) => z.map((f) => (f && f.startsWith('#') ? toenen(f, 1 + (r() - 0.5) * 2 * staerke) : f)));
}

function werkbankSeite() {
  const r = zufall('werkbank-seite');
  const fugen = [9, 4, 11, 6];
  const g = malen(raster(), (x, y) => {
    if (y === 0) return '#c06e40';
    if (y === 1) return '#9c512e';
    if (y === 2) return '#4a2414';
    if (x === 0) return '#3f2812';
    if (x === 1) return '#6f4825';
    if (x === 14) return '#5a3a1d';
    if (x === 15) return '#3a2410';
    if (y === 15) return '#5c3d1f';
    const brett = Math.floor((y - 3) / 4), zeile = (y - 3) % 4;
    if (zeile === 3) return '#6d4d27';
    if (x === fugen[brett]) return '#7a5830';
    if (zeile === 0) return '#c9a066';
    const basis = brett % 2 ? '#b38955' : '#ad824d';
    return r() < 0.12 ? '#9e7643' : basis;
  });
  return rauschen(g, 'wb-s', 0.05);
}

function werkbankOben() {
  const g = malen(raster(), (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 15) return '#5e3018';
    const ecke = (x <= 2 || x >= 13) && (y <= 2 || y >= 13);
    if (ecke) return (x === 1 || x === 14) && (y === 1 || y === 14) ? '#e2c28d' : '#c79f68';
    if (x >= 3 && x <= 12 && y >= 3 && y <= 12) {
      if (x % 3 === 0 || y % 3 === 0) return '#5a2c17';
      return (x + y) % 3 === 2 ? '#c27447' : '#b6693f';
    }
    return '#a5593a';
  });
  return rauschen(g, 'wb-o', 0.07);
}

function kartentischSeite() {
  const r = zufall('kt-seite');
  const g = malen(raster(), (x, y) => {
    if (y === 0) return '#6b4a2b';
    if (y === 1) return '#55391f';
    if (y === 2) return '#24160b';
    if (x <= 1 || x >= 14) return x === 1 || x === 14 ? '#7a5634' : '#4d3219';
    if (y === 15) return '#2c1c10';
    if (y === 9) return '#6b4a2b';
    if (y === 10) return '#24160b';
    const zeile = (y - 3) % 3;
    if (zeile === 2) return '#2f1f12';
    return r() < 0.15 ? '#3f2918' : (y < 9 ? '#4f3420' : '#4a311e');
  });
  return rauschen(g, 'kt-s', 0.06);
}

function kartentischOben() {
  const g = malen(raster(), (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 15) return '#2a1a0e';
    // Kartenstück in der hinteren Ecke
    if (x <= 5 && y <= 5) {
      if (x === 5 || y === 5) return '#2a1a0e';
      return (x + y * 2) % 5 === 0 ? '#4f9a3a' : (x > y ? '#3d6fd1' : '#5fae44');
    }
    // Papierbogen
    if (x >= 4 && x <= 13 && y >= 6 && y <= 13) {
      if (x === 4 || y === 6 || x === 13 || y === 13) return '#b9a77c';
      if ((x === 7 && y === 9) || (x === 10 && y === 11) || (x === 11 && y === 8)) return '#b83a2b';
      if (y === 10 && x >= 6 && x <= 11) return '#8f8364';
      return '#ece2c2';
    }
    return x % 4 === 3 ? '#3a2615' : '#4f3520';
  });
  return rauschen(g, 'kt-o', 0.07);
}

function erde() {
  const r = zufall('erde');
  const farben = ['#7a5a3c', '#6b4c31', '#86653f', '#5b3f28', '#94704a'];
  return malen(raster(), () => farben[Math.floor(r() ** 1.4 * farben.length)]);
}

function gras() {
  const r = zufall('gras');
  const tropfen = [4, 3, 3, 4, 5, 3, 3, 4, 3, 5, 4, 3, 3, 4, 3, 3];
  const e = erde();
  return malen(e.map((z) => z.slice()), (x, y) => {
    if (y < tropfen[x]) return r() < 0.3 ? '#5f9e35' : (r() < 0.5 ? '#6fb33e' : '#78bd45');
    if (y === tropfen[x]) return '#4c7f2a';
    return null;
  });
}

function stein() {
  const r = zufall('stein');
  return malen(raster(), () => (r() < 0.2 ? '#6d6d6d' : r() < 0.4 ? '#8e8e8e' : '#7d7d7d'));
}

export function texturen() {
  return {
    werkbankSeite: bild(werkbankSeite(), 16),
    werkbankOben: bild(werkbankOben(), 16),
    kartentischSeite: bild(kartentischSeite(), 16),
    kartentischOben: bild(kartentischOben(), 16),
    erde: bild(erde(), 4),
    gras: bild(gras(), 4),
    stein: bild(stein(), 4),
  };
}

export const SYMBOL_NAMEN = Object.keys(SYMBOLE);
