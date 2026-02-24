import PaymentHistory from "./PaymentHistory";

export default function PaymentHistorySection({ history }) {
  if (history.length > 0) {
    return <PaymentHistory payments={history} />;
  }

  return (
    <div className="bg-white shadow-card rounded-card p-6">
      <h2 className="text-h3">Payment History</h2>
      <p className="text-sm text-neutral-500 mt-2">No payment history yet.</p>
    </div>
  );
}
