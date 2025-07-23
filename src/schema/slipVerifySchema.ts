import z from "zod";

export const slipVerifySchema = z.object({
  qrcode_data: z.string(),
  amount: z.string(),
  orderId: z.string(),
});
