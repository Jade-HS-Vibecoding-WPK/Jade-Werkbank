// Werkzeuge für die Werkbank: jedes Projekt bekommt eines, das zu ihm passt.
// Zugeordnet wird über den Hausstil aus der Vibecoding-Allee (bleibt bei Umbenennungen gleich),
// unbekannte Projekte bekommen den Schraubenschlüssel.
// Alle Zeichnungen: Draufsicht, viewBox 0 0 120 120, liegend auf der Platte.

const ST = '#a9b2ba', STD = '#69737c', STL = '#dde2e6';
const WOOD = '#bd8650', WOODD = '#875a2f';
const RED = '#c8382f', YEL = '#e8b62e', YELD = '#9f7a12', BLUE = '#3b7fbf', GREEN = '#5e9a4f';
const BLK = '#2b2d30', BRASS = '#cba34b', BRASSD = '#8c6b22', PAPER = '#f6f2e7';

const ticks = (x0, x1, y, step, long = 5, len = 3, len2 = 6, color = BLK, w = 0.8) => {
  let s = '';
  for (let i = 0, x = x0; x <= x1 + 0.01; x += step, i++) {
    const l = i % long === 0 ? len2 : len;
    s += `<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${y + l}" stroke="${color}" stroke-width="${w}"/>`;
  }
  return s;
};

const WERKZEUGE = {
  wasserwaage: {
    name: 'Wasserwaage', winkel: -28,
    svg: () => `
      <rect x="4" y="50" width="112" height="20" rx="2.5" fill="${STL}" stroke="${STD}" stroke-width="1.5"/>
      <rect x="6" y="51.5" width="108" height="4" fill="#f2f5f7"/>
      ${ticks(16, 104, 66, 4, 5, 2, 4, STD, 0.6)}
      <rect x="4" y="50" width="7" height="20" rx="2" fill="${RED}"/>
      <rect x="109" y="50" width="7" height="20" rx="2" fill="${RED}"/>
      <rect x="46" y="53.5" width="28" height="13" rx="6.5" fill="#cbe89a" stroke="${STD}"/>
      <line x1="55" y1="54" x2="55" y2="66" stroke="${BLK}" stroke-width=".9"/>
      <line x1="65" y1="54" x2="65" y2="66" stroke="${BLK}" stroke-width=".9"/>
      <ellipse cx="60" cy="60" rx="4.2" ry="3.4" fill="#f4ffe2"/>
      <circle cx="22" cy="60" r="5.5" fill="#cbe89a" stroke="${STD}"/>
      <circle cx="98" cy="60" r="5.5" fill="#cbe89a" stroke="${STD}"/>`,
  },
  zollstock: {
    name: 'Zollstock', winkel: -12,
    svg: () => `
      <g transform="rotate(-26 14 64)">
        <rect x="10" y="58" width="100" height="12" rx="1.5" fill="${YEL}" stroke="${YELD}"/>
        ${ticks(14, 106, 58, 2, 5, 2, 4.5, BLK, 0.6)}
        <text x="34" y="68.5" font-size="5.5" font-weight="700" fill="${RED}">2</text>
        <text x="78" y="68.5" font-size="5.5" font-weight="700" fill="${BLK}">3</text>
      </g>
      <rect x="10" y="58" width="100" height="12" rx="1.5" fill="${YEL}" stroke="${YELD}"/>
      ${ticks(14, 106, 58, 2, 5, 2, 4.5, BLK, 0.6)}
      <text x="56" y="68.5" font-size="5.5" font-weight="700" fill="${BLK}">1</text>
      <circle cx="14" cy="64" r="3" fill="${STL}" stroke="${STD}"/>`,
  },
  lot: {
    name: 'Senklot', winkel: 14,
    svg: () => `
      <path d="M50 60 C38 60 36 46 26 48 S12 62 20 70 S38 74 32 86 S12 94 8 84" fill="none" stroke="#efe2c2" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 60 C38 60 36 46 26 48 S12 62 20 70 S38 74 32 86 S12 94 8 84" fill="none" stroke="#b9a77c" stroke-width=".6" stroke-dasharray="1.5 1.5"/>
      <rect x="50" y="55" width="8" height="10" rx="2" fill="${BRASSD}"/>
      <rect x="57" y="50" width="32" height="20" rx="4" fill="${BRASS}" stroke="${BRASSD}"/>
      <rect x="59" y="52" width="28" height="4" rx="2" fill="#e7c978"/>
      <path d="M89 50 L112 60 L89 70 Z" fill="${BRASS}" stroke="${BRASSD}" stroke-linejoin="round"/>
      <line x1="66" y1="50" x2="66" y2="70" stroke="${BRASSD}" stroke-width=".8"/>`,
  },
  cutter: {
    name: 'Cutter', winkel: -32,
    svg: () => `
      <rect x="16" y="51" width="78" height="18" rx="6" fill="#e2762b" stroke="#9c4a12"/>
      <rect x="24" y="55" width="54" height="10" rx="3.5" fill="${BLK}"/>
      ${[30, 36, 42, 48, 54, 60, 66, 72].map((x) => `<line x1="${x}" y1="56" x2="${x}" y2="64" stroke="#4a4d52" stroke-width="1.2"/>`).join('')}
      <rect x="58" y="47" width="12" height="6" rx="2" fill="${STD}"/>
      <path d="M93 54 L114 57.5 L108 66 L93 66 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <line x1="99" y1="55" x2="96" y2="66" stroke="${STD}" stroke-width=".7"/>
      <line x1="105" y1="56" x2="102" y2="66" stroke="${STD}" stroke-width=".7"/>`,
  },
  massband: {
    name: 'Maßband', winkel: 6,
    svg: () => `
      <rect x="62" y="64" width="50" height="10" fill="${YEL}" stroke="${YELD}" stroke-width=".8"/>
      ${ticks(64, 108, 64, 2, 5, 2, 4.5, BLK, 0.6)}
      <rect x="110" y="61" width="4" height="16" rx="1" fill="${STD}"/>
      <rect x="14" y="30" width="54" height="54" rx="13" fill="${BLK}"/>
      <rect x="18" y="34" width="46" height="46" rx="10" fill="${RED}"/>
      <circle cx="41" cy="57" r="13" fill="${BLK}"/>
      <circle cx="41" cy="57" r="5" fill="${ST}"/>
      <rect x="30" y="26" width="18" height="7" rx="3" fill="${STD}"/>
      <text x="41" y="78" font-size="5" font-weight="700" fill="#fff" text-anchor="middle">5 m</text>`,
  },
  zirkel: {
    name: 'Zirkel', winkel: 12,
    svg: () => `
      <rect x="57" y="4" width="6" height="14" rx="2" fill="${BLK}"/>
      ${[7, 10, 13].map((y) => `<line x1="57" y1="${y}" x2="63" y2="${y}" stroke="#555" stroke-width=".8"/>`).join('')}
      <path d="M57 22 L33 100 L37 101 L60 26 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <path d="M63 22 L87 98 L83 99 L60 26 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <path d="M33 100 L34 110 L37 101 Z" fill="${STD}"/>
      <rect x="82" y="96" width="6" height="8" rx="1" fill="${WOOD}" transform="rotate(-18 85 100)"/>
      <path d="M84 104 L86 110 L88 103 Z" fill="${BLK}"/>
      <path d="M43 70 Q60 64 77 70" fill="none" stroke="${STD}" stroke-width="1.5"/>
      <circle cx="60" cy="66.5" r="4" fill="${ST}" stroke="${STD}"/>
      <circle cx="60" cy="22" r="6" fill="${ST}" stroke="${STD}"/>`,
  },
  pinzette: {
    name: 'Pinzette', winkel: -36,
    svg: () => `
      <path d="M8 57 Q8 60 12 60.4 L110 52 L110 54.6 L14 63 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <path d="M8 63 Q8 60 12 59.6 L110 68 L110 65.4 L14 57 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round" opacity=".95"/>
      ${[40, 44, 48, 52, 56].map((x) => `<line x1="${x}" y1="${59 - (x - 10) * 0.075 - 1.6}" x2="${x}" y2="${59 - (x - 10) * 0.075}" stroke="${STD}" stroke-width=".7"/>`).join('')}
      <circle cx="10" cy="60" r="2.5" fill="${ST}" stroke="${STD}"/>`,
  },
  thermometer: {
    name: 'Thermometer', winkel: -18,
    svg: () => `
      <rect x="10" y="44" width="102" height="32" rx="5" fill="#ecd9b4" stroke="#a8875a"/>
      ${ticks(34, 102, 47, 3, 5, 2, 4, '#6a5233', 0.6)}
      <text x="40" y="72" font-size="5" fill="#6a5233">0</text><text x="70" y="72" font-size="5" fill="#6a5233">20</text><text x="98" y="72" font-size="5" fill="#6a5233">40</text>
      <rect x="22" y="56" width="86" height="9" rx="4.5" fill="#f1f6f8" stroke="#9fb0bb"/>
      <rect x="24" y="58.5" width="56" height="4" rx="2" fill="${RED}"/>
      <circle cx="24" cy="60.5" r="7.5" fill="${RED}" stroke="#8f231c"/>
      <circle cx="22" cy="58.5" r="2" fill="#ef8c84"/>`,
  },
  taschenrechner: {
    name: 'Taschenrechner', winkel: 8,
    svg: () => {
      let keys = '';
      for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
        const op = c === 3;
        keys += `<rect x="${37 + c * 12}" y="${47 + r * 11}" width="10" height="8.5" rx="2" fill="${op ? '#e2762b' : r === 4 && c === 0 ? RED : '#5b6168'}"/>`;
      }
      return `
      <rect x="30" y="14" width="60" height="94" rx="8" fill="#3a3f45" stroke="#202327"/>
      <rect x="36" y="21" width="48" height="19" rx="2.5" fill="#b9caa3" stroke="#22262a"/>
      <text x="81" y="35" font-size="11" font-family="ui-monospace, monospace" fill="#2e3a27" text-anchor="end">0,42</text>
      <text x="39" y="27" font-size="4.5" fill="#2e3a27">t CO₂</text>
      ${keys}`;
    },
  },
  lupe: {
    name: 'Lupe', winkel: -34,
    svg: () => `
      <rect x="70" y="55" width="44" height="11" rx="5.5" fill="${WOOD}" stroke="${WOODD}"/>
      <rect x="64" y="54" width="10" height="13" rx="2" fill="${BLK}"/>
      <circle cx="40" cy="60" r="27" fill="rgba(178,214,236,.5)" stroke="${BLK}" stroke-width="6"/>
      <path d="M24 50 A19 19 0 0 1 38 39" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>`,
  },
  pflanzschaufel: {
    name: 'Pflanzschaufel', winkel: -30,
    svg: () => `
      <rect x="72" y="54" width="40" height="12" rx="6" fill="${WOOD}" stroke="${WOODD}"/>
      <circle cx="106" cy="60" r="1.8" fill="${WOODD}"/>
      <rect x="62" y="56" width="12" height="8" rx="1.5" fill="${STD}"/>
      <path d="M62 60 C56 45 30 43 8 60 C30 77 56 75 62 60 Z" fill="${ST}" stroke="${STD}"/>
      <path d="M58 60 L14 60" stroke="${STD}" stroke-width="1"/>
      <circle cx="18" cy="56" r="2.2" fill="#6b4a2e"/><circle cx="24" cy="64" r="1.6" fill="#6b4a2e"/><circle cx="30" cy="57" r="1.3" fill="#6b4a2e"/>
      <path d="M36 66 q4 -8 10 -6 q-3 6 -10 6 z" fill="${GREEN}"/>`,
  },
  stoppuhr: {
    name: 'Stoppuhr', winkel: -6,
    svg: () => {
      let t = '';
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2, r1 = i % 5 ? 30 : 27;
        t += `<line x1="${(60 + Math.sin(a) * r1).toFixed(1)}" y1="${(66 - Math.cos(a) * r1).toFixed(1)}" x2="${(60 + Math.sin(a) * 32).toFixed(1)}" y2="${(66 - Math.cos(a) * 32).toFixed(1)}" stroke="${BLK}" stroke-width="${i % 5 ? 0.5 : 1.2}"/>`;
      }
      return `
      <rect x="54" y="8" width="12" height="10" rx="2" fill="${STD}"/>
      <circle cx="60" cy="8" r="5" fill="none" stroke="${STD}" stroke-width="2.5"/>
      <rect x="88" y="26" width="9" height="7" rx="1.5" fill="${STD}" transform="rotate(45 92 30)"/>
      <circle cx="60" cy="66" r="42" fill="${ST}" stroke="${STD}" stroke-width="2.5"/>
      <circle cx="60" cy="66" r="35" fill="${PAPER}"/>
      <path d="M60 66 L60 32 A34 34 0 0 1 94 66 Z" fill="rgba(200,56,47,.22)"/>
      ${t}
      <text x="60" y="49" font-size="7" font-weight="700" fill="${BLK}" text-anchor="middle">60</text>
      <text x="84" y="68.5" font-size="7" font-weight="700" fill="${RED}" text-anchor="middle">15</text>
      <line x1="60" y1="66" x2="88" y2="64" stroke="${RED}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="60" cy="66" r="3" fill="${BLK}"/>`;
    },
  },
  farbrolle: {
    name: 'Farbrolle', winkel: -24,
    svg: () => `
      <path d="M52 50 H66 V70 H80" fill="none" stroke="${STD}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="78" y="64" width="36" height="12" rx="6" fill="#2f5d4a" stroke="#1e3d30"/>
      <rect x="6" y="36" width="48" height="28" rx="9" fill="#d9825a" stroke="#9b4f2e"/>
      ${[12, 18, 24, 30, 36, 42, 48].map((x) => `<path d="M${x} 38 q2 12 0 24" fill="none" stroke="#c46a43" stroke-width="1.2"/>`).join('')}
      <path d="M22 64 q1 6 3 6 q2 0 2 -6" fill="#d9825a"/>`,
  },
  winkel: {
    name: 'Anschlagwinkel', winkel: 10,
    svg: () => `
      <rect x="30" y="22" width="80" height="13" fill="${STL}" stroke="${STD}"/>
      ${ticks(34, 106, 22, 3, 5, 2.5, 5, BLK, 0.6)}
      <rect x="14" y="16" width="17" height="92" rx="2" fill="${WOOD}" stroke="${WOODD}"/>
      <path d="M17 24 q4 30 0 80 M25 22 q-3 40 1 84" fill="none" stroke="${WOODD}" stroke-width=".6" opacity=".6"/>
      <circle cx="22.5" cy="24" r="2" fill="${BRASS}" stroke="${BRASSD}"/>
      <circle cx="22.5" cy="33" r="2" fill="${BRASS}" stroke="${BRASSD}"/>`,
  },
  laubsaege: {
    name: 'Laubsäge', winkel: -18,
    svg: () => `
      <path d="M40 86 V38 Q40 28 50 28 H100 Q110 28 110 38 V86" fill="none" stroke="${STD}" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="40" y1="86" x2="110" y2="86" stroke="#333" stroke-width="1.1"/>
      <rect x="104" y="82" width="10" height="8" rx="1.5" fill="${STD}"/>
      <rect x="36" y="82" width="9" height="8" rx="1.5" fill="${STD}"/>
      <rect x="6" y="80.5" width="32" height="11" rx="5.5" fill="${WOOD}" stroke="${WOODD}"/>
      <path d="M14 82 q6 4 16 0" fill="none" stroke="${WOODD}" stroke-width=".6"/>`,
  },
  klemmbrett: {
    name: 'Klemmbrett', winkel: 7,
    svg: () => {
      const bars = [[0, 22, BLUE], [10, 24, BLUE], [18, 20, GREEN], [30, 22, YEL], [40, 14, RED], [44, 12, '#7d6aa8']];
      return `
      <rect x="22" y="14" width="76" height="96" rx="5" fill="#b88a55" stroke="${WOODD}"/>
      <rect x="28" y="24" width="64" height="80" fill="${PAPER}" stroke="#d8d0bd" stroke-width=".6"/>
      ${[38, 50, 62, 74, 86, 98].map((y) => `<line x1="30" y1="${y}" x2="90" y2="${y}" stroke="#e1dac8" stroke-width=".6"/>`).join('')}
      ${bars.map(([x, w, c], i) => `<rect x="${32 + x}" y="${30 + i * 12}" width="${w}" height="6" rx="1.5" fill="${c}"/>`).join('')}
      <line x1="68" y1="26" x2="68" y2="102" stroke="${RED}" stroke-width="1.4"/>
      <rect x="42" y="9" width="36" height="15" rx="3" fill="${ST}" stroke="${STD}"/>
      <rect x="52" y="5" width="16" height="8" rx="4" fill="none" stroke="${STD}" stroke-width="2"/>`;
    },
  },
  messschieber: {
    name: 'Messschieber', winkel: -24,
    svg: () => `
      <rect x="6" y="50" width="110" height="11" fill="${STL}" stroke="${STD}"/>
      ${ticks(22, 112, 50, 2, 5, 2, 4.5, BLK, 0.5)}
      <path d="M6 61 H20 V84 L13 95 L6 84 Z" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <path d="M6 50 V40 L10 35 L14 40 V50" fill="${STL}" stroke="${STD}" stroke-linejoin="round"/>
      <rect x="32" y="46" width="30" height="20" rx="2" fill="${ST}" stroke="${STD}"/>
      ${ticks(36, 58, 61, 2.2, 5, 1.5, 3, BLK, 0.5)}
      <path d="M32 66 V84 L39 95 L46 84 V66" fill="${ST}" stroke="${STD}" stroke-linejoin="round"/>
      <path d="M32 46 V40 L28 35 L24 40 V46" fill="${ST}" stroke="${STD}" stroke-linejoin="round"/>
      <circle cx="56" cy="70" r="4.5" fill="${STD}"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="56" y1="70" x2="${(56 + Math.cos(i) * 4.5).toFixed(1)}" y2="${(70 + Math.sin(i) * 4.5).toFixed(1)}" stroke="${ST}" stroke-width=".5"/>`).join('')}`,
  },
  reisszwecken: {
    name: 'Stecknadeln', winkel: 4,
    svg: () => {
      const pin = (x, y, c) => `
        <ellipse cx="${x + 3}" cy="${y + 4}" rx="6" ry="4" fill="rgba(0,0,0,.18)"/>
        <line x1="${x}" y1="${y}" x2="${x + 6}" y2="${y + 7}" stroke="${STD}" stroke-width="1.2"/>
        <circle cx="${x}" cy="${y}" r="6.5" fill="${c}"/>
        <circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity=".55"/>`;
      return `
      <rect x="14" y="20" width="92" height="80" rx="2" fill="#eef0e2" stroke="#c4c9b0"/>
      <path d="M14 70 C40 64 54 82 106 74" fill="none" stroke="#9cc7d8" stroke-width="5"/>
      <path d="M30 20 L44 100 M14 44 L106 36 M70 20 L84 100" stroke="#fff" stroke-width="3"/>
      <path d="M14 44 L106 36" stroke="#e8c879" stroke-width="2"/>
      <path d="M52 48 L68 46 L70 62 L54 64 Z" fill="#b9d49a"/>
      ${[[22, 26], [86, 50], [90, 84], [20, 82]].map(([x, y]) => `<rect x="${x}" y="${y}" width="9" height="7" fill="#d6d2c4"/>`).join('')}
      ${pin(40, 50, RED)}${pin(78, 40, BLUE)}${pin(62, 80, YEL)}`;
    },
  },
  schluessel: {
    name: 'Hausschlüssel', winkel: -16,
    svg: () => `
      <path d="M44 56 H100 V64 H44 Z" fill="${BRASS}" stroke="${BRASSD}"/>
      <path d="M70 64 V72 H76 V68 H82 V74 H88 V67 H94 V72 H100 V64 Z" fill="${BRASS}" stroke="${BRASSD}" stroke-linejoin="round"/>
      <line x1="52" y1="60" x2="98" y2="60" stroke="${BRASSD}" stroke-width=".8"/>
      <path fill-rule="evenodd" d="M30 44 a16 16 0 1 0 0.01 0 Z M24 60 a6 6 0 1 0 0.01 0 Z" fill="${BRASS}" stroke="${BRASSD}"/>
      <circle cx="18" cy="60" r="11" fill="none" stroke="${STD}" stroke-width="2"/>
      <path d="M2 82 L10 74 L18 82 V96 H2 Z" fill="${RED}" stroke="#8f231c" stroke-linejoin="round"/>
      <rect x="7.5" y="87" width="5" height="9" fill="#8f231c"/>
      <line x1="10" y1="74" x2="12" y2="70" stroke="${STD}" stroke-width="1.5"/>`,
  },
  fernglas: {
    name: 'Fernglas', winkel: -10,
    svg: () => `
      <path d="M14 40 C4 60 4 80 16 92" fill="none" stroke="#5a4636" stroke-width="2.5"/>
      <rect x="10" y="30" width="12" height="18" rx="3" fill="#3a3d42"/>
      <rect x="10" y="70" width="12" height="18" rx="3" fill="#3a3d42"/>
      <rect x="20" y="27" width="50" height="24" rx="7" fill="${BLK}"/>
      <rect x="20" y="67" width="50" height="24" rx="7" fill="${BLK}"/>
      <rect x="64" y="22" width="34" height="34" rx="7" fill="#3a3d42"/>
      <rect x="64" y="62" width="34" height="34" rx="7" fill="#3a3d42"/>
      <ellipse cx="97" cy="39" rx="3.5" ry="14" fill="#6f9fc4"/>
      <ellipse cx="97" cy="79" rx="3.5" ry="14" fill="#6f9fc4"/>
      <rect x="38" y="49" width="20" height="20" fill="#3a3d42"/>
      <circle cx="48" cy="59" r="6" fill="${STD}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="48" y1="59" x2="${(48 + Math.cos(i * 0.8) * 6).toFixed(1)}" y2="${(59 + Math.sin(i * 0.8) * 6).toFixed(1)}" stroke="${ST}" stroke-width=".5"/>`).join('')}`,
  },
  farbfaecher: {
    name: 'Musterfächer', winkel: 0,
    svg: () => {
      const cols = ['#a3563d', '#c08a52', '#a9a9a2', '#7d8a96', '#6e9a4f', '#9cc7d8', '#d9b48a'];
      return cols.map((c, i) => `
        <g transform="rotate(${8 + i * 12} 24 98)">
          <rect x="17" y="16" width="14" height="84" rx="4" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width=".7"/>
          <rect x="18.5" y="19" width="11" height="9" rx="1.5" fill="${PAPER}"/>
          <line x1="20" y1="22" x2="28" y2="22" stroke="#999" stroke-width=".6"/><line x1="20" y1="25" x2="26" y2="25" stroke="#999" stroke-width=".6"/>
        </g>`).join('') + `<circle cx="24" cy="96" r="4.5" fill="${ST}" stroke="${STD}"/><circle cx="24" cy="96" r="1.5" fill="${STD}"/>`;
    },
  },
  sortierkasten: {
    name: 'Sortierkasten', winkel: 4,
    svg: () => {
      const cs = [RED, YEL, BLUE, GREEN];
      let packs = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const k = r * 4 + c;
        if (k === 7 || k === 10) continue;
        const x = 16 + c * 23 + 4, y = 28 + r * 23 + 5;
        packs += `<rect x="${x}" y="${y}" width="14" height="11" rx="1" fill="${cs[(r * 3 + c) % 4]}"/><line x1="${x + 7}" y1="${y}" x2="${x + 7}" y2="${y + 11}" stroke="rgba(0,0,0,.25)" stroke-width=".7"/>`;
      }
      return `
      <rect x="12" y="22" width="96" height="78" rx="5" fill="#e6eef3" stroke="#8fa3b2" stroke-width="2"/>
      ${packs}
      ${[1, 2, 3].map((c) => `<line x1="${16 + c * 23}" y1="26" x2="${16 + c * 23}" y2="96" stroke="#8fa3b2" stroke-width="1.5"/>`).join('')}
      ${[1, 2].map((r) => `<line x1="14" y1="${28 + r * 23}" x2="106" y2="${28 + r * 23}" stroke="#8fa3b2" stroke-width="1.5"/>`).join('')}
      <rect x="12" y="22" width="96" height="78" rx="5" fill="rgba(255,255,255,.18)"/>
      <rect x="52" y="97" width="16" height="6" rx="2" fill="#8fa3b2"/>`;
    },
  },
  schraubenschluessel: {
    name: 'Schraubenschlüssel', winkel: -30,
    svg: () => `
      <rect x="30" y="55" width="62" height="10" rx="4" fill="${ST}" stroke="${STD}"/>
      <path d="M12 48 L26 44 L38 51 L38 69 L26 76 L12 72 L22 65 L22 55 Z" fill="${ST}" stroke="${STD}" stroke-linejoin="round"/>
      <path fill-rule="evenodd" d="M100 47 a13 13 0 1 0 0.01 0 Z M100 54 l5.2 3 v6 l-5.2 3 l-5.2 -3 v-6 Z" fill="${ST}" stroke="${STD}"/>
      <text x="62" y="62.5" font-size="5" fill="${STD}" text-anchor="middle">13</text>`,
  },
};

// Hausstil der Allee → Werkzeug, mit dem Grund in einem Satz
const ZU_STIL = {
  terra: ['wasserwaage', 'Zeigt, wo das Wasser steht.'],
  nurdach: ['zollstock', 'Misst jedes Grundstück an den Paragraphen.'],
  hoehenmodell: ['lot', 'Für Gebäudehöhen und ihr Umfeld.'],
  karton: ['cutter', 'Schneidet Karton fürs Modell.'],
  plankopf: ['massband', 'Misst das Grundstück aus.'],
  schwarzplan: ['zirkel', 'Zieht Kreise um den Standort.'],
  laserplatte: ['pinzette', 'Für die feinen Teile im Modellbau.'],
  passivhaus: ['thermometer', 'Misst, wie warm ein Haus bleibt.'],
  swiss: ['taschenrechner', 'Rechnet die Emissionen zusammen.'],
  planpruefer: ['lupe', 'Prüft Pläne bis ins Detail.'],
  voxel: ['pflanzschaufel', 'Setzt Blöcke und Setzlinge.'],
  glas: ['stoppuhr', 'Alles in 15 Minuten erreichbar?'],
  musterfassade: ['farbrolle', 'Für neue Fassaden.'],
  treppe: ['winkel', 'Damit jede Stufe stimmt.'],
  sperrholz: ['laubsaege', 'Sägt die Karte ins Sperrholz.'],
  kacheln: ['klemmbrett', 'Hält den Ablauf fest.'],
  holzrahmen: ['messschieber', 'Misst jedes Detail nach.'],
  kartenplatte: ['reisszwecken', 'Pinnt Standorte auf die Karte.'],
  rendite: ['schluessel', 'Schließt die Immobilie auf.'],
  layerturm: ['fernglas', 'Blickt über das ganze Stadtgebiet.'],
  materialmatch: ['farbfaecher', 'Findet das passende Material.'],
  kiosk: ['sortierkasten', 'Hält die Karten griffbereit.'],
};

// kleiner, fester Zufall pro Projektname, damit nichts genau gerade liegt
export function zufall(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

export function werkzeugFuer(projekt) {
  const [key, warum] = ZU_STIL[projekt.house?.style] ?? ['schraubenschluessel', 'Ein Werkzeug für alles, was neu dazukommt.'];
  return { key, warum, ...WERKZEUGE[key] };
}

export function werkzeugSvg(w, { drehen = 0, klasse = '' } = {}) {
  return `<svg class="${klasse}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <g transform="rotate(${(w.winkel + drehen).toFixed(1)} 60 60)">${w.svg()}</g></svg>`;
}

// Deko an der Lochwand (Vorderansicht, hängend)
export const LOCHWAND = [
  { titel: 'Hammer', b: 44, svg: `<svg viewBox="0 0 44 120"><circle cx="22" cy="4" r="3" fill="none" stroke="${STD}" stroke-width="1.5"/><rect x="17" y="18" width="10" height="98" rx="4" fill="${WOOD}" stroke="${WOODD}"/><path d="M4 8 H32 L40 12 V24 H4 Z" fill="${ST}" stroke="${STD}"/><path d="M32 8 L40 4 V12" fill="${ST}" stroke="${STD}"/></svg>` },
  { titel: 'Fuchsschwanz', b: 60, svg: `<svg viewBox="0 0 60 130"><path d="M18 30 L42 30 L48 128 L12 128 Z" fill="${STL}" stroke="${STD}"/><path d="M12 128 ${Array.from({ length: 12 }, (_, i) => `L${12 + i * 3 + 1.5} 131 L${12 + i * 3 + 3} 128`).join(' ')}" fill="${STL}" stroke="${STD}" stroke-width=".6"/><path d="M12 2 H48 Q52 2 52 6 V34 H8 V6 Q8 2 12 2 Z" fill="${WOOD}" stroke="${WOODD}"/><rect x="18" y="10" width="24" height="14" rx="6" fill="#d8c6a3"/></svg>` },
  { titel: 'Schraubzwinge', b: 56, svg: `<svg viewBox="0 0 56 120"><rect x="8" y="4" width="6" height="112" fill="${ST}" stroke="${STD}"/><rect x="6" y="6" width="38" height="10" rx="2" fill="${RED}"/><rect x="6" y="78" width="38" height="10" rx="2" fill="${RED}"/><rect x="34" y="88" width="4" height="10" fill="${STD}"/><rect x="30" y="98" width="12" height="20" rx="5" fill="${WOOD}" stroke="${WOODD}"/><rect x="30" y="16" width="12" height="5" fill="${STD}"/></svg>` },
  { titel: 'Schraubendreher', b: 52, svg: `<svg viewBox="0 0 52 120">${[[8, RED, 70], [24, YEL, 86], [40, BLUE, 60]].map(([x, c, l]) => `<rect x="${x - 4}" y="4" width="8" height="30" rx="3.5" fill="${c}"/><rect x="${x - 1.2}" y="34" width="2.4" height="${l}" fill="${ST}"/><rect x="${x - 2}" y="${32 + l}" width="4" height="4" fill="${STD}"/>`).join('')}</svg>` },
];
