import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiShoppingCart,
  FiBox,
  FiSettings,
  FiX,
  FiLogOut,
  FiCreditCard,
} from "react-icons/fi";
import { AiFillMoneyCollect, AiFillNotification } from "react-icons/ai";
import { useState } from "react";
import Logout from "../ui/Logout";
import { clearAuthToken } from "../../utils/authStorage";

function Sidebar({ isOpen, setIsOpen }) {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogoutConfirm = () => {
    clearAuthToken();
    window.location.href = "/login";
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    {
      to: "/dashboard/add-savings",
      label: "Add Savings",
      icon: <FiDollarSign />,
    },
    {
      to: "/dashboard/payment-plan",
      label: "Payment Plan",
      icon: <FiCreditCard />,
    },
    { to: "/dashboard/stock-board", label: "Stock Board", icon: <FiBox /> },
    {
      to: "/dashboard/book-food",
      label: "Book Food",
      icon: <FiShoppingCart />,
    },
    { to: "/dashboard/redeem", label: "Redeem", icon: <AiFillMoneyCollect /> },

    { to: "/dashboard/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
    fixed top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300
    w-[60%] sm:w-52 md:w-56 lg:w-64
    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
    flex flex-col justify-between
  `}
      >
        {}
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={() => setIsOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {}
        <nav className="flex flex-col gap-2 px-4 mt-6 flex-1">
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

        {}
        <div className="px-4 py-4 border-t border-neutral-200">
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 w-full justify-start bg-error-100 text-error px-4 py-3 rounded-lg hover:bg-error-200 transition-colors"
          >
            <FiLogOut size={18} />
            <span className="lg:inline">Logout</span>
          </button>
        </div>
      </div>
      <Logout
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

export default Sidebar;
