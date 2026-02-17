import Step from "../ui/Step";

function HowItWorks() {
  return (
    <section className="pb-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-h2 mb-2">How it Works</h2>
        <p className="text-neutral-600 mb-12">Get started in 5 simple steps</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <Step number="01" title="Sign Up" brief="Create your account" />
          <Step number="02" title="Save Money" brief="Set payment schedule" />
          <Step number="03" title="Choose Plan" brief="Add savings regularly" />
          <Step number="04" title="Track Progress" brief="Monitor your goals" />
          <Step number="05" title="Redeem" brief="Withdraw when ready" />
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
