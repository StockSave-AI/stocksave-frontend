import { FiCheck } from "react-icons/fi";

const cashPickupSteps = [
  "Visit our authorized agent",
  "Provide your registered phone number",
  "Give the agent your transaction reference",
  "Collect your cash",
];

export default function CashPickupInstructions() {
  return (
    <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-card">
      <h3 className="text-neutral-700 font-semibold mb-4">Cash Pickup Instructions</h3>
      <div className="space-y-3">
        {cashPickupSteps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 text-sm text-neutral-600">
            <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-success" size={14} />
              <span>{step}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
