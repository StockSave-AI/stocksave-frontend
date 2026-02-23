import { apiClient } from "../../api/apiClient";

export const login = async (data) => {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: {
      email: data.email,
      password: data.password,
    },
  });
};

export const signup = async (data) => {
  const normalizedRole =
    String(data.role || "customer").toLowerCase() === "owner"
      ? "Owner"
      : "Customer";

  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    password: data.password,
    account_type: normalizedRole,
  };

  return apiClient("/api/auth/signup", {
    method: "POST",
    body: payload,
  });
};

export const getProfile = async () => {
  const result = await apiClient("/api/auth/account-summary");
  return result?.data;
};

export const updateProfile = async (payload) => {
  return apiClient("/api/auth/account-summary", {
    method: "PATCH",
    body: payload,
  });
};

export const deleteAccount = async () => {
  // TODO: Backend contract currently defines only signup/login/account-summary auth endpoints.
  throw new Error("Delete account endpoint is not defined in the current API spec.");
};
