import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
