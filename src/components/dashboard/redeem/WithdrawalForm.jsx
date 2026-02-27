import { FiCreditCard, FiHome, FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../../utils/currency";
import CashPickupInstructions from "./CashPickupInstructions";
import QuickAmountButton from "./QuickAmountButton";

function MethodCard({
  icon,
  title,
  description,
  processing,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 rounded-card p-6 transition-all flex gap-4 text-left ${
        selected ? "border-success bg-success/5" : "border-neutral-200"
      }`}
    >
      {icon}
      <div>
        <p
          className={`font-bold ${selected ? "text-success" : "text-neutral-800"}`}
        >
          {title}
        </p>
        <p className="text-xs text-neutral-500">{description}</p>
        <p className="text-xs text-neutral-400 mt-1">{processing}</p>
      </div>
    </button>
  );
}

export default function WithdrawalForm({
  method,
  onMethodChange,
  selectedAmount,
  onSelectAmount,
  quickAmounts,
  accounts,
  selectedAccount,
  onSelectAccount,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onCancel,
  onSubmit,
  isSubmitting,
  errors,
  accountsLoading,
  accountsError,
}) {
  const selectedAmountNumber = Number(selectedAmount || 0);
  const canSubmit =
    Boolean(method) && selectedAmountNumber > 0 && !isSubmitting;
  const hasCustomValue = selectedAmount !== null && selectedAmount !== "";

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-card">
        <h3 className="text-neutral-500 font-semibold mb-4 text-sm uppercase">
          Withdrawal Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MethodCard
            icon={
              <FiHome
                size={24}
                className={
                  method === "bank" ? "text-success" : "text-neutral-400"
                }
              />
            }
            title="Bank Transfer"
            description="Transfer to your bank account"
            processing="Processing: 2-3 business days"
            selected={method === "bank"}
            onClick={() => onMethodChange("bank")}
          />
          <MethodCard
            icon={
              <FiCreditCard
                size={24}
                className={
                  method === "cash" ? "text-success" : "text-neutral-400"
                }
              />
            }
            title="Cash Pickup"
            description="Collect cash at our location"
            processing="Processing: 1-2 business days"
            selected={method === "cash"}
            onClick={() => onMethodChange("cash")}
          />
        </div>
        {errors.method && (
          <p className="mt-3 text-sm text-error">Select a withdrawal type.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-card">
        <h3 className="text-neutral-500 font-semibold mb-4 text-sm uppercase">
          Withdrawal Amount
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {quickAmounts.map((amt) => (
            <QuickAmountButton
              key={amt}
              amount={amt}
              selectedAmount={selectedAmount}
              onClick={onSelectAmount}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-500 mb-2">Input Amount</p>

        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            ₦
          </span>
          <input
            type="number"
            value={hasCustomValue ? selectedAmount : ""}
            onChange={(e) => onSelectAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
            placeholder="0.00"
          />
        </div>

        {errors.amount && (
          <p className="text-sm text-error mb-3">
            Choose an amount before submitting.
          </p>
        )}

        <div className="bg-neutral-50 rounded-lg p-4 text-sm space-y-1 border border-neutral-100">
          <div className="flex justify-between text-neutral-500">
            <span>Withdrawal Amount:</span>
            <span>
              {formatCurrency(selectedAmountNumber, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between font-bold text-neutral-800">
            <span>You will receive:</span>
            <span>
              {formatCurrency(selectedAmountNumber, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {method === "bank" && (
        <div className="bg-white p-6 rounded-card border border-neutral-200 space-y-4 shadow-card">
          <h3 className="text-neutral-500 font-semibold mb-4 text-sm uppercase">
            Bank Account Details
          </h3>
          {accountsLoading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
            </div>
          ) : null}
          {!accountsLoading && accountsError ? (
            <p className="text-sm text-error">Failed to load bank accounts.</p>
          ) : null}
          {!accountsLoading && !accountsError && accounts.length === 0 && (
            <p className="text-neutral-400 text-sm">
              No bank account added yet.
            </p>
          )}
          {accounts.map((account, idx) => (
            <div
              key={account.id || idx}
              className="w-full border border-neutral-200 rounded-lg p-4 flex items-center justify-between gap-3"
            >
              <button
                type="button"
                onClick={() => onSelectAccount(idx)}
                className="flex items-center gap-3 text-left flex-1"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                  <FiCreditCard className="text-neutral-400" size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    **** **** ****{" "}
                    {String(account.accountNumber || "").slice(-4)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {account.accountName}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {account.bankName}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEditAccount(idx)}
                  className="inline-flex items-center justify-center h-8 px-2 rounded-md text-primary-600 hover:bg-primary-50 transition text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteAccount(idx)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md text-error hover:bg-error/10 transition"
                  aria-label="Delete bank account"
                  title="Delete account"
                >
                  <FiTrash2 size={16} />
                </button>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedAccount === idx
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300 bg-white"
                  }`}
                />
              </div>
            </div>
          ))}
          {errors.account && (
            <p className="text-sm text-error">
              Select a bank account to continue.
            </p>
          )}
          <button
            type="button"
            onClick={onAddAccount}
            className="text-primary-600 text-sm font-semibold mt-2"
          >
            + Add Bank Account
          </button>
        </div>
      )}

      {method === "cash" && <CashPickupInstructions />}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white text-neutral-700 py-3 rounded-button font-semibold border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`flex-1 py-3 rounded-button font-semibold transition-colors ${
            canSubmit
              ? "bg-success text-white hover:bg-green-700"
              : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Request Withdrawal"}
        </button>
      </div>
    </div>
  );
}
