// Welche Projekte auf welchem Block hängen, sortiert nach Funktion.
// status bestimmt, wohin der Klick führt:
//   'voll'           Live-Demo läuft, Klick öffnet die Demo
//   'eingeschraenkt' Demo nur eingeschränkt nutzbar, Klick öffnet GitHub
//   'github'         keine Web-Demo (z. B. QGIS-Plugin), Klick öffnet GitHub
//   'bald'           Platz ist reserviert, das Symbol hängt als Schatten ohne Link
// Nicht dabei: ParaGecko und niedersachsen-cache (Datendienst).

const ORG = 'https://github.com/Jade-HS-Vibecoding-WPK';
const PAGES = 'https://jade-hs-vibecoding-wpk.github.io';

const p = (repo, titel, symbol, funktion, extra = {}) => ({
  repo,
  titel,
  symbol,
  funktion,
  status: 'voll',
  demo: `${PAGES}/${repo}/`,
  code: `${ORG}/${repo}`,
  ...extra,
});

export const PROJEKTE = Object.fromEntries([
  // Kartentisch
  p('Grundstuecksanalyse-Tool', 'Grundstücksanalyse', 'ebenen', 'Standortanalyse mit Karte, über 60 Ebenen, 3D-Schatten und Export.', { demo: `${PAGES}/Grundstuecksanalyse-Tool/Standortanalyse/` }),
  p('SiteKick', 'SiteKick', 'schwarzplan', 'Lageplan, Schwarzplan, Gebäude, Straßen und Grün eines Gebiets auf einen Blick.'),
  p('locus', 'Locus', 'pin', 'Standortanalyse für jeden Ort in Deutschland: Mobilität, Grün, Nutzungen und Defizite.'),
  p('urban-analyst', 'Urban Analyst', 'fernrohr', 'Städtebauliche Analysepläne aus OpenStreetMap, direkt im Browser.'),
  p('15-min-stadt-scanner', '15-Minuten-Stadt', 'uhr', 'Klick auf die Karte zeigt, was zu Fuß in 5 und 10 Minuten erreichbar ist.'),
  p('urban-analysis-plugin', 'Urban Analysis Plugin', 'puzzle', 'QGIS-Plugin: sammelt Daten, führt sie zusammen, bereinigt Dopplungen und liefert erste Analysen.', {
    status: 'github',
    demo: null,
    hinweis: 'Läuft in QGIS, nicht im Browser.',
  }),
  p('TERRA-Sim', 'TERRA Sim', 'sturm', '3D-Stadtmodell mit Simulation von Hochwasser, Starkregen und Sturm.', {
    status: 'eingeschraenkt',
    hinweis: 'Die Demo zeigt nur ein fertig berechnetes Beispielgebiet.',
  }),
  p('ImmoCheck', 'ImmoCheck', 'hausmuenze', 'Wirtschaftlichkeit von Immobilien prüfen: Kaufcheck, Bestand, Karte, Bodenrichtwert.'),
  // Werkbank
  p('gebaeudehoehentool-umgebungsmodell', 'Gebäudehöhen', 'hoehen', 'Höhen und Geschosse der Gebäude eines Gebiets fürs Umgebungsmodell.'),
  p('Map2Model', 'Map2Model', 'karte3d', 'Aus der Karte ein 3D-Modell und Laserdateien fürs Städtebaumodell.'),
  p('laserdatei-aus-3D', 'Laserdatei aus 3D', 'laser', 'Macht aus einem 3D-Modell eine Laserdatei für den Modellbau.'),
  p('Modellbau-Laserdatei-Gebaeude', 'Modellbau-Laserdatei', 'zuschnitt', 'Aus einer IFC-Datei eine DXF-Laserdatei mit Fenstern und Türen.'),
  p('fassaden-tool', 'Fassaden-Tool', 'fassade', 'Fassadenmaterialien und Öffnungen am Modell ausprobieren und vergleichen.'),
  p('treppenplaner', 'Treppenplaner', 'treppe', 'Treppen nach DIN 18065 berechnen und auswählen.'),
  p('Energieeffizienz-Oekobilanz-Optimierung', 'Energie & Ökobilanz', 'energie', 'Analysiert ein Projekt und schlägt Bauweise und Material für eine bessere Bilanz vor.'),
  p('CO-Emissionsrechner', 'CO₂-Rechner', 'rechner', 'CO₂- und Ökobilanz der Materialien eines Entwurfs, mit Alternativen.', {
    status: 'eingeschraenkt',
    hinweis: 'Die Demo rechnet mit Beispieldaten, die ÖKOBAUDAT-Suche braucht den lokalen Server.',
  }),
  p('MaterialMatch', 'MaterialMatch', 'muster', 'Baustoffe vergleichen und passende, nachhaltigere Alternativen finden.'),
  p('plan-pruefer', 'Plan-Prüfer', 'pruefplan', 'Prüft Baupläne auf Vollständigkeit und Richtigkeit.', {
    status: 'eingeschraenkt',
    hinweis: 'Die Demo spielt nur Beispielpläne ab, eigene Pläne prüft sie nicht.',
  }),
  // Detailprüfer: Platz ist reserviert. Wenn die Demo online ist, status: 'voll' setzen und demo: null entfernen.
  p('Detailpruefer', 'Detailprüfer', 'wandaufbau', 'Prüft Bauteilaufbauten von Wand, Dach und Boden: Schichten, Dämmung, U-Wert und Tauwasser.', {
    status: 'bald',
    demo: null,
  }),
  p('Workflow_App', 'Workflow App', 'klemmbrett', 'Tages-, Wochen- und Projektplanung mit Aufgaben und Zielen, auch fürs Handy.'),
].map((x) => [x.repo, x]));

// Seiten der Blöcke: links und rechts, je Gruppe ein Schild und eine Reihe Haken
export const BLOECKE = [
  {
    id: 'kartentisch',
    name: 'Kartentisch',
    info: 'Karte, Standort und Analyse',
    seiten: {
      links: [
        { titel: 'Standortanalyse', projekte: ['Grundstuecksanalyse-Tool', 'SiteKick', 'locus', 'urban-analyst', '15-min-stadt-scanner', 'urban-analysis-plugin'] },
      ],
      rechts: [
        { titel: 'Risiko', projekte: ['TERRA-Sim'] },
        { titel: 'Immobilie', projekte: ['ImmoCheck'] },
      ],
    },
  },
  {
    id: 'werkbank',
    name: 'Werkbank',
    info: 'Modell, Entwurf und Material',
    seiten: {
      links: [
        { titel: 'Modellbau', projekte: ['gebaeudehoehentool-umgebungsmodell', 'Map2Model', 'laserdatei-aus-3D', 'Modellbau-Laserdatei-Gebaeude'] },
        { titel: 'Entwurf', projekte: ['fassaden-tool', 'treppenplaner'] },
      ],
      rechts: [
        { titel: 'Material & Ökobilanz', projekte: ['Energieeffizienz-Oekobilanz-Optimierung', 'CO-Emissionsrechner', 'MaterialMatch'] },
        { titel: 'Prüfen & Planen', projekte: ['plan-pruefer', 'Detailpruefer', 'Workflow_App'] },
      ],
    },
  },
];
