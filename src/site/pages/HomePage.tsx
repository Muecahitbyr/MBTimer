import { faq, getPricingFaq } from '../../config/site';
import { pricing } from '../../config/pricing';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import HeroSection from '../sections/HeroSection';
import LegalNoteSection from '../sections/LegalNoteSection';
import ProblemSolutionSection from '../sections/ProblemSolutionSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import KioskSection from '../sections/KioskSection';
import PricingSection from '../pricing/PricingSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';

const homeFaq = [...faq.slice(0, 3), ...getPricingFaq(pricing.setupService.price), ...faq.slice(3)];

export default function HomePage() {
  usePageMeta(pageMeta['/']);
  return (
    <>
      <HeroSection />
      <LegalNoteSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <KioskSection />
      <PricingSection />
      <FaqSection items={homeFaq} />
      <ContactSection />
    </>
  );
}
