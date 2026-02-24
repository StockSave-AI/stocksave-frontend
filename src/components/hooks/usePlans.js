import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlan,
  deletePlan,
  getPlans,
  pausePlan,
  resumePlan,
  updatePlan,
  updatePlanSettings,
} from "../services/plans";

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });
};

const useInvalidatePlans = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["plans"] });
    queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
  };
};

export const useCreatePlan = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (payload) => createPlan(payload),
    onSuccess: invalidate,
  });
};

export const useUpdatePlan = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: ({ id, payload }) => updatePlan({ id, payload }),
    onSuccess: invalidate,
  });
};

export const useDeletePlan = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (id) => deletePlan(id),
    onSuccess: invalidate,
  });
};

export const usePausePlan = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (id) => pausePlan(id),
    onSuccess: invalidate,
  });
};

export const useResumePlan = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (id) => resumePlan(id),
    onSuccess: invalidate,
  });
};

export const useUpdatePlanSettings = () => {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: ({ id, payload }) => updatePlanSettings({ id, payload }),
    onSuccess: invalidate,
  });
};
