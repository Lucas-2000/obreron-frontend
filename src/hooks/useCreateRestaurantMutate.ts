import { IRestaurantFormRequest } from "@/components/restaurant-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({
  name,
  address,
  phone,
  category,
  description,
  openingHour,
  closingHour,
}: IRestaurantFormRequest) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    import.meta.env.VITE_API_URL + "/restaurants",
    {
      name,
      address,
      phone,
      category,
      description,
      openingHour,
      closingHour,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export function useCreateRestaurantMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
