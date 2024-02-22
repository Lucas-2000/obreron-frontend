import * as z from "zod";

export const EnumDeliveryStatus = z.enum([
  "Pendente",
  "Preparando",
  "Enviado",
  "Entregue",
]);

export type DeliveryStatus = z.infer<typeof EnumDeliveryStatus>;
