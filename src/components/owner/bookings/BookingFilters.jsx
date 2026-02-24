import { FiSearch } from "react-icons/fi";

const tabs = ["All", "Pending", " Ready", "Completed", "Cancelled"];

const BookingFilters = ({ search, onSearchChange, status, onStatusChange }) => {
  return (
    <div className="bg-white p-4 rounded-card border border-neutral-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
      <div className="relative w-full lg:w-1/4">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search booking..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-button border border-neutral-200 focus:ring-2 focus:ring-primary-300 outline-none"
        />
      </div>

      <div className="w-full lg:w-3/4 grid grid-cols-5 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onStatusChange(tab)}
            className={`py-2 text-sm font-medium rounded-button transition-colors ${
              status === tab
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-primary-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilters;
