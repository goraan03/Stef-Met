import { HeroSection } from './home/HeroSection';
import { StatsSection } from './home/StatsSection';
import { AboutSection } from './home/AboutSection';
import { CategoriesSection } from './home/CategoriesSection';
import { FeaturedEquipmentSection } from './home/FeaturedEquipmentSection';
import { WhyChooseSection } from './home/WhyChooseSection';
import { CTASection } from './home/CTASection';

export function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <CategoriesSection />
      <FeaturedEquipmentSection />
      <WhyChooseSection />
      <CTASection />
    </div>
  );
}