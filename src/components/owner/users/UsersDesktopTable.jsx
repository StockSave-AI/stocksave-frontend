import { formatDisplayDate } from "../../../utils/date";
import UserActionsMenu from "./UserActionsMenu";
import { fullName } from "./userHelpers";

export default function UsersDesktopTable({
  users,
  openMenuId,
  onToggleMenu,
  onViewDetails,
  onRecordDeposit,
  loading,
}) {
  return (
    <table className="hidden md:table w-full table-fixed text-sm">
      <thead>
        <tr className="text-left text-neutral-500 border-b border-neutral-100">
          <th className="py-3 pr-2 w-[52%]">Username</th>
          <th className="py-3 pr-2 w-[28%]">Created Date</th>
          <th className="py-3 w-[20%] text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return (
            <tr key={user.id} className="border-b border-neutral-100 align-top">
              <td className="py-3 pr-2 font-medium text-neutral-800 break-words">
                {fullName(user)}
              </td>
              <td className="py-3 pr-2 text-neutral-700">
                {formatDisplayDate(user.created_at, "-")}
              </td>
              <td className="py-3 text-right">
                <UserActionsMenu
                  user={user}
                  isOpen={openMenuId === user.id}
                  onToggle={() => onToggleMenu(user.id)}
                  onViewDetails={onViewDetails}
                  onRecordDeposit={onRecordDeposit}
                  loading={loading}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
