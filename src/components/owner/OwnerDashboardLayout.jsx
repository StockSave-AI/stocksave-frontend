import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import {
  FiBell,
  FiCreditCard,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiRepeat,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import Topbar from "../dashboard/Topbar";
import { clearAuthToken } from "../../utils/authStorage";
import Logout from "../ui/Logout";
import Loader from "../ui/Loader";

const links = [
  { to: "/owner/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/owner/cash-deposit", label: "Record Cash", icon: <FiCreditCard /> },
  { to: "/owner/booking", label: "Bookings", icon: <FiShoppingBag /> },
  { to: "/owner/inventory", label: "Inventory", icon: <FiLayers /> },
  { to: "/owner/withdrawals", label: "Withdrawals", icon: <FiRepeat /> },
  { to: "/owner/users", label: "View Users", icon: <FiUsers /> },
  { to: "/owner/notification", label: "Notifications", icon: <FiBell /> },
  { to: "/owner/setting", label: "Settings", icon: <FiSettings /> },
];

export default function OwnerDashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen bg-neutral-100 overflow-hidden">
      <Topbar toggleSidebar={() => setIsOpen((prev) => !prev)} />

      <div className="flex pt-20 h-full">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <aside
          className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300 w-[60%] sm:w-52 md:w-56 lg:w-64 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col overflow-y-auto`}
        >
          <div className="flex-1 min-h-0">
            <nav className="flex flex-col gap-2 px-4 md:px-3 mt-6 md:mt-3 pb-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 md:px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-100 text-primary-600"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4 md:p-3 border-t border-neutral-200 bg-white">
            <button
              onClick={() => setLogoutOpen(true)}
              className="flex w-full items-center gap-3 px-4 md:px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition"
            >
              <FiLogOut />
              Log Out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full ml-0 md:ml-56 lg:ml-64 transition-all duration-300">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <Logout
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
