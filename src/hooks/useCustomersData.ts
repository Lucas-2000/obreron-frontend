import { ICustomersResponse } from "@/pages/app/customers";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchCustomersData = async (): AxiosPromise<ICustomersResponse[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/customers",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export function useCustomersData(name: string | null) {
  const query = useQuery({
    queryFn: () => fetchCustomersData(),
    queryKey: ["customers-data", name],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
