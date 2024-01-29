import { IResetPasswordForm } from "@/pages/auth/reset-password";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({ email }: IResetPasswordForm) => {
  return await axios.post(import.meta.env.VITE_API_URL + "/reset-password", {
    email,
  });
};

export function useResetPasswordMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
