import DashboardLayout from "../../components/dashboard/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatsCard from "../../components/dashboard/StatsCard";

import { FiDollarSign, FiCalendar, FiBox } from "react-icons/fi";
import useDashboardData from "../hooks/useDashboardData";

function CustomerDashboard() {
  const { data, loading } = useDashboardData();

  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Use optional chaining + default */}
        <WelcomeCard name={data?.user?.name || "User"} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Savings"
            value={`₦${data?.totalSavings || 0}`}
            subtitle="+₦5,000 this month"
            icon={<FiDollarSign />}
          />

          <StatsCard
            title="Next Payment"
            value={data?.nextPayment || "N/A"}
            icon={<FiCalendar />}
          />

          <StatsCard
            title="Stock Items"
            value={data?.stockCount || 0}
            icon={<FiBox />}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;
