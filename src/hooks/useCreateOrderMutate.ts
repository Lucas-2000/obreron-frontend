import { CreateOrderRequest } from "@/components/create-order-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({
  address,
  paymentType,
  deliveryStatus,
  restaurantId,
  customerId,
  orderItems,
}: CreateOrderRequest) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    import.meta.env.VITE_API_URL + "/orders",
    {
      address,
      paymentType,
      deliveryStatus,
      restaurantId,
      customerId,
      orderItems,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export function useCreateOrderMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
