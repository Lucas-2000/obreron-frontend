import {
  IResetPasswordFormTokenRequest,
  IResetPasswordFormTokenResponse,
} from "@/pages/auth/reset-password-form";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";

const fetchData = async ({
  token,
}: IResetPasswordFormTokenRequest): AxiosPromise<IResetPasswordFormTokenResponse> => {
  const response = await axios.get(
    import.meta.env.VITE_API_URL + "/reset-password?token=" + token
  );

  return response;
};

export function useResetPasswordTokenData({
  token,
}: IResetPasswordFormTokenRequest) {
  const query = useQuery({
    queryFn: () => fetchData({ token }),
    queryKey: ["reset-password-token"],
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
