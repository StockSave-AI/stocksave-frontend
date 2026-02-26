import { apiClient } from "../../api/apiClient";

export const getSettingsProfile = async () => apiClient("/api/settings/profile");

export const patchSettingsProfile = async (payload) =>
  apiClient("/api/settings/profile", {
    method: "PATCH",
    body: payload,
  });

export const getSettingsNotifications = async () =>
  apiClient("/api/settings/notifications");

export const patchSettingsNotifications = async (payload) =>
  apiClient("/api/settings/notifications", {
    method: "PATCH",
    body: payload,
  });

export const getSettingsBusiness = async () => apiClient("/api/settings/business");

export const patchSettingsBusiness = async (payload) =>
  apiClient("/api/settings/profile", {
    method: "PATCH",
    body: payload,
  });

export const patchSettingsUserStatus = async (id, payload) =>
  apiClient(`/api/settings/user-status/${id}`, {
    method: "PATCH",
    body: payload,
  });
