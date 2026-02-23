import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import {
  FiBell,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import Topbar from "../dashboard/Topbar";
import { clearAuthToken } from "../../utils/authStorage";
import Logout from "../ui/Logout";
import Loader from "../ui/Loader";

const links = [
  { to: "/owner/dashboard", label: "Dashboard", icon: <FiHome /> },
  { to: "/owner/cash-deposit", label: "Record Cash", icon: <FiCreditCard /> },
  { to: "/owner/booking", label: "Bookings", icon: <FiShoppingBag /> },
  { to: "/owner/users", label: "View Users", icon: <FiUsers /> },
  { to: "/owner/notification", label: "Send Notification", icon: <FiBell /> },
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
          } md:translate-x-0 flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-end p-4 md:hidden">
              <button onClick={() => setIsOpen(false)}>
                <FiX size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 px-4 mt-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
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

          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-3 m-4 rounded-lg text-sm font-medium text-red-600 border-t border-neutral-400 hover:bg-red-100 transition"
          >
            <FiLogOut />
            Log Out
          </button>
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
