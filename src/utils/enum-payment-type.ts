import * as z from "zod";

export const EnumPaymentType = z.enum([
  "Cartão de crédito",
  "Cartão de débito",
  "Pix",
  "Dinheiro",
]);

export type PaymentType = z.infer<typeof EnumPaymentType>;
