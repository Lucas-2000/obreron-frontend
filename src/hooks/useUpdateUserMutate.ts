import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateUserRequest {
  id?: string;
  password: string;
  rePassword: string;
}

const patchData = async ({ id, password, rePassword }: UpdateUserRequest) => {
  const token = localStorage.getItem("token");

  if (token) {
    const apiUrl = import.meta.env.VITE_API_URL + "/users";
    const data = {
      password,
      rePassword,
    };

    return await axios.patch(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return await axios.patch(import.meta.env.VITE_API_URL + `/users/${id}`, {
    password,
    rePassword,
  });
};

export function useUpdateUserMutate() {
  const mutate = useMutation({
    mutationFn: patchData,
  });

  return mutate;
}
