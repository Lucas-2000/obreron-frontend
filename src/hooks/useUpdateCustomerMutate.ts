import { CreateCustomerRequest } from "@/components/customer-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

const patchData = async ({
  id,
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


  return await axios.patch(
    import.meta.env.VITE_API_URL + "/customers",
    {
      id,
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

export function useUpdateCustomerMutate() {
  const mutate = useMutation({
    mutationFn: patchData,
  });

  return mutate;
}
