import * as z from "zod";

export const EnumCustomerGender = z.enum(["M", "F"]);

export type CustomerGender = z.infer<typeof EnumCustomerGender>;
