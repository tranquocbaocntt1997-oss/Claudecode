import { Role, OrderStatus } from "@prisma/client";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count: {
    products: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: Date;
    user: { name: string; email: string };
  }>;
}
