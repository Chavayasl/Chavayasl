import { VideoHero } from "@/components/home/VideoHero";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { FeaturedActivities } from "@/components/home/FeaturedActivities";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { dbList, dbGetDoc } from "@/lib/storage";
import { ACTIVITIES, type Activity } from "@/lib/data";
import { DEFAULT_CATEGORY_TREE, type CategoryGroup } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [activities, categoryTree] = await Promise.all([
    dbList<Activity>("activities", ACTIVITIES),
    dbGetDoc<CategoryGroup[]>("categories", DEFAULT_CATEGORY_TREE),
  ]);
  return (
    <>
      <VideoHero />
      <FeaturesBanner />
      <FeaturedActivities allActivities={activities} categoryTree={categoryTree} />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
