import { UpdateOrderRequest } from "@/components/update-order-delivery-status-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const patchData = async ({
  id,
  address,
  paymentType,
  deliveryStatus,
  customerId,
  orderItems,
}: UpdateOrderRequest) => {
  const token = localStorage.getItem("token");

  return await axios.patch(
    import.meta.env.VITE_API_URL + "/orders",
    {
      id,
      address,
      paymentType,
      deliveryStatus,
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

export function useUpdateOrderMutate() {
  const mutate = useMutation({
    mutationFn: patchData,
  });

  return mutate;
}
