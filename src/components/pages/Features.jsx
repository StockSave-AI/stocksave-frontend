import AdvancedSection from "../layout/AdvancedSection";
import FeatureGrid from "../layout/FeatureGrid";
import FeaturesHero from "../layout/FeaturesHero";
import Navbar from "../layout/Navbar";

export default function Features() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesHero />
          <FeatureGrid />
          <AdvancedSection />
        </div>
      </main>
    </>
  );
}
