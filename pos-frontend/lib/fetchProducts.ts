import { api, Product } from '@/lib/api';
import { getCookie } from '@/lib/utils';
import { PaginatedResponse } from '../types/pagination';

export async function fetchProducts(params: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
}): Promise<PaginatedResponse<Product>> {
  
  const token =
    typeof window !== "undefined" ? getCookie("authToken") : null;

  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.per_page) query.append("per_page", String(params.per_page));
  if (params.search) query.append("search", params.search);
  if (params.sort_by) query.append("sort_by", params.sort_by);
  if (params.sort_dir) query.append("sort_dir", params.sort_dir);

  const url = `products?${query.toString()}`;

  try {
    const response = await api.get<PaginatedResponse<Product>>(url, token);
    return response;
  } catch (error) {
    console.error('Product fetch failed:', error);
    return {
      data: [],
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: params.per_page || 10,
    };
  }
}
