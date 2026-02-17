import PlanCard from "../ui/PlanCard";

export default function Pricing() {
  return (
    <section className="py-20  bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-h2 mb-2">Choose Your Plan</h2>
        <p className="text-neutral-600 mb-8 text-center">
          Flexible savings options for everyone
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-14">
          <PlanCard
            name="Basic"
            price="N500"
            frequency="Daily payments"
            features={["Manual savings", "Stock access", "Basic support"]}
          />
          <PlanCard
            name="Standard"
            price="N1000"
            frequency="Weekly payments"
            features={["Manual savings", "Stock access", "Basic support"]}
            popular
            selected
            extraInfo="Most Popular"
            extraDescription="Best value for growing savers"
          />
          <PlanCard
            name="Premium"
            price="N5000"
            frequency="Monthly payments"
            features={["Manual savings", "Stock access", "Basic support"]}
          />
        </div>
      </div>
    </section>
  );
}
