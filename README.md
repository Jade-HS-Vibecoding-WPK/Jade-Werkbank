# Jade Werkbank

Die Werkbank am Ende der [Vibecoding-Allee](https://jade-hs-vibecoding-wpk.github.io/.github/): Jedes Projekt aus dem WPK „Thinking Architecture through Software Design“ (Jade Hochschule, Blockwoche 16.–20.11.2026) liegt hier als Werkzeug, das zu ihm passt. In der Mitte der Bank liegt eine Ablage, in der du Dateien zwischenlagern kannst.

**Live:** https://jade-hs-vibecoding-wpk.github.io/Jade-Werkbank/

## Was die Werkbank kann

- **Werkzeuge:** Ein Klick auf ein Werkzeug öffnet seinen Werkzeugschein mit Beschreibung, Team, Demo, Code und dem Haus in der Allee. Die Liste kommt live aus der Allee (`projects.json`), neue Projekte liegen also von selbst mit auf der Bank. Ist die Allee nicht erreichbar, nimmt die Werkbank die mitgelieferte `projekte.json`.
- **An der Werkbank ausprobieren:** Die Demo öffnet sich in einem Rahmen, und die Ablage liegt daneben. Zettel aus der Ablage kannst du direkt ins Werkzeug ziehen oder mit ← hineinlegen. Das klappt, weil alle Demos auf derselben Adresse liegen wie die Werkbank (`jade-hs-vibecoding-wpk.github.io`): Die Werkbank lässt die Datei dort fallen, wo du loslässt, oder steckt sie in ein passendes Dateifeld.
- **Ablage:** Dateien ablegen per Ziehen, Einfügen (Strg+V) oder Auswählen, dazu Notizzettel für Text. Die Dateien liegen im Browser (IndexedDB), es wird nichts hochgeladen. Auf einem anderen Gerät oder in einem anderen Browser ist die Ablage leer.

## Welches Werkzeug zu welchem Projekt

Zugeordnet wird über den Hausstil in der Allee, damit Umbenennungen nichts durcheinanderbringen (`werkzeuge.js`).

| Projekt | Werkzeug | warum |
|---|---|---|
| TERRA-Sim | Wasserwaage | zeigt, wo das Wasser steht |
| ParaGecko | Zollstock | misst jedes Grundstück an den Paragraphen |
| gebaeudehoehentool-umgebungsmodell | Senklot | für Gebäudehöhen und ihr Umfeld |
| laserdatei-aus-3D | Cutter | schneidet Karton fürs Modell |
| Grundstuecksanalyse-Tool | Maßband | misst das Grundstück aus |
| SiteKick | Zirkel | zieht Kreise um den Standort |
| Modellbau-Laserdatei-Gebaeude | Pinzette | für die feinen Teile im Modellbau |
| Energieeffizienz-Oekobilanz-Optimierung | Thermometer | misst, wie warm ein Haus bleibt |
| CO-Emissionsrechner | Taschenrechner | rechnet die Emissionen zusammen |
| plan-pruefer | Lupe | prüft Pläne bis ins Detail |
| urban-analysis-plugin | Pflanzschaufel | setzt Blöcke und Setzlinge |
| 15-min-stadt-scanner | Stoppuhr | alles in 15 Minuten erreichbar? |
| fassaden-tool | Farbrolle | für neue Fassaden |
| treppenplaner | Anschlagwinkel | damit jede Stufe stimmt |
| Map2Model | Laubsäge | sägt die Karte ins Sperrholz |
| Workflow_App | Klemmbrett | hält den Ablauf fest |
| Detailpruefer | Messschieber | misst jedes Detail nach |
| locus | Stecknadeln | pinnt Standorte auf die Karte |
| ImmoCheck | Hausschlüssel | schließt die Immobilie auf |
| urban-analyst | Fernglas | blickt über das ganze Stadtgebiet |
| MaterialMatch | Musterfächer | findet das passende Material |
| niedersachsen-cache | Sortierkasten | hält die Karten griffbereit |
| alles Neue | Schraubenschlüssel | ein Werkzeug für alles, was neu dazukommt |

## Selbst starten

Reines HTML, CSS und JavaScript ohne Build-Schritt. Weil die Seite ES-Module lädt, braucht sie einen kleinen Webserver:

```sh
python -m http.server 8000
```

Dann http://localhost:8000 öffnen. Lokal liegen die Demos auf einer anderen Adresse als die Werkbank, deshalb klappt das Hineinlegen aus der Ablage nur auf der Live-Seite.

## Dateien

- `index.html`: Aufbau der Werkbank (Schild, Lochwand, Platte, Zarge, Unterbau)
- `style.css`: Holz, Lochwand, Zettel und die Ansicht für schmale Bildschirme
- `app.js`: Projekte laden, Werkzeuge auslegen, Werkzeugschein, Ausprobieren, Ablage
- `werkzeuge.js`: die Werkzeuge als SVG und ihre Zuordnung zu den Projekten
- `ablage.js`: Speichern der Dateien in IndexedDB
- `projekte.json`: mitgelieferte Projektliste für den Fall, dass die Allee nicht erreichbar ist
