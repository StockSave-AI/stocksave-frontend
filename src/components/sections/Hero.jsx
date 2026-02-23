import { IoArrowForwardOutline } from "react-icons/io5";
import HeroImageLayout from "./HeroImageLayout";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 items-center">
        <div className="lg:px-12">
          <h1 className="text-h1 mb-6 tracking-wide">
            Save Smart, <span className="text-primary-500">Share Food, </span>{" "}
            Build Wealth
          </h1>

          <p className="text-neutral-600 mb-8">
            Join our AI-powered thrift savings platform with shared food
            inventory management.
          </p>

          <div className="flex gap-4 mb-10">
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary-500 text-white px-6 py-3 rounded-button"
            >
              <div className="flex justify-center items-center md:gap-2">
                Get Started <IoArrowForwardOutline />
              </div>
            </button>

            <button
              onClick={() => navigate("/about")}
              className="border border-neutral-300 px-6 py-3 rounded-button"
            >
              Learn More
            </button>
          </div>

          <div className="flex gap-10 text-sm text-neutral-600">
            <div>
              <p className="text-lg font-semibold">50</p>
              <p>Active Users</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-primary-500">₦500+</p>
              <p>Total Savings</p>
            </div>
            <div>
              <p className="text-lg font-semibold">47</p>
              <p>Active Plans</p>
            </div>
          </div>
        </div>

        <HeroImageLayout />
      </div>
    </section>
  );
}
