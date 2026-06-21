import { VideoHero } from "@/components/home/VideoHero";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedActivities } from "@/components/home/FeaturedActivities";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { dbList } from "@/lib/storage";
import { ACTIVITIES, type Activity } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const activities = await dbList<Activity>("activities", ACTIVITIES);
  return (
    <>
      <VideoHero />
      <FeaturesBanner />
      <StatsSection />
      <FeaturedActivities allActivities={activities} />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
