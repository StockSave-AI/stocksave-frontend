import TransactionSummary from "./TransactionSummary";

const DepositDetails = ({
  depositAmount,
  setDepositAmount,
  quickAmounts,
  newBalance,
  currentBalance,
}) => {
  return (
    <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
      <h3 className="text-neutral-800 font-semibold mb-4">Deposit Details</h3>

      <p className="text-sm text-neutral-500 mb-2">Deposit Amount</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setDepositAmount(amt)}
            className={`py-3 px-4 rounded-button border transition-all font-medium ${
              depositAmount === amt
                ? "bg-secondary-500 border-secondary-500 text-white shadow-md"
                : "bg-white border-neutral-200 text-neutral-700 hover:border-secondary-300"
            }`}
          >
            ₦{amt.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl font-medium">
          ₦
        </span>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          className="w-full pl-10 pr-4 py-4 rounded-button border border-neutral-200 text-xl font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary-400"
        />
      </div>

      <TransactionSummary
        depositAmount={depositAmount}
        newBalance={newBalance}
        currentBalance={currentBalance}
      />
    </section>
  );
};

export default DepositDetails;
