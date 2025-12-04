import { fetchWithAuthJSON } from "@/lib/fetch";
import { PaginatedResponse } from "../../../../../types/pagination";
import { Product } from "../../../../../types/types";

export async function fetchProducts(params: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
}) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  if (params.search) query.set("search", params.search);
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_dir) query.set("sort_dir", params.sort_dir);

  return fetchWithAuthJSON<PaginatedResponse<Product>>(
    `/products?${query}`,
    {
      next: {
        tags: ['products'],
        revalidate: 3600
      }

    }
  );
}
