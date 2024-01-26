import { ILoginForm } from "./../pages/auth/login";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({ username, password }: ILoginForm) => {
  return await axios.post(import.meta.env.VITE_API_URL + "/users/auth", {
    username,
    password,
  });
};

export function useLoginMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
