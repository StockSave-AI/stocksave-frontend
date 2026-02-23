import { FiCalendar, FiClock, FiPackage, FiCheckCircle } from "react-icons/fi";

const BookingStats = ({ bookings = [] }) => {
  const pending = bookings.filter(
    (item) => String(item?.status || "").toLowerCase() === "pending",
  ).length;
  const ready = bookings.filter(
    (item) => String(item?.status || "").toLowerCase() === "ready",
  ).length;
  const completed = bookings.filter(
    (item) => String(item?.status || "").toLowerCase() === "completed",
  ).length;

  const stats = [
    {
      label: "Total Bookings",
      value: String(bookings.length),
      icon: FiCalendar,
      color: "bg-secondary-500",
    },
    {
      label: "Pending",
      value: String(pending),
      icon: FiClock,
      color: "bg-warning",
    },
    {
      label: "Ready for Pickup",
      value: String(ready),
      icon: FiPackage,
      color: "bg-secondary-400",
    },
    {
      label: "Completed",
      value: String(completed),
      icon: FiCheckCircle,
      color: "bg-primary-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.color} rounded-card p-6 text-white relative h-28 flex flex-col justify-between shadow-lg`}
          >
            <div>
              <p className="text-lg opacity-90">{stat.label}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>

            <Icon size={60} className="absolute right-4 bottom-2 opacity-20" />
          </div>
        );
      })}
    </div>
  );
};

export default BookingStats;
