import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deleteData = async (id: string) => {
  const token = localStorage.getItem("token");

  return await axios.delete(`${import.meta.env.VITE_API_URL}/customers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      id: id,
    },
  });
};

export function useDeleteCustomerMutate() {
  const mutate = useMutation({
    mutationFn: deleteData,
  });

  return mutate;
}
