import type { ISODate } from '../lib/date';
import type { NewsItem } from './types';
import { rel } from './relative';

export function createNews(today: ISODate): NewsItem[] {
  return [
    {
      id: 'n1',
      title: 'Neues Kiosk-Tablet am Empfang',
      body: 'Ab sofort steht das neue Tablet am Empfang. Bitte stempelt Kommen und Gehen dort mit eurer PIN. Bei Problemen meldet euch bei Sabine.',
      authorId: 'e2',
      date: rel(today, 0, 1),
      pinned: true,
    },
    {
      id: 'n2',
      title: 'Urlaubsplanung für das kommende Jahr',
      body: 'Bitte tragt eure Urlaubswünsche für das nächste Jahr bis Ende des Monats in MBTimer ein. Melanie koordiniert die Planung.',
      authorId: 'e3',
      date: rel(today, -1, 3),
    },
    {
      id: 'n3',
      title: 'Teamfortbildung Hygiene',
      body: 'Die interne Hygieneschulung findet am Mittwoch in zwei Wochen nach der Sprechstunde statt. Die Zeit wird als Arbeitszeit erfasst.',
      authorId: 'e1',
      date: rel(today, -2, 2),
    },
    {
      id: 'n4',
      title: 'Praxisausflug',
      body: 'Danke für den schönen Teamausflug! Fotos liegen im gemeinsamen Ordner.',
      authorId: 'e1',
      date: rel(today, -6, 5),
    },
  ];
}
