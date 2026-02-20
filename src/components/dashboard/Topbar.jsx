import { FiBell, FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button onClick={toggleSidebar} className="md:hidden text-neutral-700">
          <FiMenu size={22} />
        </button>

        <h1 className="text-lg font-semibold">Stock Save AI</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button className="text-neutral-600 hover:text-primary-500">
          <FiBell size={20} />
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-neutral-600 hover:text-error"
        >
          <FiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
