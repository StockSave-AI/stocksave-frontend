import { FiX } from "react-icons/fi";

export default function WithdrawalConfirmModal({
  amountLabel,
  methodLabel,
  onConfirm,
  onCancelToDashboard,
  onClose,
  isSubmitting = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-card border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-neutral-800">
            Confirm Withdrawal
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition"
            aria-label="Close confirmation"
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="text-neutral-600 mb-2">
          You are about to request a withdrawal of{" "}
          <span className="font-semibold text-neutral-800">{amountLabel}</span>.
        </p>
        <p className="text-neutral-500 text-sm mb-6">
          Method:{" "}
          <span className="font-medium text-neutral-700">{methodLabel}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-button font-semibold transition ${
              isSubmitting
                ? "bg-success/60 text-white cursor-not-allowed"
                : "bg-success text-white hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Withdraw"}
          </button>
          <button
            type="button"
            onClick={onCancelToDashboard}
            className="flex-1 bg-white border border-neutral-200 text-neutral-700 py-3 rounded-button font-semibold hover:bg-neutral-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
