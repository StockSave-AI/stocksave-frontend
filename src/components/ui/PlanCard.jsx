import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PlanCard({
  name,
  price,
  frequency,
  features,
  popular,
  extraInfo,
  selected,
  extraDescription,
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`relative border rounded-lg flex flex-col gap-4 shadow-md hover:shadow-xl hover:border-primary-500 transition-all
  ${selected ? "scale-105 z-10" : ""} w-full max-w-sm p-6 bg-white`}
    >
      {popular && (
        <span className="absolute top-3 right-4 text-xs font-semibold text-white bg-green-600 px-4 py-1 rounded-full">
          {extraInfo || "Most Popular"}
        </span>
      )}

      <h3 className="font-semibold text-lg text-left mt-6">{name}</h3>

      {extraDescription && (
        <p className="text-sm text-neutral-600 text-left">{extraDescription}</p>
      )}

      <p className="text-2xl font-bold text-left">from {price}</p>
      <p className="text-sm text-neutral-600 text-left">{frequency}</p>

      <ul className="mt-2 flex flex-col gap-2 text-sm text-neutral-600 text-left">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <FiCheckCircle className="text-green-500 flex-shrink-0" /> {feature}
          </li>
        ))}
      </ul>

      <button
        className={`mt-4 px-4 py-2 rounded-button w-full font-semibold transition ${
          selected
            ? "bg-primary-500 text-white hover:bg-green-600"
            : "bg-white text-gray-800 border border-gray-400 hover:bg-gray-50"
        }`}
        onClick={() => navigate("/login")}
      >
        Choose Plan
      </button>
    </div>
  );
}
