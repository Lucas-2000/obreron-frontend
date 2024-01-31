import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

interface UserReponse {
  username: string;
  email: string;
}

const fetchData = async (): AxiosPromise<UserReponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(import.meta.env.VITE_API_URL + "/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export function useUserData() {
  const query = useQuery({
    queryFn: () => fetchData(),
    queryKey: ["user-data"],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
