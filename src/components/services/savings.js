import { apiClient } from "../../api/apiClient";

export const submitSavingsDeposit = async (payload = {}) => {
  return apiClient("/api/savings/deposit", {
    method: "POST",
    body: payload,
  });
};

export const getSavingsHistory = async () => {
  return apiClient("/api/savings/history");
};

export const getRecentSavings = async () => {
  return apiClient("/api/savings/recent");
};

export const verifySavings = async (reference) => {
  return apiClient(`/api/savings/verify?reference=${encodeURIComponent(reference)}`);
};

export const submitWithdrawal = async (payload = {}) => {
  return apiClient("/api/savings/withdraw", {
    method: "POST",
    body: payload,
  });
};

export const getSavingsRedeem = async () => {
  return apiClient("/api/savings/redeem");
};

export const getSavingsBanks = async () => {
  return apiClient("/api/savings/banks");
};

export const updateSavingsStatus = async (payload = {}) => {
  const transactionId =
    payload?.transactionId ??
    payload?.depositId ??
    payload?.id ??
    payload?.transaction_id ??
    null;
  const status = payload?.status ?? payload?.nextStatus ?? null;

  if (
    transactionId === null ||
    status === null ||
    status === undefined ||
    status === ""
  ) {
    throw new Error("transactionId and status are required for update-status.");
  }

  const body = { transactionId, status };

  return apiClient("/api/savings/update-status", {
    method: "PATCH",
    body,
  });
};

export const generateCashApprovalCode = async (payload = {}) => {
  const transactionId =
    payload?.transactionId ??
    payload?.depositId ??
    payload?.id ??
    payload?.transaction_id ??
    null;

  if (transactionId === null || transactionId === undefined || transactionId === "") {
    throw new Error("transactionId is required for generate-code.");
  }

  return apiClient("/api/savings/generate-code", {
    method: "PATCH",
    body: { transactionId },
  });
};

export const approveCashDeposit = async (payload = {}) => {
  const transactionId =
    payload?.transactionId ??
    payload?.depositId ??
    payload?.id ??
    payload?.transaction_id ??
    null;
  const approvalCode = payload?.approval_code ?? payload?.approvalCode ?? null;

  if (
    transactionId === null ||
    transactionId === undefined ||
    transactionId === "" ||
    !approvalCode
  ) {
    throw new Error("transactionId and approval_code are required for approve-cash.");
  }

  return apiClient("/api/savings/approve-cash", {
    method: "POST",
    body: {
      transactionId,
      approval_code: String(approvalCode),
    },
  });
};
