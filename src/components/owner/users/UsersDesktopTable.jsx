import { formatCurrency } from "../../../utils/currency";
import { formatDisplayDate } from "../../../utils/date";
import UserActionsMenu from "./UserActionsMenu";
import { fullName, getStatusStyle } from "./userHelpers";

export default function UsersDesktopTable({
  users,
  openMenuId,
  onToggleMenu,
  getPendingDeposit,
  getPendingPaystack,
  onViewDetails,
  onViewDeposits,
  onApprove,
  onReject,
  onVerify,
  onGenerateCode,
  updating,
  verifying,
  generatingCode,
}) {
  return (
    <table className="hidden md:table w-full table-fixed text-sm">
      <thead>
        <tr className="text-left text-neutral-500 border-b border-neutral-100">
          <th className="py-3 pr-2 w-[24%]">User Name</th>
          <th className="py-3 pr-2 w-[18%]">Phone</th>
          <th className="py-3 pr-2 w-[15%]">Amount</th>
          <th className="py-3 pr-2 w-[18%]">Date</th>
          <th className="py-3 pr-2 w-[13%]">Status</th>
          <th className="py-3 w-[12%] text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const pendingDeposit = getPendingDeposit(user);
          const pendingPaystack = getPendingPaystack(user);
          const isPending = String(user?.status || "").toLowerCase() === "pending";
          const statusStyle = getStatusStyle(user?.status);

          return (
            <tr key={user.id} className="border-b border-neutral-100 align-top">
              <td className="py-3 pr-2 font-medium text-neutral-800 break-words">
                {fullName(user)}
              </td>
              <td className="py-3 pr-2 text-neutral-700 break-words">{user.phone || "-"}</td>
              <td className="py-3 pr-2 text-neutral-800">
                {formatCurrency(user.latestAmount || 0)}
              </td>
              <td className="py-3 pr-2 text-neutral-700">
                {formatDisplayDate(user.latestDate, "-")}
              </td>
              <td className="py-3 pr-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                  {user.status || "Pending"}
                </span>
              </td>
              <td className="py-3 text-right">
                <UserActionsMenu
                  user={user}
                  isOpen={openMenuId === user.id}
                  onToggle={() => onToggleMenu(user.id)}
                  onViewDetails={onViewDetails}
                  onViewDeposits={onViewDeposits}
                  isPending={isPending}
                  pendingDeposit={pendingDeposit}
                  pendingPaystack={pendingPaystack}
                  onApprove={onApprove}
                  onReject={onReject}
                  onVerify={onVerify}
                  onGenerateCode={onGenerateCode}
                  updating={updating}
                  verifying={verifying}
                  generatingCode={generatingCode}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
