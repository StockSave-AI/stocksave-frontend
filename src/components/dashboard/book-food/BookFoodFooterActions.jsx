import { FiArrowLeft } from "react-icons/fi";

export default function BookFoodFooterActions({ canConfirm, onConfirm }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 flex flex-col sm:flex-row gap-4 md:relative md:bg-transparent md:border-none md:p-0">
      <button
        onClick={() => window.history.back()}
        className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-xl font-semibold border border-neutral-200 flex items-center justify-center gap-2 hover:bg-neutral-200 transition"
      >
        <FiArrowLeft />
        Back
      </button>

      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className="flex-1 sm:flex-[2] bg-primary-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-600 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
}
