import { ContinueWatching } from "./components/continue-watching";
import { HeroBanner } from "./components/hero-banner";
import { LearningJourney } from "./components/learning-journey";
import { StatsCards } from "./components/stats-cards";

export default function MyCoursesPage() {
  return (
    <div className="mx-auto  px-4 py-6 md:px-10 lg:px-24">
      <HeroBanner />
      <StatsCards />
      <LearningJourney />
      <ContinueWatching />
    </div>
  );
}
