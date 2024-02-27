import { ICountOrdersResponse } from "@/pages/app/dashboard";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

interface IStatisticsQueryParams {
  routeName: string;
  restaurantId?: string;
}

const fetchStatisticsData = async ({
  routeName,
  restaurantId,
}: IStatisticsQueryParams): AxiosPromise<ICountOrdersResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    import.meta.env.VITE_API_URL + `/statistics/${routeName}/${restaurantId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export function useStatisticsData(routeName: string, restaurantId?: string) {
  const query = useQuery({
    queryFn: () => fetchStatisticsData({ routeName, restaurantId }),
    queryKey: ["statistics-data", routeName, restaurantId],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
