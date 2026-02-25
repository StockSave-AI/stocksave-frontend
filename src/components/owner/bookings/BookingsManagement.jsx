import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { formatDisplayDate } from "../../../utils/date";
import BookingFilters from "./BookingFilters";
import BookingHeader from "./BookingHeader";
import BookingStats from "./BookingStats";
import BookingTable from "./BookingTable";
import { useOwnerAllBookings, useUpdateBookingStatus } from "../hooks/useOwnerData";
import {
  pushCustomerBookingNotification,
  resolveCustomerNotificationEntity,
} from "../../services/notificationsService";

const normalizeBookingStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "canceled") return "cancelled";
  return normalized;
};

const formatNaira = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return "₦0";
  return `₦${value.toLocaleString("en-NG")}`;
};

const BookingsManagement = () => {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const bookingsQuery = useOwnerAllBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  const bookings = useMemo(() => {
    const raw = bookingsQuery.data?.data || bookingsQuery.data || [];
    return raw.map((item, index) => ({
      id: item.id || index,
      customerUserId:
        item.user_id || item.userId || item.customer_id || item.customerId || null,
      customer:
        item.customer_name ||
        item.user_name ||
        [item.first_name, item.last_name].filter(Boolean).join(" ").trim() ||
        item.email ||
        (item.userId ? `User #${item.userId}` : "Unknown User"),
      phone: item.phone || "-",
      items: `${item.product_name || item.items || item.inventory_name || "Booked Item"}${
        item.size_label ? ` • ${item.size_label}` : ""
      }`,
      detail:
        item.detail ||
        item.variant_name ||
        `Slots: ${item.slots_booked || item.quantity || 0}`,
      total: Number(item.total_cost || item.total || item.amount || 0),
      unitPrice: Number(item.price || 0),
      pickup: formatDisplayDate(item.created_at || item.booking_date, "-"),
      status: item.status || "Pending",
    }));
  }, [bookingsQuery.data]);

  const filteredBookings = useMemo(() => {
    const byStatus =
      status === "All"
        ? bookings
        : bookings.filter(
            (item) => normalizeBookingStatus(item?.status) === normalizeBookingStatus(status),
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
        detail.includes(searchText) ||
        String(item?.items || "").toLowerCase().includes(searchText)
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

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, currentPage]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ bookingId: id, status: nextStatus });

      const booking = bookings.find((item) => Number(item.id) === Number(id));
      const itemLabel = booking?.items || "Your order";
      const normalizedNextStatus = normalizeBookingStatus(nextStatus);
      const bookingRef = String(id);
      const customerUserId = booking?.customerUserId;

      resolveCustomerNotificationEntity({
        targetUserId: customerUserId,
        type: "booking_pending",
        entityId: bookingRef,
        nextStatus: normalizedNextStatus,
      });

      if (normalizedNextStatus === "completed") {
        await pushCustomerBookingNotification({
          notificationId: `booking-completed-${bookingRef}`,
          type: "booking",
          entityId: bookingRef,
          title: "Order Ready for Pickup",
          message: `${itemLabel} is ready to be picked up.`,
          targetUserId: customerUserId,
        });
      }

      if (normalizedNextStatus === "cancelled") {
        const cancelledAt = new Date().toLocaleString("en-NG");
        const refundAmount = formatNaira(booking?.total);
        await pushCustomerBookingNotification({
          notificationId: `booking-cancelled-${bookingRef}`,
          type: "booking",
          entityId: bookingRef,
          title: "Booking Cancelled",
          message: `Your booking for ${itemLabel} has been cancelled. ${refundAmount} has been refunded to your balance. Ref #${bookingRef} • ${cancelledAt}`,
          targetUserId: customerUserId,
        });
      }

      toast.success(`Marked as ${nextStatus}`);
    } catch (error) {
      toast.error(error?.message || "Failed to update booking status");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <BookingHeader />
        <BookingStats bookings={bookings} />
        <BookingFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
        <BookingTable
          bookings={paginatedBookings}
          isLoading={bookingsQuery.isLoading}
          isError={bookingsQuery.isError}
          emptyMessage={emptyMessage}
          onStatusChange={handleStatusChange}
          updatingId={updateStatusMutation.variables?.bookingId}
        />
        {!bookingsQuery.isLoading && !bookingsQuery.isError && filteredBookings.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between gap-3 rounded-card border border-neutral-200 bg-white px-4 py-3">
            <p className="text-xs text-neutral-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-200 text-neutral-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingsManagement;
