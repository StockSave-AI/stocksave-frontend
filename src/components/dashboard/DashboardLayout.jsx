import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useEffect, useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "../ui/Loader";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-neutral-100 overflow-hidden">
      <Topbar toggleSidebar={toggleSidebar} />

      <div className="flex pt-20 h-full">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main
          className={`
    flex-1 overflow-y-auto p-4 sm:p-6
    w-full
    ml-0 md:ml-56 lg:ml-64
    transition-all duration-300
  `}
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
