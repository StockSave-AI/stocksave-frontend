import { formatDisplayDate } from "../../../utils/date";
import UserActionsMenu from "./UserActionsMenu";
import { fullName, getStatusStyle } from "./userHelpers";

export default function UsersMobileList({
  users,
  openMenuId,
  onToggleMenu,
  onViewDetails,
  onRecordDeposit,
  loading,
}) {
  return (
    <div className="space-y-3 md:hidden">
      {users.map((user) => {
        const statusStyle = getStatusStyle(user?.status);

        return (
          <div
            key={user.id}
            className="border border-neutral-100 rounded-card p-3 bg-neutral-50/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-neutral-800 break-words">{fullName(user)}</p>
                <p className="text-xs text-neutral-600 mt-1">
                  Created: {formatDisplayDate(user.created_at, "-")}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                {user.status || "Pending"}
              </span>
            </div>

            <div className="mt-3">
              <UserActionsMenu
                user={user}
                align="left"
                isOpen={openMenuId === user.id}
                onToggle={() => onToggleMenu(user.id)}
                onViewDetails={onViewDetails}
                onRecordDeposit={onRecordDeposit}
                loading={loading}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
