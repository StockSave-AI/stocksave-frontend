export default function FeaturesHero() {
  return (
    <section className="pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 border border-primary-100 px-4 py-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          Powerful Features
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
          Everything You Need to <span className="text-primary-600">Save</span>
          <br className="hidden sm:block" />
          <span className="text-primary-600"> &amp; Thrive</span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-600 leading-relaxed">
          Stock Save AI combines cutting-edge technology with traditional thrift
          savings to give you powerful tools for financial growth and food
          access management.
        </p>

        <div className="mt-10 w-full border-t border-neutral-100" />
      </div>
    </section>
  );
}
