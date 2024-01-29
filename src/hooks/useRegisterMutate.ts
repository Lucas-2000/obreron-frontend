import { IRegisterForm } from "@/pages/auth/register";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({
  email,
  username,
  password,
  rePassword,
}: IRegisterForm) => {
  return await axios.post(import.meta.env.VITE_API_URL + "/users", {
    email,
    username,
    password,
    rePassword,
  });
};

export function useRegisterMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
