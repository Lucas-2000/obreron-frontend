import { IItemsResponse } from "@/pages/app/items";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchItemsData = async (): AxiosPromise<IItemsResponse[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(import.meta.env.VITE_API_URL + "/items", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export function useItemsData(name: string | null) {
  const query = useQuery({
    queryFn: () => fetchItemsData(),
    queryKey: ["items-data", name],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
