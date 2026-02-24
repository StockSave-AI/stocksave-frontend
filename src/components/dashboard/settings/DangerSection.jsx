import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function DangerZoneSection() {
  return (
    <div className="border border-red-200 bg-red-50 p-6 rounded-2xl flex justify-between items-center">
      <div className="flex items-center gap-3 text-red-700">
        <FaExclamationTriangle />
        <div>
          <h3 className="font-semibold">Deactivate Account</h3>
          <p className="text-sm">
            Permanently disable your account and delete all data
          </p>
        </div>
      </div>
      <Link
        to="/dashboard/deactivate-account"
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Deactivate
      </Link>
    </div>
  );
}
