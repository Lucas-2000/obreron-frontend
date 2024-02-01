import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deleteData = async () => {
  const token = localStorage.getItem("token");

  return await axios.delete(import.meta.env.VITE_API_URL + "/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export function useDeleteUserMutate() {
  const mutate = useMutation({
    mutationFn: deleteData,
  });

  return mutate;
}
