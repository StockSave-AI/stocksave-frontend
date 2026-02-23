import { FiMenu, FiBell, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthRole } from "../../utils/authStorage";

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRole = getAuthRole();
  const isOwnerPath = location.pathname.startsWith("/owner");
  const role = isOwnerPath ? "owner" : storedRole || "customer";
  const notificationRoute =
    role === "owner" ? "/owner/notification" : "/dashboard/notification";
  const profileRoute = role === "owner" ? "/owner/setting" : "/dashboard/settings";

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
          className="text-neutral-600 hover:text-primary-500 transition-colors"
        >
          <FiBell size={20} />
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
