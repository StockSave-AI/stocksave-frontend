import { apiClient } from "../../api/apiClient";

export const getPlans = async () => {
  return apiClient("/api/plans");
};

export const createPlan = async (payload) => {
  return apiClient("/api/plans", {
    method: "POST",
    body: payload,
  });
};

export const updatePlan = async ({ id, payload }) => {
  return apiClient(`/api/plans/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deletePlan = async (id) => {
  return apiClient(`/api/plans/${id}`, {
    method: "DELETE",
  });
};

export const pausePlan = async (id) => {
  return apiClient(`/api/plans/${id}/pause`, {
    method: "POST",
  });
};

export const resumePlan = async (id) => {
  return apiClient(`/api/plans/${id}/resume`, {
    method: "POST",
  });
};

export const updatePlanSettings = async ({ id, payload }) => {
  return apiClient(`/api/plans/${id}/settings`, {
    method: "PATCH",
    body: payload,
  });
};
