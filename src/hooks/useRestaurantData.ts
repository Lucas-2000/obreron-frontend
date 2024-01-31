import { IRestaurantResponse } from "@/components/restaurant-modal";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchData = async (): AxiosPromise<IRestaurantResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/restaurants",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export function useRestaurantData() {
  const query = useQuery({
    queryFn: () => fetchData(),
    queryKey: ["restaurant-data"],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
