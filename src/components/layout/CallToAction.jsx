import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="mt-10 sm:mt-12">
      <div className="rounded-3xl border border-emerald-100 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-100 via-sky-50 to-white px-5 sm:px-10 py-10 sm:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Ready to Start Saving?
            </h2>

            <p className="mt-3 text-sm sm:text-base text-neutral-600">
              Join thousands of Nigerians who are already building their
              financial future with Stock Save AI.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white px-6 py-3 text-sm font-semibold hover:bg-primary-700 transition"
              >
                Create Free Account <FiArrowUpRight className="text-base" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition"
              >
                Talk to Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
