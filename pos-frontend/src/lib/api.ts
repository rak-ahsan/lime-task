import { permanentRedirect } from 'next/navigation';
import { getCookie, eraseCookie } from '@/lib/utils'; // Import cookie utilities

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  min_stock: number;
  discount_details?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  trade_offer_details?: string; // Example: "Buy one get one free"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'; // Assuming Laravel API runs on 8000

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function apiFetch<T>(
  endpoint: string,
  { token, headers, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method: 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  };

  // If token is not explicitly provided, try to get it from cookies (for client-side calls)
  const authToken = token || (typeof window !== 'undefined' ? getCookie('authToken') : null);

  if (authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      eraseCookie('authToken'); // Erase the invalid token
      permanentRedirect('/login'); // This will only work in a server component context
    }
    const error = await response.json();
    return Promise.reject(error);
  }

  // Handle no content response (e.g., 204 No Content)
  if (response.status === 204) {
    return Promise.resolve() as Promise<T>;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string | null) =>
    apiFetch<T>(endpoint, { token, method: 'GET' }),
  post: <T>(endpoint: string, data: unknown, token?: string | null) =>
    apiFetch<T>(endpoint, { token, method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown, token?: string | null) =>
    apiFetch<T>(endpoint, { token, method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string, token?: string | null) =>
    apiFetch<T>(endpoint, { token, method: 'DELETE' }),
};
