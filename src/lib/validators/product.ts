import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự"),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  stock: z.coerce.number().int().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
  image: z.string().optional(),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.unknown()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
