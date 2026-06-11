import { VideoHero } from "@/components/home/VideoHero";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedActivities } from "@/components/home/FeaturedActivities";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <FeaturesBanner />
      <StatsSection />
      <FeaturedActivities />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
