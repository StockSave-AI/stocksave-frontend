import { formatCurrency } from "../../../utils/currency";

export default function QuickAmountButton({
  amount,
  selectedAmount,
  onClick,
}) {
  const selected = Number(selectedAmount) === Number(amount);

  return (
    <button
      type="button"
      onClick={() => onClick(amount)}
      className={`border rounded-button py-3 text-sm font-semibold transition ${
        selected
          ? "border-primary-500 bg-primary-50 text-primary-600"
          : "border-neutral-200 hover:border-primary-300"
      }`}
    >
      {formatCurrency(amount)}
    </button>
  );
}
