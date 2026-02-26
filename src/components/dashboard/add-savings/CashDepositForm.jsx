import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useDeposit } from "../../hooks/useDeposit";
import { formatCurrency } from "../../../utils/currency";

export default function CashDepositForm({ quickAmounts = [], steps = [] }) {
  const depositMutation = useDeposit();

  const [formState, setFormState] = useState({
    amount: "",
    confirmationCode: "",
    showModal: false,
    isSubmitting: false,
  });

  const { amount, confirmationCode, showModal, isSubmitting } = formState;

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
      setFormState({
        amount: "",
        confirmationCode: "",
        showModal: false,
        isSubmitting: false,
      });
  };

  const handleSubmit = () => {
    if (!amount) return toast.error("Please enter a deposit amount");

    setFormState((prev) => ({ ...prev, showModal: true, isSubmitting: true }));

    depositMutation.mutate(
      {
        amount: Number(amount),
        method: "Cash",
        reference: confirmationCode || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Cash deposit submitted. Await owner approval code.");
          setFormState((prev) => ({
            ...prev,
            amount: "",
            confirmationCode: "",
            showModal: false,
            isSubmitting: false,
          }));
        },
        onError: (error) => {
          setFormState((prev) => ({
            ...prev,
            showModal: false,
            isSubmitting: false,
          }));
          toast.error(error?.message || "Failed to submit deposit. Try again.");
        },
      },
    );
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-white rounded-card shadow-card p-6 border border-neutral-200 space-y-4">
        <h3 className="font-semibold text-neutral-700">Deposit Amount</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleChange("amount", amt)}
              className={`border border-neutral-300 rounded-button py-2 text-sm hover:border-primary-500 ${
                amount == amt ? "border-primary-500 bg-primary-50" : ""
              }`}
            >
              {formatCurrency(amt)}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          <label className="text-sm text-neutral-600">Input Amount</label>
          <input
            type="number"
            placeholder="₦ 0.00"
            value={amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="w-full border border-neutral-300 rounded-button px-4 py-3 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-6 border border-neutral-200 space-y-6">
        <h3 className="font-semibold text-neutral-700">
          Cash Deposit Instructions
        </h3>
        {steps.map((text, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full border border-primary-300 flex items-center justify-center text-primary-500 text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-neutral-600 text-sm">{text}</p>
          </div>
        ))}

        <div className="space-y-1 pt-2">
          <label className="text-sm text-neutral-600">
            Deposit Confirmation Code
          </label>
          <input
            type="text"
            placeholder="Optional receipt reference"
            value={confirmationCode}
            onChange={(e) => handleChange("confirmationCode", e.target.value)}
            className="w-full border border-neutral-300 rounded-button px-4 py-3 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 border border-neutral-300 rounded-button py-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 rounded-button py-3 font-medium transition ${
              isSubmitting
                ? "bg-primary-100 text-primary-400 cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            Submit Deposit
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <div className="bg-green-100 rounded-full p-4">
              <FiCheck size={36} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800 text-center">
              Your deposit will be verified shortly
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
