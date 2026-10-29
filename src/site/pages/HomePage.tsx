import { faq, getPricingFaq } from '../../config/site';
import { pricing } from '../../config/pricing';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import HeroSection from '../sections/HeroSection';
import DevicesSection from '../sections/DevicesSection';
import FeaturesSection from '../sections/FeaturesSection';
import PricingSection from '../pricing/PricingSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';

// Startseite bewusst kurz: die fünf häufigsten Fragen; alle Preisfragen stehen unter /preise.
const allFaq = [...faq, ...getPricingFaq(pricing.setupService.price)];
const homeQuestions = [
  'Ist Arbeitszeiterfassung Pflicht?',
  'Welche Geräte brauche ich?',
  'Sind die Preise verbindlich?',
  'Wie steht es um den Datenschutz?',
  'Wie kann ich kündigen?',
];
const homeFaq = homeQuestions.map((q) => allFaq.find((f) => f.q === q)).filter((f) => f !== undefined);

export default function HomePage() {
  usePageMeta(pageMeta['/']);
  return (
    <>
      <HeroSection />
      <DevicesSection />
      <FeaturesSection />
      <PricingSection compact />
      <FaqSection items={homeFaq} />
      <ContactSection />
    </>
  );
}
