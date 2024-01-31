import { IRestaurantFormRequest } from "@/components/restaurant-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const patchData = async ({
  id,
  name,
  address,
  phone,
  category,
  description,
  openingHour,
  closingHour,
}: IRestaurantFormRequest) => {
  const token = localStorage.getItem("token");

  return await axios.patch(
    import.meta.env.VITE_API_URL + "/restaurants",
    {
      id,
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

export function useUpdateRestaurantMutate() {
  const mutate = useMutation({
    mutationFn: patchData,
  });

  return mutate;
}
