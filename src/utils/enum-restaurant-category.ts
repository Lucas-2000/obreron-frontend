import * as z from "zod";

export const EnumRestaurantCategory = z.enum([
  "Japonês",
  "Francês",
  "Italiano",
  "Chinês",
  "Brasileiro",
  "Fast Food",
  "Indiano",
  "Mexicano",
  "Tailandês",
  "Americano",
  "Mediterrâneo",
  "Vegetariano",
  "Vegano",
  "Frutos do Mar",
  "Churrascaria",
  "Pizza",
  "Sobremesas",
  "Cafeteria",
  "Bar",
  "Pub",
  "Food Truck",
  "Outra Categoria",
]);

export type RestaurantCategory = z.infer<typeof EnumRestaurantCategory>;
