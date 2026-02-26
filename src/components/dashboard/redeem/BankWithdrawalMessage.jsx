import { FiCheckCircle, FiX } from "react-icons/fi";
import { formatCurrency } from "../../../utils/currency";

export default function BankWithdrawalMessage({ message, details, onClose }) {
  const reference = details?.reference || details?.data?.reference || null;
  const newBalanceRaw =
    details?.new_balance ?? details?.data?.new_balance ?? null;
  const parsedBalance = Number(newBalanceRaw);
  const hasBalance = Number.isFinite(parsedBalance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-card border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-success">
            <FiCheckCircle size={20} />
            <h3 className="font-semibold">Request Received</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition"
            aria-label="Close confirmation"
          >
            <FiX size={18} />
          </button>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          {message}
        </p>
        {reference || hasBalance ? (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 space-y-1">
            {reference ? (
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">Reference:</span>{" "}
                {reference}
              </p>
            ) : null}
            {hasBalance ? (
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">New Balance:</span>{" "}
                {formatCurrency(parsedBalance)}
              </p>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full bg-success text-white py-2.5 rounded-button font-semibold hover:bg-green-700 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
