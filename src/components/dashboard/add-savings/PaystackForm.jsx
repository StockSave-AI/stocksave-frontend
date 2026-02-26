import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDeposit } from "../../hooks/useDeposit";
import { formatCurrency } from "../../../utils/currency";

export default function PaystackForm({
  selectedAmount,
  setSelectedAmount,
  quickAmounts = [],
  instructions = [],
}) {
  const [amount, setAmount] = useState(selectedAmount || "");
  const depositMutation = useDeposit();
  const navigate = useNavigate();

  const isValidPaystackUrl = (value) => {
    if (!value) return false;
    try {
      const parsed = new URL(value);
      const host = parsed.hostname.toLowerCase();
      const path = `${parsed.pathname}${parsed.hash}`.toLowerCase();
      return (
        host.includes("paystack") &&
        !path.includes("api-docs") &&
        !path.includes("swagger")
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please select or enter an amount");
      return;
    }

    depositMutation.mutate(
      {
        amount: Number(amount),
        method: "Paystack",
        reference: `paystack-${Date.now()}`,
      },
      {
        onSuccess: (response) => {
          const paymentUrl =
            response?.payment_url || response?.data?.payment_url;
          if (isValidPaystackUrl(paymentUrl)) {
            window.location.assign(paymentUrl);
            return;
          }
          toast.error(
            "Invalid payment link returned. Redirecting to dashboard.",
          );
          navigate("/dashboard", { replace: true });
        },
      },
    );
  };

  const handleCancel = () => {
    setAmount("");
    setSelectedAmount(null);
  };

  const handleSelectAmount = (amt) => {
    setAmount(amt);
    setSelectedAmount(amt);
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-100 p-4 rounded-lg space-y-2 text-sm text-neutral-600">
        {instructions.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <FiCheck className="text-primary-500 mt-1" size={16} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-card shadow-card p-6 border border-neutral-200 space-y-4">
        <h3 className="font-semibold text-neutral-700">Deposit Amount</h3>

        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleSelectAmount(amt)}
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
            onChange={(e) => handleSelectAmount(e.target.value)}
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
            disabled={depositMutation.isPending}
            className={`flex-1 rounded-button py-3 font-medium transition ${
              depositMutation.isPending
                ? "bg-primary-100 text-primary-400 cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            Pay with Paystack
          </button>
        </div>
      </div>
    </div>
  );
}
