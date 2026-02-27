import { FiMenu, FiBell, FiUser, FiAlertTriangle, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { getAuthRole } from "../../utils/authStorage";
import { useOwnerUnreadNotifications } from "../owner/hooks/useOwnerNotifications";
import { useCustomerUnreadNotifications } from "../hooks/useNotifications";

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRole = String(getAuthRole() || "").toLowerCase();
  const isOwnerPath = location.pathname.startsWith("/owner");
  const role = isOwnerPath ? "owner" : storedRole || "customer";
  const ownerNotificationsQuery = useOwnerUnreadNotifications(role === "owner");
  const customerNotificationsQuery = useCustomerUnreadNotifications(role === "customer");
  const ownerNotificationCount =
    role === "owner" ? Number(ownerNotificationsQuery.unread || 0) : 0;
  const unreadCustomerNotifications =
    role === "customer" ? Number(customerNotificationsQuery.data || 0) : 0;
  const notificationRoute =
    role === "owner" ? "/owner/notification" : "/dashboard/notification";
  const profileRoute = role === "owner" ? "/owner/setting" : "/dashboard/settings";
  const totalUnread =
    role === "owner" ? ownerNotificationCount : unreadCustomerNotifications;
  const previousUnreadRef = useRef(0);

  useEffect(() => {
    const previousUnread = Number(previousUnreadRef.current || 0);
    const currentUnread = Number(totalUnread || 0);
    if (currentUnread <= 0) {
      previousUnreadRef.current = 0;
      return;
    }
    if (currentUnread <= previousUnread) return;

    previousUnreadRef.current = currentUnread;
    toast.custom(
      (t) => (
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="mt-0.5 text-amber-600 shrink-0" size={16} />
              <p className="text-sm text-amber-900">
                You have important notifications. Please check your notification center.
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-amber-200 bg-white/80 text-amber-700 hover:bg-white"
              aria-label="Close notification"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        id: `new-notification-warning-${role}`,
      },
    );
  }, [totalUnread, role]);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-neutral-700 hidden max-[780px]:block"
        >
          <FiMenu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Stock Save AI Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg md:text-base">
            Stock Save AI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <Link
          to={notificationRoute}
          className="relative text-neutral-600 hover:text-primary-500 transition-colors"
        >
          <FiBell size={20} />
          {(role === "owner" && ownerNotificationCount > 0) ||
          (role === "customer" && unreadCustomerNotifications > 0) ? (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
              {(() => {
                return totalUnread > 99 ? "99+" : totalUnread;
              })()}
            </span>
          ) : null}
        </Link>

        <button
          onClick={() => navigate(profileRoute)}
          className="w-7 h-7 lg:w-9 lg:h-9 bg-secondary-500 text-white rounded-full flex items-center justify-center hover:bg-secondary-600 transition-colors"
        >
          <FiUser size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
