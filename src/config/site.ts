/**
 * Texte der Webseite.
 * Hinweis: Keine unbelegten Aussagen (Serverstandort, Zertifikate, Kundenzahlen, Kundenstimmen) aufnehmen.
 */

import { provider } from './legal';

export const siteConfig = {
  productName: 'MBTimer',
  /** Empfänger für Kontaktformular und Anfragen (mailto). */
  contactEmail: provider.email,
  companyName: provider.company,
};

export const nav = [
  { label: 'Funktionen', href: '/#funktionen' },
  { label: 'So funktioniert’s', href: '/#ablauf' },
  { label: 'Kiosk-Tablet', href: '/#kiosk' },
  { label: 'Preise', href: '/preise' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontakt', href: '/#kontakt' },
];

export const hero = {
  eyebrow: 'Arbeitszeiterfassung für Betriebe mit Mitarbeitern',
  title: 'Arbeitszeit erfassen, ohne Zettel und Excel.',
  text:
    'MBTimer erfasst Arbeitszeiten, Urlaub und Abwesenheiten Ihres Teams – am Kiosk-Tablet, am PC oder am Handy. ' +
    'Übersichtlich für die Mitarbeiter, nachvollziehbar für die Leitung. Ob Arztpraxis, Handwerk, Gastronomie, ' +
    'Handel oder Büro: MBTimer passt zu jedem Betrieb mit Mitarbeitern.',
  primaryCta: 'Demo ansehen',
  secondaryCta: 'Kontakt aufnehmen',
  points: ['Stempeln per PIN am Tablet', 'Urlaub & Krankmeldungen an einem Ort', 'Läuft im Browser – keine Installation'],
};

export const legalNote = {
  title: 'Arbeitszeiterfassung ist in Deutschland Pflicht',
  text:
    'Nach dem Beschluss des Bundesarbeitsgerichts vom 13. September 2022 (Az. 1 ABR 22/21) sind Arbeitgeber in ' +
    'Deutschland grundsätzlich verpflichtet, die Arbeitszeiten ihrer Beschäftigten zu erfassen. MBTimer hilft Ihnen, ' +
    'Arbeitszeiten digital und nachvollziehbar zu dokumentieren.',
  disclaimer: 'Dieser Hinweis ist keine Rechtsberatung. Für Ihre individuelle Situation wenden Sie sich bitte an eine fachkundige Stelle.',
};

export const problemSolution = {
  title: 'Schluss mit Zettelwirtschaft',
  intro: 'Viele Betriebe erfassen Arbeitszeiten noch auf Papier oder in Tabellen. Das kostet Zeit – und sorgt für Rückfragen.',
  problems: [
    { title: 'Stundenzettel & Stempelkarten', text: 'Handschriftliche Zeiten müssen am Monatsende abgetippt und nachgerechnet werden.' },
    { title: 'Excel-Tabellen', text: 'Formeln gehen kaputt, Versionen geraten durcheinander, und niemand weiß, welche Datei aktuell ist.' },
    { title: 'Urlaub per Zuruf', text: 'Anträge auf Zetteln oder per Messenger – wer wann frei hat, ist schwer zu überblicken.' },
  ],
  solutions: [
    { title: 'Stempeln in Sekunden', text: 'Name antippen, PIN eingeben, fertig. Soll, Ist und Überstunden rechnet MBTimer automatisch.' },
    { title: 'Eine gemeinsame Datenbasis', text: 'Alle Zeiten, Abwesenheiten und Korrekturen an einem Ort – mit Protokoll bei Änderungen.' },
    { title: 'Urlaub mit klarem Ablauf', text: 'Antrag stellen, Verantwortliche genehmigen, der Teamkalender zeigt sofort, wer fehlt.' },
  ],
};

export type FeatureIcon =
  | 'clock' | 'calendarWeek' | 'balance' | 'coffee'
  | 'tablet' | 'pin' | 'offline' | 'schedule'
  | 'beach' | 'teamCalendar' | 'sick' | 'event'
  | 'edit' | 'overtime' | 'news' | 'stats' | 'roles' | 'locations' | 'history' | 'devices';

export interface FeatureGroup {
  title: string;
  description: string;
  items: { icon: FeatureIcon; title: string; text: string }[];
}

export const featureGroups: FeatureGroup[] = [
  {
    title: 'Zeiterfassung',
    description: 'Arbeitszeiten digital und nachvollziehbar.',
    items: [
      { icon: 'clock', title: 'Kommen & Gehen stempeln', text: 'Per Klick im Browser oder am Kiosk-Tablet.' },
      { icon: 'calendarWeek', title: 'Monatsübersicht', text: 'Mit aufklappbaren Kalenderwochen und Tagesdetails.' },
      { icon: 'balance', title: 'Soll/Ist & Überstundenkonto', text: 'Abweichungen und Saldo werden automatisch berechnet.' },
      { icon: 'coffee', title: 'Pausen', text: 'Pausenzeiten werden bei der Arbeitszeit berücksichtigt.' },
      { icon: 'schedule', title: 'Arbeitszeitpläne', text: 'Wochenstunden und Arbeitstage pro Mitarbeiter festlegen.' },
    ],
  },
  {
    title: 'Kiosk-Stempeluhr',
    description: 'Ein Tablet am Eingang oder Empfang wird zur Stempeluhr.',
    items: [
      { icon: 'tablet', title: 'Als App im Vollbild', text: 'Als Web-App (PWA) auf dem Tablet installierbar.' },
      { icon: 'pin', title: 'Name antippen, PIN eingeben', text: 'Jeder stempelt mit der eigenen PIN.' },
      { icon: 'offline', title: 'Hinweis bei Verbindungsproblemen', text: 'Fehlt das Internet, zeigt der Kiosk das deutlich an.' },
    ],
  },
  {
    title: 'Urlaub & Abwesenheit',
    description: 'Wer fehlt wann – auf einen Blick.',
    items: [
      { icon: 'beach', title: 'Urlaubsanträge', text: 'Stellen, zurückziehen und von Verantwortlichen genehmigen lassen.' },
      { icon: 'teamCalendar', title: 'Urlaubskalender', text: 'Teamübersicht mit individuellen Urlaubstagen.' },
      { icon: 'sick', title: 'Krankmeldungen', text: 'Krankheitstage erfassen und im Blick behalten.' },
      { icon: 'event', title: 'Freistellungen', text: 'Sonderurlaub und andere Freistellungen eintragen.' },
    ],
  },
  {
    title: 'Verwaltung',
    description: 'Für Geschäftsleitung und Verwaltung.',
    items: [
      { icon: 'edit', title: 'Zeitkorrekturen', text: 'Mitarbeiter beantragen, Chef oder Admin genehmigt.' },
      { icon: 'overtime', title: 'Überstunden-Genehmigung', text: 'Überstunden prüfen und freigeben.' },
      { icon: 'news', title: 'Neuigkeiten', text: 'Ankündigungen an das ganze Team.' },
      { icon: 'stats', title: 'Statistiken', text: 'Auswertungen für die Leitung.' },
      { icon: 'roles', title: 'Rollen & Rechte', text: 'Mitarbeiter, Urlaubsbeauftragte, Admin, Chef.' },
      { icon: 'locations', title: 'Mehrere Standorte', text: 'Mehrere Betriebe und Standorte sind möglich.' },
      { icon: 'history', title: 'Audit-Protokoll', text: 'Änderungen werden nachvollziehbar protokolliert.' },
      { icon: 'devices', title: 'PC, Tablet & Handy', text: 'Responsive im Browser – ohne Installation.' },
    ],
  },
];

export const steps = [
  { title: 'Betrieb einrichten', text: 'Firmendaten und Standorte anlegen, Rollen festlegen.' },
  { title: 'Mitarbeiter anlegen', text: 'Team eintragen, Arbeitszeitpläne und Urlaubstage hinterlegen.' },
  { title: 'Tablet aufstellen', text: 'MBTimer am Eingang oder Empfang als Kiosk-App öffnen – fertig ist die Stempeluhr.' },
  { title: 'Loslegen', text: 'Das Team stempelt, stellt Anträge und sieht seine Zeiten jederzeit selbst.' },
];

export const kiosk = {
  title: 'Die Stempeluhr am Eingang',
  text:
    'Ein handelsübliches Tablet genügt: MBTimer läuft als Web-App im Vollbild. Mitarbeiter tippen ihren Namen an, ' +
    'geben ihre persönliche PIN ein und sind eingestempelt. Ist die Internetverbindung unterbrochen, zeigt der Kiosk ' +
    'einen deutlichen Hinweis.',
  points: [
    'Namenskacheln mit Anwesenheitsstatus',
    'Persönliche PIN pro Mitarbeiter',
    'Vollbild-App (PWA) – kein App-Store nötig',
    'Hinweis bei fehlender Internetverbindung',
  ],
};

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: 'Wie steht es um den Datenschutz?',
    a: 'MBTimer verarbeitet nur die Daten, die für Zeiterfassung und Personalverwaltung nötig sind. Zugriffe sind über Rollen geregelt, Änderungen werden protokolliert. Für die Verarbeitung der Beschäftigtendaten schließen wir mit Ihrem Unternehmen einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Details zu Hosting und technischen Maßnahmen erhalten Sie gern auf Anfrage.',
  },
  {
    q: 'Wie aufwendig ist die Einrichtung?',
    a: 'Sie legen Ihren Betrieb und Ihre Mitarbeiter an, hinterlegen Arbeitszeitpläne und öffnen MBTimer auf dem Kiosk-Tablet. Selbst einrichten ist kostenlos; auf Wunsch übernehmen wir die Einrichtung (siehe Preise).',
  },
  {
    q: 'Welche Geräte brauche ich?',
    a: 'MBTimer läuft im Browser auf PC, Tablet und Handy – eine Installation ist nicht nötig. Für die Stempeluhr am Eingang genügt ein aktuelles Tablet mit Browser.',
  },
  {
    q: 'Wie erreiche ich den Support?',
    a: `Schreiben Sie uns jederzeit an ${siteConfig.contactEmail} – wir melden uns schnellstmöglich. Bei der Einrichtung unterstützen wir Sie auf Wunsch persönlich (siehe Einrichtungsservice unter Preise).`,
  },
  {
    q: 'Wie kann ich kündigen?',
    a: 'MBTimer ist monatlich kündbar – eine formlose E-Mail genügt. Die genauen Bedingungen, auch bei jährlicher Zahlweise, stehen in Ihrem individuellen Angebot.',
  },
];

export const pricingFaq: FaqItem[] = [
  {
    q: 'Sind die Preise verbindlich?',
    a: 'Nein. Alle genannten Beträge sind unverbindliche Richtwerte. Verbindlich ist erst das Angebot, das Sie auf Anfrage von uns erhalten.',
  },
  {
    q: 'Was passiert, wenn mein Team wächst?',
    a: 'Sie können jederzeit in einen größeren Tarif wechseln. Alle Funktionen sind in jedem Tarif enthalten – es ändert sich nur die Mitarbeitergrenze.',
  },
  {
    q: 'Brauche ich ein Tablet?',
    a: 'Nein, das Tablet ist optional. Ihr Team kann auch am PC oder Handy stempeln. Für eine Stempeluhr am Eingang reicht jedes aktuelle Tablet mit Browser.',
  },
];

export const contact = {
  title: 'Kontakt aufnehmen',
  text: 'Sie haben Fragen oder möchten MBTimer testen? Schreiben Sie uns – wir melden uns bei Ihnen.',
  mailNote:
    'Beim Absenden öffnet sich Ihr E-Mail-Programm mit einer vorbereiteten Nachricht. Über diese Webseite werden keine Daten gespeichert oder übertragen.',
};

export const footer = {
  tagline: 'Webbasierte Arbeitszeiterfassung für Betriebe mit Mitarbeitern.',
};

/** Preis-FAQ mit Beträgen aus der Preis-Konfiguration. */
export function getPricingFaq(setupPrice: number): FaqItem[] {
  return [
    ...pricingFaq,
    {
      q: 'Gibt es Einrichtungskosten?',
      a: `Wenn Sie MBTimer selbst einrichten, entstehen keine Einrichtungskosten. Optional übernehmen wir die Einrichtung für ca. ${setupPrice} € einmalig (Mitarbeiter anlegen, Arbeitszeitpläne eintragen, Kiosk-Tablet einrichten).`,
    },
  ];
}
