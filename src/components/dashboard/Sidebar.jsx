import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiCreditCard,
  FiBox,
  FiBook,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 p-6">
      <h2 className="text-h3 font-semibold mb-8">Stock Save AI</h2>

      <nav className="flex flex-col gap-4 flex-1">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 text-neutral-700 hover:text-primary-500"
        >
          <FiHome /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/plan" className="flex items-center gap-3">
          <FiCreditCard /> Payment Plan
        </NavLink>

        <NavLink to="/dashboard/stock" className="flex items-center gap-3">
          <FiBox /> Stock Board
        </NavLink>

        <NavLink to="/dashboard/book" className="flex items-center gap-3">
          <FiBook /> Book Food
        </NavLink>

        <NavLink
          to="/dashboard/notifications"
          className="flex items-center gap-3"
        >
          <FiBell /> Notifications
        </NavLink>

        <NavLink to="/dashboard/settings" className="flex items-center gap-3">
          <FiSettings /> Settings
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 text-error mt-6"
      >
        <FiLogOut /> Logout
      </button>
    </aside>
  );
}

export default Sidebar;
