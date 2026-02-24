import BookingRow from "./BookingRow";

const BookingTable = ({ bookings = [], isLoading, isError, emptyMessage }) => {
  return (
    <div className="bg-white rounded-card shadow-card border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">
                Customer
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">
                Items
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600 text-center">
                Total
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600 text-center">
                Pickup
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600 text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className="px-6 py-6 text-sm text-neutral-500" colSpan={5}>
                  Loading bookings...
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td className="px-6 py-6 text-sm text-error" colSpan={5}>
                  Failed to load bookings.
                </td>
              </tr>
            )}
            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-base font-medium text-neutral-600" colSpan={5}>
                  {emptyMessage || "No bookings available."}
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              bookings.map((booking, index) => (
                <BookingRow key={booking.id || index} booking={booking} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
