import { IoArrowForwardOutline } from "react-icons/io5";
import HeroImageLayout from "./HeroImageLayout";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6  py-20 grid gap-12 items-center">
        <div className="lg:px-12">
          <h1 className="text-h1 mb-6 tracking-wide">
            Save Smart, <span className="text-primary-500">Share Food, </span>{" "}
            {""}Build Wealth
          </h1>

          <p className="text-neutral-600 mb-8">
            Join our AI-powered thrift savings platform with shared food
            inventory management.
          </p>

          <div className="flex gap-4 mb-10">
            <button className="bg-primary-500 text-white px-6 py-3 rounded-button">
              <div className="flex justify-center items-center md:gap-2 ">
                {" "}
                Get Started{" "}
                <span>
                  {" "}
                  <IoArrowForwardOutline />
                </span>
              </div>
            </button>
            <button className="border border-neutral-300 px-6 py-3 rounded-button">
              Learn More
            </button>
          </div>

          <div className="flex gap-10 text-sm text-neutral-600">
            <div>
              <p className="text-lg font-semibold">50</p>
              <p>Active Users</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-primary-500">N500+</p>
              <p>Active Users</p>
            </div>
            <div>
              <p className="text-lg font-semibold">47</p>
              <p>Active Users</p>
            </div>
          </div>
        </div>

        <HeroImageLayout />
      </div>
    </section>
  );
}
