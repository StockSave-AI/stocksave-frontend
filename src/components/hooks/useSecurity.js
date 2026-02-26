import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/auth";

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePassword,
  });
