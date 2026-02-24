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
