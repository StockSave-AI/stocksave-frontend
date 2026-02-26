import AdvancedGrid from "./AdvancedGrid";
import CallToAction from "./CallToAction";

export default function AdvancedSection() {
  return (
    <section className="pt-10 sm:pt-12 pb-16 sm:pb-20">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Advanced Capabilities
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600">
          Professional tools for serious savers
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        <AdvancedGrid />
        <CallToAction />
      </div>
    </section>
  );
}
