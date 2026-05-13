import { z } from "zod";

export const orderSchema = z.object({
  shippingName: z.string().min(2, "Tên người nhận phải có ít nhất 2 ký tự"),
  shippingPhone: z.string().min(8, "Số điện thoại không hợp lệ"),
  shippingAddress: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
