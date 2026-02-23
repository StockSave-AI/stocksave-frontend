import { useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiCalendar } from "react-icons/fi";

const getStatusConfig = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "completed") {
    return {
      icon: <FiCheckCircle className="text-success text-3xl" />,
      badge: "bg-success/10 text-success",
    };
  }

  if (normalized === "scheduled") {
    return {
      icon: <FiCalendar className="text-primary-600 text-3xl" />,
      badge: "bg-primary-100 text-primary-700",
    };
  }

  return {
    icon: <FiClock className="text-warning text-3xl" />,
    badge: "bg-warning/10 text-warning",
  };
};

export default function PaymentHistory({ payments = [] }) {
  const [showAll, setShowAll] = useState(false);

  const visiblePayments = useMemo(() => {
    if (showAll) return payments;
    return payments.slice(0, 3);
  }, [payments, showAll]);

  return (
    <div className="  bg-white shadow-card rounded-card p-6 space-y-5">
      <h2 className="text-h3">Payment History</h2>

      {visiblePayments.map((payment, index) => {
        const config = getStatusConfig(payment.status);

        return (
          <div
            key={payment.id || index}
            className="flex items-center justify-between border bg-neutral-100  border-neutral-300 rounded-lg px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">{config.icon}</div>

              <div>
                <p className="font-semibold text-h6">{payment.amount}</p>
                <p className="text-xs text-neutral-400">{payment.type}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500">{payment.date}</p>
              <p className="text-xs text-neutral-400">{payment.time || ""}</p>

              <span
                className={`inline-block mt-1 text-[10px] px-2 py-1 rounded-full ${config.badge}`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        );
      })}

      {payments.length > 3 && (
        <button
          onClick={() => setShowAll((value) => !value)}
          className="text-primary-600 text-sm font-medium"
        >
          {showAll ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}
