import { FiEye } from "react-icons/fi";
import { formatCurrency } from "../../../utils/currency";

const ReconciliationInsightCard = ({
  reconciliation,
  isRead,
  onToggleRead,
  onOpenDashboard,
}) => {
  const deposits = Number(reconciliation?.total_deposits || 0);
  const withdrawals = Number(reconciliation?.total_withdrawals || 0);
  const bookingHolds = Number(reconciliation?.total_booking_holds || 0);
  const pending = Number(reconciliation?.total_pending || 0);
  const netBalance = Number(reconciliation?.net_balance || 0);
  const isBalanced = Boolean(reconciliation?.is_balanced) && netBalance >= 0;

  const availableSlotsBudget = Math.max(0, deposits - withdrawals);
  const allocatedSlots = bookingHolds;
  const slotMismatch = allocatedSlots - availableSlotsBudget;
  const hasSlotMismatch = slotMismatch > 0;

  const overbookingRisk = hasSlotMismatch;
  const phantomStockRisk = hasSlotMismatch;
  const accountingRisk = !isBalanced;

  const cardTint = isBalanced
    ? "border-emerald-200 bg-emerald-50/40"
    : "border-red-200 bg-red-50/50";

  return (
    <div className={`rounded-card border p-4 md:p-5 ${cardTint}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            Financial Reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
              isRead
                ? "text-emerald-700 bg-emerald-100"
                : "text-red-700 bg-red-100 border border-red-200"
            }`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
          <button
            onClick={onToggleRead}
            className="px-3 py-1.5 rounded-button border border-neutral-200 bg-white text-xs text-neutral-700"
          >
            {isRead ? "Mark unread" : "Mark read"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Deposits</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(deposits)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Withdrawals</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(withdrawals)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Booking Holds</p>
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(bookingHolds)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
          <p className="text-[11px] text-neutral-500">Net Balance</p>
          <p
            className={`text-sm font-semibold ${
              netBalance >= 0 ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {formatCurrency(netBalance)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            overbookingRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Overbooking risk: {overbookingRisk ? "Detected" : "Clear"}
        </div>
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            phantomStockRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Phantom stock risk: {phantomStockRisk ? "Detected" : "Clear"}
        </div>
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            accountingRisk
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Accounting consistency: {accountingRisk ? "Issue" : "Healthy"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-neutral-500">
          Pending amount: {formatCurrency(pending)}
        </p>
        <button
          onClick={onOpenDashboard}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-button bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
        >
          <FiEye size={14} />
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default ReconciliationInsightCard;
