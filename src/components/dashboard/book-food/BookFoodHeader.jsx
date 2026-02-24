import { FiShoppingCart } from "react-icons/fi";

export default function BookFoodHeader({ cartCount, onOpenCart }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 shadow-sm">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
          Book Your Food Items
        </h1>
        <p className="text-sm text-neutral-500 mt-1">Use your savings to book food items</p>
      </div>

      <div
        className="relative cursor-pointer p-2 hover:bg-neutral-100 rounded-full transition"
        onClick={onOpenCart}
      >
        <FiShoppingCart size={26} />
        {cartCount > 0 ? (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
            {cartCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}
