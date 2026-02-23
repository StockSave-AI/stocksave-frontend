export const STATUS_FILTERS = ["All", "Pending", "Completed", "Rejected"];

export const fullName = (user) =>
  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Unnamed User";

export const asList = (data) => (Array.isArray(data) ? data : []);

export const isPendingDeposit = (tx) => {
  const status = String(tx?.status || "").toLowerCase();
  const type = String(tx?.type || tx?.transaction_type || "").toLowerCase();
  return status === "pending" && !type.includes("withdraw");
};

export const isPaystackPending = (tx) => {
  const method = String(tx?.method || "").toLowerCase();
  const reference = tx?.reference || tx?.payment_reference;
  return isPendingDeposit(tx) && method === "paystack" && Boolean(reference);
};

export const isPendingCashDeposit = (tx) => {
  const method = String(tx?.method || "").toLowerCase();
  return isPendingDeposit(tx) && method.includes("cash");
};

export const getStatusStyle = (status) => {
  if (status === "Completed") return "bg-success/10 text-success";
  if (status === "Rejected") return "bg-error/10 text-error";
  return "bg-warning/10 text-warning";
};
