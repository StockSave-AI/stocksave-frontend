import { FiBox, FiPlus, FiUsers } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import OwnerActionCard from "./OwnerActionCard";

export default function OwnerDashboardActions({ onNavigate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <OwnerActionCard
        onClick={() => onNavigate("/owner/cash-deposit")}
        className="bg-emerald-600 text-white shadow-lg hover:shadow-2xl"
        title="Record Cash Deposit"
        description="Add customer cash deposits manually"
        leftIcon={<FaNairaSign className="text-3xl opacity-90" />}
        rightIcon={<FiPlus className="text-xl opacity-80" />}
      />

      <OwnerActionCard
        onClick={() => onNavigate("/owner/booking")}
        className="bg-white border border-gray-200 shadow-md hover:shadow-xl text-gray-800"
        title="Bookings"
        description="View and manage customers bookings"
        leftIcon={<FiBox className="text-3xl text-indigo-600" />}
        rightIcon={<FiPlus className="text-lg text-gray-400" />}
      />

      <OwnerActionCard
        onClick={() => onNavigate("/owner/users")}
        className="bg-white border border-gray-200 shadow-md hover:shadow-xl text-gray-800"
        title="View Users"
        description="Manage customer accounts"
        leftIcon={<FiUsers className="text-3xl text-orange-500" />}
        rightIcon={<span className="text-gray-400 text-xl">•</span>}
      />
    </div>
  );
}
