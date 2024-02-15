import { CreateItemRequest } from "@/components/item-modal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const postData = async ({
  name,
  description,
  priceInCents,
  available,
  preparationTime,
  ingredients,
}: CreateItemRequest) => {
  const token = localStorage.getItem("token");

  const arrayIngredients = ingredients.split(/\s*,\s*/);

  return await axios.post(
    import.meta.env.VITE_API_URL + "/items",
    {
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

export function useCreateItemMutate() {
  const mutate = useMutation({
    mutationFn: postData,
  });

  return mutate;
}
