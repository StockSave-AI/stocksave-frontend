import { IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-primary-500  shadow-[0_5px_15px_rgba(0,0,0,0.3)] text-white text-center p-12 rounded-card">
          <h2 className="text-h2 mb-4">Ready to Start Saving?</h2>

          <p className="mb-6 mx-auto max-w-xl text-center">
            Join thousands of users who are building their savings and reducing
            food waste with Stock Save AI.
          </p>

          <div className="flex justify-center">
            <button
              className="bg-secondary-400 text-white px-6 py-3 rounded-button flex items-center gap-2"
              onClick={() => navigate("/signup")}
            >
              Create Free Account <IoArrowForwardOutline />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
