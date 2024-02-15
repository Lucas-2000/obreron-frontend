import { CreateItemRequest } from "@/components/item-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const patchData = async ({
  id,
  name,
  description,
  priceInCents,
  available,
  preparationTime,
  ingredients,
}: CreateItemRequest) => {
  const token = localStorage.getItem("token");

  const arrayIngredients = ingredients.split(/\s*,\s*/);

  return await axios.patch(
    import.meta.env.VITE_API_URL + "/items",
    {
      id,
      name,
      description,
      priceInCents: Number(priceInCents) * 100,
      available,
      preparationTime: Number(preparationTime),
      ingredients: arrayIngredients,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export function useUpdateItemMutate() {
  const mutate = useMutation({
    mutationFn: patchData,
  });

  return mutate;
}
