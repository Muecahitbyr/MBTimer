# MBzeit – Webseite & Demo

Marketing-Webseite und klickbare Demo für **MBzeit**, eine webbasierte Arbeitszeiterfassung mit
Personalverwaltung für Arzt- und Zahnarztpraxen. Rein statisch: kein Backend, keine Datenbank,
keine Cookies, kein Tracking, keine externen Schriften oder CDNs.

- **Webseite** (`/`, `/preise`, `/impressum`, `/datenschutz`): wird beim Build als statisches HTML vorgerendert.
- **Demo** (`/demo`): läuft komplett im Browser mit erfundenen Daten der fiktiven „Zahnarztpraxis Sonnenschein“.

## Voraussetzungen

- Node.js 22 (getestet mit 22.23) und npm 10

## Installieren, starten, bauen

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Entwicklungsserver: http://localhost:5173
npm run build        # Typprüfung, Build und Prerendering → dist/
npm run preview      # gebaute Seite lokal ansehen: http://localhost:4173
```

Weitere Befehle:

```bash
npm test             # Unit-Tests (Vitest): Preisrechner, URL-Parameter, Zeitberechnung, Feiertage, Demo-Store
npm run lint         # ESLint (inkl. jsx-a11y)
npm run screenshots  # Demo-Screenshots für die Webseite neu erzeugen (public/screenshots/*.webp)
npm run screenshots -- --pricing <ordner>   # Preisseite Desktop + Handy als PNG
```

Für `npm run screenshots` wird einmalig der Playwright-Browser benötigt: `npx playwright install chromium`.
Das Skript startet selbst einen Dev-Server, meldet sich in der Demo an und fotografiert sie mit fester Uhrzeit 10:15.

> Hinweis zu `npm run preview`: Der Vite-Preview-Server liefert für `/preise` (ohne Schrägstrich am Ende) die
> Startseiten-Datei aus. Die Seite funktioniert trotzdem (sie wird dann im Browser gerendert), nur das
> Prerendering greift lokal dort nicht. Auf Cloudflare wird `preise/index.html` direkt ausgeliefert.

## Deployment (Cloudflare)

`dist/` ist ein fertiger statischer Ordner. Es wurde nichts deployt.

- **Cloudflare Pages:** Build-Befehl `npm run build`, Ausgabeordner `dist`. Da es keine `404.html` gibt,
  behandelt Pages das Projekt als Single-Page-App: Vorhandene Dateien (z. B. `preise/index.html`) werden direkt
  ausgeliefert, alle anderen Pfade (z. B. `/demo/kiosk`) bekommen `index.html`.
- **Cloudflare Workers (Static Assets):** `assets.directory = "./dist"` und
  `assets.not_found_handling = "single-page-application"`.

Andere Pfade als die vorgerenderten bekommen also die Startseiten-HTML. Ein kleines Inline-Skript blendet
deren Inhalt dann aus, und die App rendert die richtige Seite im Browser.

## Preise ändern

Alle Preise und preisbezogenen Texte stehen **ausschließlich** in [`src/config/pricing.ts`](src/config/pricing.ts).
Nirgends sonst sind Beträge hartcodiert – Tarifkarten, Kostenrechner, Vergleichstabelle, FAQ und Meta-Texte
lesen alle aus dieser Datei.

| Feld | Bedeutung |
|---|---|
| `vatMode` | `'net'` → Hinweis „zzgl. MwSt.“ und Schalter „Beträge brutto anzeigen“; `'kleinunternehmer'` → „gem. § 19 UStG keine Umsatzsteuer“, kein Brutto-Schalter |
| `vatRate` | MwSt.-Satz, nur für die optionale Brutto-Anzeige (z. B. `0.19`) |
| `yearlyFreeMonths` | Gratis-Monate bei Jahreszahlung (`2` → Jahrespreis = 10 × Monatspreis) |
| `trialDays` | Testzeitraum (erscheint in „30 Tage kostenlos testen …“) |
| `tiers` | Tarife: `name`, `maxEmployees` (Grenze; `null` = individuelle Kalkulation), `monthlyNet` (netto/Monat; `null` = „auf Anfrage“), `tagline`, `extras`, optional `badge` (z. B. „Beliebt“) |
| `setupService` | Einrichtungsservice: `price` (einmalig), `label`, `items` |
| `includedFeatures` | Funktionen, die in allen Tarifen enthalten sind |
| `calculator` | Bereich des Mitarbeiter-Reglers (`1`–`60`; Werte über der höchsten Grenze zeigen „50+“) |

Ebenfalls dort: `PRICE_DISCLAIMER` (Pflichthinweis „Unverbindliche Beispielrechnung – kein Angebot …“),
`vatNote()` und `trialNote()`.

Regeln, die der Code automatisch einhält:

- Vor jedem Betrag steht „ca.“. Beträge werden auf ganze Euro gerundet, pro Kopf auf 10 Cent.
- Der Rechner wählt den kleinsten Tarif, dessen Grenze reicht. Oberhalb der höchsten Grenze erscheint „individuelle Kalkulation“ ohne Betrag.
- Upgrade-Hinweis bei Grenze − 1 und Grenze (z. B. 9 oder 10 von 10).

Nach Änderungen bitte `npm test` ausführen. Die Tests in
[`src/site/pricing/calculate.test.ts`](src/site/pricing/calculate.test.ts) prüfen die Tarifgrenzen
1/10/11/25/26/50/51, Jahrespreis, Ersparnis, Einrichtung, Pro-Kopf-Wert, Brutto und ungültige Eingaben.
Sie gehen von den aktuellen Werten aus (49/89/149 €, Grenzen 10/25/50) und müssen bei geänderten Preisen
mit angepasst werden.

Eine Rechnung lässt sich als Link teilen, z. B. `/preise?ma=18&zahlweise=jahr&einrichtung=1` (optional `&brutto=1`).

## Texte und Platzhalter

Webseitentexte (Hero, Funktionen, Schritte, Kiosk, FAQ, Kontakt) stehen in [`src/config/site.ts`](src/config/site.ts),
Seitentitel und Meta-Beschreibungen in [`src/site/seo.ts`](src/site/seo.ts).

**Vor einer Veröffentlichung zu ersetzen:**

- `src/config/site.ts`
  - `contactEmail`: aktuell `kontakt@example.com`
  - `companyName`: `{{FIRMENNAME}}`, erscheint in der Fußzeile
  - FAQ „Datenschutz“: Hosting-Standort, AVV, technische Maßnahmen
  - FAQ „Support“: Kanäle, Erreichbarkeit
  - FAQ „Kündigung“: Kündigungsfrist aus den AGB
- `src/site/pages/ImpressumPage.tsx`: alle `{{…}}`-Angaben
- `src/site/pages/DatenschutzPage.tsx`: alle `{{PLATZHALTER}}`/`{{TODO}}`-Angaben (rechtlich prüfen lassen)
- Bewusst **nicht** enthalten, weil unbelegt: Serverstandort, Zertifikate, Kundenzahlen, Kundenstimmen, Logos.
  Wo solche Angaben hingehören, steht im Text ein `{{TODO}}`.

Alle offenen Platzhalter findest du mit `grep -rn "{{[A-Z]" src`.

## Demo

- Login ohne Passwort mit vier Rollen: **Chef**, **Praxis-Admin**, **Urlaubsbeauftragte**, **Mitarbeiterin**. Die Rolle bestimmt, was sichtbar ist (siehe [`src/demo/lib/permissions.ts`](src/demo/lib/permissions.ts)).
- **Funktionen:**
  - Dashboard
  - Zeiterfassung mit Stempeln und aufklappbaren Kalenderwochen
  - Urlaub (beantragen, zurückziehen, genehmigen)
  - Krankmeldung und Freistellung eintragen
  - Urlaubskalender
  - Zeitkorrekturen (beantragen, genehmigen)
  - Mitarbeiterliste
  - Neuigkeiten
  - Kiosk-Ansicht mit PIN-Feld (Demo-PINs werden angezeigt) und Offline-Hinweis (auch per Schalter simulierbar)
- **Daten:** in [`src/demo/data/`](src/demo/data/)
  - 12 erfundene Mitarbeiter, nur `@example.com`-Adressen
  - Arbeitszeitpläne, Abwesenheiten, Korrekturanträge und Neuigkeiten
  - Alle Daten sind **relativ zum heutigen Tag** definiert, die Demo ist also immer aktuell.
  - Stempelzeiten für die letzten ca. 3 Monate werden deterministisch aus den Arbeitszeitplänen erzeugt.
  - Feiertage: Nordrhein-Westfalen
- **Speicher:** Änderungen liegen nur im Browser (`localStorage`, verfallen am nächsten Tag). „Demo zurücksetzen“ stellt den Ausgangszustand wieder her.
- `/demo` ist per `robots.txt` von Suchmaschinen ausgeschlossen.

## Aufbau

```
src/
  config/        pricing.ts (Preise), site.ts (Texte)
  site/          Webseite: layout/, sections/, pages/, pricing/ (Rechner, Tarifkarten), seo.ts
  demo/          Demo: data/ (Testdaten), store/ (Zustand), lib/ (Zeitrechnung, Feiertage, Rechte), pages/, components/
  components/    gemeinsam genutzt (Logo, Hell/Dunkel-Schalter, Skip-Link …)
  theme/         MUI-Theme (hell/dunkel, Akzentfarbe „klinisches Blau“ #1D5FA8)
  Root.tsx       Provider für Browser und Prerendering
  main.tsx       Browser-Einstieg (Hydration bzw. Rendern)
  entry-server.tsx  Prerender-Einstieg
scripts/
  prerender.mjs     erzeugt dist/*.html beim Build
  screenshots.mjs   erzeugt die Demo-Screenshots
public/
  screenshots/   echte Screenshots der Demo (WebP)
```

**Technik:**
- Vite, React 19, TypeScript (strict), Material UI 9 und React Router 7
- Schrift Inter, lokal über `@fontsource-variable/inter`
- Keine weiteren Laufzeitbibliotheken

## Qualität (Stand der Umsetzung)

Lighthouse 12, lokal über einen Server mit Brotli-Komprimierung:

| Seite | Performance mobil | Performance Desktop | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` | 99–100 | 100 | 100 | 100 | 100 |
| `/preise` | 94–95 | 100 | 100 | 100 | 100 |
| `/impressum` | 99–100 | 100 | 100 | 100 | 100 |
| `/demo` | 99–100 | – | 100 | 100 | (per robots.txt ausgeschlossen) |

**Barrierefreiheit:**
- Kontraste nach WCAG AA
- Skip-Link
- vollständige Tastaturbedienung (auch Regler und PIN-Feld)
- `aria-live` für Rechner-Ergebnis und Stempelstatus
- Alt-Texte für alle Screenshots
- kein horizontales Scrollen ab 320 px Breite
