import { FaSearch, FaUser } from "react-icons/fa";
import { formatCurrency } from "../../../utils/currency";

const displayName = (customer) => {
  const name = `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim();
  return name || customer?.name || "Unknown User";
};

const CustomerSelect = ({
  currentBalance,
  searchTerm,
  onSearchChange,
  customers = [],
  selectedCustomer,
  onSelectCustomer,
  isSearching = false,
}) => {
  return (
    <section className="bg-white p-6 rounded-card shadow-card border border-neutral-200">
      <h3 className="text-neutral-800 font-semibold mb-4">Select Customer</h3>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or phone"
          className="w-full pl-10 pr-4 py-3 rounded-button border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all"
        />
      </div>

      <div className="mb-6 border border-neutral-200 rounded-card max-h-48 overflow-y-auto">
        {isSearching ? (
          <div className="h-24 flex items-center justify-center">
            <div className="h-7 w-7 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!isSearching && customers.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-sm text-neutral-500">
            No users found.
          </div>
        ) : null}

        {!isSearching &&
          customers.map((customer) => {
            const key = customer?.id ?? `${customer?.phone}-${displayName(customer)}`;
            const isSelected = selectedCustomer?.id === customer?.id;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectCustomer(customer)}
                className={`w-full text-left px-4 py-3 border-b border-neutral-100 last:border-b-0 transition ${
                  isSelected
                    ? "bg-secondary-50 border-l-4 border-l-secondary-500"
                    : "hover:bg-neutral-50"
                }`}
              >
                <p className="font-semibold text-neutral-900">{displayName(customer)}</p>
                <p className="text-xs text-neutral-500">{customer?.phone || "-"}</p>
              </button>
            );
          })}
      </div>

      <div className="border border-secondary-200 bg-secondary-50/30 rounded-card p-4">
        <div className="flex items-start mb-4 gap-3">
          <div className="bg-secondary-500 p-2 rounded-full text-white">
            <FaUser size={24} />
          </div>
          <div>
            <p className="font-bold text-neutral-900">{displayName(selectedCustomer)}</p>
            <p className="text-neutral-500 text-sm">{selectedCustomer?.phone || "-"}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-secondary-100">
          <p className="text-neutral-500 text-xs uppercase tracking-wider">
            Current Balance:
          </p>
          <p className="text-h3 text-neutral-900 font-bold">{formatCurrency(currentBalance)}</p>
        </div>
      </div>
    </section>
  );
};

export default CustomerSelect;
