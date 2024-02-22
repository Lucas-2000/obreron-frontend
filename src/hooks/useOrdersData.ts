import { IOrdersResponse } from "@/pages/app/orders";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchOrdersData = async (): AxiosPromise<IOrdersResponse[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/orders/user",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export function useOrdersData(
  name: string | null,
  active: string | null,
  status: string | null
) {
  const query = useQuery({
    queryFn: () => fetchOrdersData(),
    queryKey: ["orders-data", name, active, status],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
