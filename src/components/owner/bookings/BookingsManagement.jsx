import { useMemo, useState } from "react";
import BookingStats from "./BookingStats";
import BookingFilters from "./BookingFilters";
import BookingTable from "./BookingTable";
import BookingHeader from "./BookingHeader";
import { useOwnerAllBookings } from "../hooks/useOwnerData";
import { formatDisplayDate } from "../../../utils/date";

const BookingsManagement = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const bookingsQuery = useOwnerAllBookings();

  const bookings = useMemo(() => {
    const raw = bookingsQuery.data?.data || bookingsQuery.data || [];
    return raw.map((item, index) => ({
      id: item.id || index,
      customer:
        item.customer_name ||
        item.user_name ||
        [item.first_name, item.last_name].filter(Boolean).join(" ").trim() ||
        item.email ||
        (item.userId ? `User #${item.userId}` : "Unknown User"),
      phone: item.phone || "-",
      items:
        item.items ||
        item.product_name ||
        item.inventory_name ||
        "Booked Item",
      detail:
        item.detail ||
        item.variant_name ||
        `Slots: ${item.slots_booked || item.quantity || 0}`,
      total: Number(item.amount || item.total || 0),
      pickup: formatDisplayDate(item.created_at || item.booking_date, "-"),
      status: item.status || "Pending",
    }));
  }, [bookingsQuery.data]);

  const filteredBookings = useMemo(() => {
    const byStatus =
      status === "All"
        ? bookings
        : bookings.filter(
            (item) =>
              String(item?.status || "").toLowerCase() === status.toLowerCase(),
          );

    const searchText = search.trim().toLowerCase();
    if (!searchText) return byStatus;

    return byStatus.filter((item) => {
      const customer = String(item?.customer || item?.name || "").toLowerCase();
      const phone = String(item?.phone || "").toLowerCase();
      const detail = String(item?.detail || item?.items || "").toLowerCase();
      return (
        customer.includes(searchText) ||
        phone.includes(searchText) ||
        detail.includes(searchText)
      );
    });
  }, [bookings, status, search]);

  const emptyMessage = useMemo(() => {
    const filterLabel = status === "All" ? "bookings" : `${status.toLowerCase()} bookings`;
    if (search.trim()) {
      return `No ${filterLabel} match "${search.trim()}".`;
    }
    return `No ${filterLabel} found.`;
  }, [status, search]);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <BookingHeader />
        <BookingStats bookings={bookings} />
        <BookingFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
        <BookingTable
          bookings={filteredBookings}
          isLoading={bookingsQuery.isLoading}
          isError={bookingsQuery.isError}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
};

export default BookingsManagement;
