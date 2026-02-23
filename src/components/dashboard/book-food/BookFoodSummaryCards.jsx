import { formatCurrency } from "../../../utils/currency";

export default function BookFoodSummaryCards({
  savingsBalance,
  bookingTotal,
  remainingBalance,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <span className="text-xs text-neutral-400 uppercase font-bold">Your Savings Balance</span>
        <p className="text-2xl font-bold mt-2">{formatCurrency(savingsBalance)}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm text-right">
        <span className="text-xs text-neutral-400 uppercase font-bold">Booking Total</span>
        <p className="text-2xl font-bold mt-2">{formatCurrency(bookingTotal)}</p>
        <p className="text-xs mt-1">Remaining: {formatCurrency(remainingBalance)}</p>
      </div>
    </div>
  );
}
