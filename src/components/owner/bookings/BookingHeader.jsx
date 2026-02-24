import { FaSave } from "react-icons/fa";

const BookingHeader = () => {
  return (
    <header className="bg-secondary-700 text-white p-6 rounded-card flex justify-between items-center shadow-card">
      <div>
        <h1 className="text-h2 md:text-h1">Bookings Management</h1>
        <p className="text-secondary-100 text-sm md:text-base">
          View and manage all customer food bookings
        </p>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        <FaSave size={24} />
      </div>
    </header>
  );
};

export default BookingHeader;
