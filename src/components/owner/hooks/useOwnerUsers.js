import { useQuery } from "@tanstack/react-query";
import { fetchOwnerRecentCash, fetchOwnerUsers } from "../services/ownerApi";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const normalizeUsers = (payload) => {
  const raw = payload?.data || payload?.users || payload || [];
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => ({
    id: item?.id ?? item?.userId ?? index,
    first_name: item?.first_name || item?.firstName || "",
    last_name: item?.last_name || item?.lastName || "",
    email: item?.email || "",
    phone: item?.phone || "",
  }));
};

const normalizeRecentCash = (payload) => {
  const raw = payload?.data || payload || [];
  return Array.isArray(raw) ? raw : [];
};

const normalizeStatus = (status) => {
  const normalized = normalizeText(status);
  if (normalized === "completed") return "Completed";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

const toDeposit = (entry) => ({
  id: entry?.id,
  amount: Number(entry?.amount || 0),
  created_at: entry?.created_at,
  first_name: entry?.first_name || "",
  last_name: entry?.last_name || "",
  phone: entry?.phone || "",
  method: entry?.method || "Cash",
  type: "Deposit",
  reference: entry?.reference || entry?.payment_reference || null,
  status: normalizeStatus(entry?.status),
});

const matchesUser = (user, entry) => {
  const userId = user?.id;
  const entryUserId =
    entry?.user_id ?? entry?.userId ?? entry?.customer_id ?? entry?.customerId;

  if (entryUserId !== undefined && entryUserId !== null) {
    return Number(userId) === Number(entryUserId);
  }

  const userPhone = normalizeText(user?.phone);
  const entryPhone = normalizeText(entry?.phone);
  if (userPhone && entryPhone && userPhone === entryPhone) return true;

  const userEmail = normalizeText(user?.email);
  const entryEmail = normalizeText(entry?.email);
  if (userEmail && entryEmail && userEmail === entryEmail) return true;

  const userName =
    `${normalizeText(user?.first_name)} ${normalizeText(user?.last_name)}`.trim();
  const entryName =
    `${normalizeText(entry?.first_name)} ${normalizeText(entry?.last_name)}`.trim();

  return Boolean(userName && entryName && userName === entryName);
};

const sortByDateDesc = (a, b) =>
  new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime();

const enrichUser = (user, recentCashEntries) => {
  const transactions = recentCashEntries
    .filter((entry) => matchesUser(user, entry))
    .map(toDeposit)
    .sort(sortByDateDesc);

  const latest = transactions[0] || null;
  const pendingDeposits = transactions.filter((tx) => tx.status === "Pending").length;
  const completedDeposits = transactions.filter(
    (tx) => tx.status === "Completed",
  ).length;
  const rejectedDeposits = transactions.filter((tx) => tx.status === "Rejected").length;
  const latestPending = transactions.find((tx) => tx.status === "Pending") || null;

  const status = latestPending
    ? "Pending"
    : completedDeposits > 0
      ? "Completed"
      : rejectedDeposits > 0
        ? "Rejected"
        : "Pending";

  const totalDeposits = transactions
    .filter((tx) => tx.status === "Completed")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  return {
    ...user,
    transactions,
    latestAmount: Number(latest?.amount || 0),
    latestDate: latest?.created_at || null,
    status,
    pendingDeposits,
    completedDeposits,
    rejectedDeposits,
    latestPending,
    currentBalance: totalDeposits,
    totalDeposits,
    totalWithdrawals: 0,
  };
};

export const useOwnerUsers = (query = "") =>
  useQuery({
    queryKey: ["owner-users", query],
    queryFn: async () => {
      const [usersResponse, recentCashResponse] = await Promise.all([
        fetchOwnerUsers(query),
        fetchOwnerRecentCash(),
      ]);

      const users = normalizeUsers(usersResponse);
      const recentCashEntries = normalizeRecentCash(recentCashResponse);

      if (users.length === 0) {
        const groupedByIdentity = new Map();

        recentCashEntries.forEach((entry) => {
          const first = entry?.first_name || "";
          const last = entry?.last_name || "";
          const phone = entry?.phone || "";
          const key = `${normalizeText(first)}|${normalizeText(last)}|${normalizeText(phone)}`;

          if (!groupedByIdentity.has(key)) {
            groupedByIdentity.set(key, {
              id: key,
              first_name: first,
              last_name: last,
              email: entry?.email || "",
              phone,
            });
          }
        });

        return Array.from(groupedByIdentity.values()).map((user) =>
          enrichUser(user, recentCashEntries),
        );
      }

      return users.map((user) => enrichUser(user, recentCashEntries));
    },
  });
