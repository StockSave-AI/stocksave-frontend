import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  useOwnerUsers,
  useOwnerUserDetail,
} from "../hooks/useOwnerData";
import UsersMobileList from "./UsersMobileList";
import UsersDesktopTable from "./UsersDesktopTable";
import UserDetailsModal from "./UserDetailsModal";
import { STATUS_FILTERS, fullName } from "./userHelpers";

export default function ViewUsers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedDetailsUser, setSelectedDetailsUser] = useState(null);

  const usersQuery = useOwnerUsers({
    page,
    limit: 20,
    q: search.trim(),
    status: status === "All" ? "" : status,
    includeTransactions: true,
  });
  const userDetailQuery = useOwnerUserDetail(selectedDetailsUser?.id, Boolean(selectedDetailsUser));

  const users = useMemo(() => {
    const payload = usersQuery.data || {};
    const list = payload.users || payload.data || [];
    return Array.isArray(list) ? list : [];
  }, [usersQuery.data]);

  const pagination = usersQuery.data?.pagination || {};
  const totalPages = pagination.total_pages || 1;

  const normalizedUsers = useMemo(() => {
    return users.map((user) => {
      const transactions = Array.isArray(user.transactions) ? user.transactions : [];
      return {
        ...user,
        balance: Number(user.balance || 0),
        created_at: user.created_at || user.createdAt,
        transactions,
      };
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return normalizedUsers.filter((user) => {
      const name = fullName(user).toLowerCase();
      const phone = String(user?.phone || "").toLowerCase();
      const email = String(user?.email || "").toLowerCase();
      const statusMatch =
        status === "All" ||
        String(user?.status || "").toLowerCase() === status.toLowerCase();
      const searchMatch = !term || name.includes(term) || phone.includes(term) || email.includes(term);
      return statusMatch && searchMatch;
    });
  }, [normalizedUsers, search, status]);

  const toggleMenu = (userId) => {
    setOpenMenuId((previous) => (previous === userId ? null : userId));
  };

  const openDetails = (user) => {
    setSelectedDetailsUser(user);
    setOpenMenuId(null);
  };

  const handleRecordDeposit = (user) => {
    setOpenMenuId(null);
    navigate("/owner/cash-deposit", {
      state: {
        prefillUser: {
          id: user?.id,
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          phone: user?.phone || "",
          email: user?.email || "",
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-card border border-neutral-100 shadow-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">View Users</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Manage customer accounts and approve deposits.
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-700 border border-primary-100 flex items-center justify-center shrink-0">
            <FiUsers size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card border border-neutral-100 shadow-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or phone"
              className="w-full pl-10 pr-3 py-2 rounded-button border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full md:w-44 px-3 py-2 rounded-button border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {usersQuery.isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-neutral-200 border-t-primary-500 animate-spin" />
          </div>
        ) : null}

        {!usersQuery.isLoading && usersQuery.isError ? (
          <div className="h-48 flex items-center justify-center text-sm text-error">
            Failed to load users.
          </div>
        ) : null}

        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-neutral-500">
            No users found.
          </div>
        ) : null}

        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length > 0 ? (
          <div className="mt-4">
            <UsersMobileList
              users={filteredUsers}
              openMenuId={openMenuId}
              onToggleMenu={toggleMenu}
              onViewDetails={openDetails}
              onRecordDeposit={handleRecordDeposit}
              loading={false}
            />

            <UsersDesktopTable
              users={filteredUsers}
              openMenuId={openMenuId}
              onToggleMenu={toggleMenu}
              onViewDetails={openDetails}
              onRecordDeposit={handleRecordDeposit}
              loading={false}
            />

            <div className="flex justify-between items-center mt-4 text-sm text-neutral-600">
              <span>
                Page {pagination.page || 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border border-neutral-200 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded border border-neutral-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <UserDetailsModal
        user={userDetailQuery.data?.data || selectedDetailsUser}
        loading={userDetailQuery.isLoading}
        onClose={() => setSelectedDetailsUser(null)}
      />
    </div>
  );
}
