export const buildLocalUsers = (deposits = []) => {
  const grouped = new Map();

  deposits.forEach((item) => {
    const key = `${String(item?.first_name || "").toLowerCase()}|${String(item?.last_name || "").toLowerCase()}|${String(item?.phone || "").toLowerCase()}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: item?.user_id ?? item?.userId ?? key,
        first_name: item?.first_name || "",
        last_name: item?.last_name || "",
        phone: item?.phone || "",
        email: item?.email || "",
      });
    }
  });

  return Array.from(grouped.values());
};

export const normalizeApiUsers = (payload) => {
  const responseUsers = payload?.users || payload?.data || [];
  if (!Array.isArray(responseUsers)) return [];
  return responseUsers.map((item) => ({
    id: item?.id ?? item?.userId,
    first_name: item?.first_name || item?.firstName || "",
    last_name: item?.last_name || item?.lastName || "",
    phone: item?.phone || "",
    email: item?.email || "",
  }));
};

export const mergeAndFilterUsers = ({ apiUsers = [], localUsers = [], searchTerm = "" }) => {
  const merged = new Map();

  [...apiUsers, ...localUsers].forEach((item) => {
    const key = `${String(item?.first_name || "").toLowerCase()}|${String(item?.last_name || "").toLowerCase()}|${String(item?.phone || "").toLowerCase()}`;
    if (!merged.has(key)) merged.set(key, item);
  });

  const all = Array.from(merged.values());
  const term = searchTerm.trim().toLowerCase();
  if (!term) return all;

  return all.filter((item) => {
    const fullName = `${item?.first_name || ""} ${item?.last_name || ""}`.toLowerCase();
    const phone = String(item?.phone || "").toLowerCase();
    return fullName.includes(term) || phone.includes(term);
  });
};

export const calculateCustomerBalance = ({ deposits = [], selectedCustomer }) => {
  if (!selectedCustomer) return 0;

  return deposits
    .filter((item) => {
      const nameMatch =
        String(item?.first_name || "").toLowerCase() ===
          String(selectedCustomer?.first_name || "").toLowerCase() &&
        String(item?.last_name || "").toLowerCase() ===
          String(selectedCustomer?.last_name || "").toLowerCase();
      const phoneMatch =
        String(item?.phone || "").toLowerCase() ===
        String(selectedCustomer?.phone || "").toLowerCase();
      return nameMatch || phoneMatch;
    })
    .filter((item) => String(item?.status || "Pending").toLowerCase() === "completed")
    .reduce((sum, item) => sum + Number(item?.amount || 0), 0);
};

const toArray = (payload) =>
  Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.transactions)
      ? payload.transactions
      : Array.isArray(payload)
        ? payload
        : [];

export const extractRecentCashRows = (payload) => toArray(payload);

export const extractOwnerCashDepositTransactions = (payload) =>
  toArray(payload)
    .filter((item) => String(item?.method || "").toLowerCase() === "cash")
    .filter((item) => String(item?.type || "").toLowerCase() === "deposit")
    .map((item) => ({
      id: item?.id ?? item?.transaction_id,
      amount: item?.amount,
      status: item?.status,
      reference: item?.reference,
      created_at: item?.created_at,
      user_id: item?.user_id ?? item?.customer_id ?? item?.userId,
      first_name: item?.first_name ?? item?.customer_first_name ?? "",
      last_name: item?.last_name ?? item?.customer_last_name ?? "",
      phone: item?.phone ?? item?.customer_phone ?? "",
    }));

export const mergeCashDepositsById = (rows = []) => {
  const byId = new Map();
  rows.forEach((item) => {
    const key = String(item?.id ?? "");
    if (!key) return;
    byId.set(key, { ...(byId.get(key) || {}), ...item });
  });
  return Array.from(byId.values());
};

export const sortDepositsByDateDesc = (rows = []) =>
  [...rows].sort((a, b) => {
    const aTime = new Date(a?.created_at || a?.date || 0).getTime();
    const bTime = new Date(b?.created_at || b?.date || 0).getTime();
    return bTime - aTime;
  });

export const applyStatusOverrides = (rows = [], statusOverrides = {}) =>
  rows.map((item) => ({
    ...item,
    status: statusOverrides[String(item?.id)] || item?.status || "Pending",
  }));

export const patchOwnerRecentCashStatus = (previous, targetId, nextStatus) => {
  const source = previous?.data ?? previous;
  if (!Array.isArray(source)) return previous;
  const updated = source.map((entry) =>
    Number(entry?.id) === Number(targetId)
      ? { ...entry, status: nextStatus }
      : entry,
  );
  return previous?.data ? { ...previous, data: updated } : updated;
};

export const patchOwnerTransactionsStatus = (previous, targetId, nextStatus) => {
  const source = previous?.data ?? previous?.transactions ?? previous;
  if (!Array.isArray(source)) return previous;
  const updated = source.map((entry) =>
    Number(entry?.id ?? entry?.transaction_id) === Number(targetId)
      ? { ...entry, status: nextStatus }
      : entry,
  );
  if (Array.isArray(previous?.data)) return { ...previous, data: updated };
  if (Array.isArray(previous?.transactions))
    return { ...previous, transactions: updated };
  return updated;
};
