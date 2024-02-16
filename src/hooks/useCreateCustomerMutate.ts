import { CreateCustomerRequest } from "@/components/customer-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

const postData = async ({
  name,
  birthDate,
  phone,
  address,
  email,
  gender,
  isActive,
  observation,
}: CreateCustomerRequest) => {
  const token = localStorage.getItem("token");

  const formattedBirthDate = format(birthDate, "dd/MM/yyyy");

  return await axios.post(
    import.meta.env.VITE_API_URL + "/customers",
    {
      name,
      birthDate: formattedBirthDate,
      phone,
      address,
      email,
      gender,
      isActive,
      observation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export function useCreateCustomerMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
