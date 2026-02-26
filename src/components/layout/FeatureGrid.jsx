import FeatureCard from "./FeatureCard";
import { featuresData } from "./featuresData";

export default function FeatureGrid() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
        {featuresData.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      <div className="mt-12 sm:mt-14 border-t border-neutral-100" />
      <div className="h-20 sm:h-28" />
    </section>
  );
}
