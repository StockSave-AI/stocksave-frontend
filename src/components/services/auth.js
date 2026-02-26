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
  return apiClient("/api/settings/profile");
};

export const updateProfile = async (payload) => {
  return apiClient("/api/settings/profile", {
    method: "PATCH",
    body: payload,
  });
};

export const deleteAccount = async () => {
  return apiClient("/api/auth/delete-account", {
    method: "DELETE",
  });
};

export const updateOwnerSettings = async (payload) => {
  if (typeof FormData !== "undefined" && payload instanceof FormData) {
    return apiClient("/api/settings/profile", {
      method: "PATCH",
      body: payload,
    });
  }

  const body = Object.entries(payload || {}).reduce((acc, [key, value]) => {
    acc[key] = value === undefined ? null : value;
    return acc;
  }, {});

  return apiClient("/api/settings/profile", {
    method: "PATCH",
    body,
  });
};

export const changePassword = async (payload) => {
  return apiClient("/api/settings/change-password", {
    method: "PATCH",
    body: {
      current_password: payload?.current_password ?? "",
      new_password: payload?.new_password ?? "",
      confirm_password: payload?.confirm_password ?? "",
    },
  });
};
