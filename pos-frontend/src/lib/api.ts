import { getCookie, eraseCookie } from '@/lib/utils';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function getServerCookie(name: string): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  } catch {
    return null;
  }
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

  let authToken = token;
  
  if (!authToken) {
    if (typeof window !== 'undefined') {
      authToken = getCookie('authToken');
    } else {
      authToken = await getServerCookie('authToken');
    }
  }

  if (authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        eraseCookie('authToken');
        window.location.href = '/login';
        throw new UnauthorizedError();
      } else {
        redirect('/login');
      }
    }
    
    try {
      const error = await response.json();
      return Promise.reject(error);
    } catch {
      return Promise.reject({ message: 'An error occurred' });
    }
  }

  if (response.status === 204) {
    return Promise.resolve({} as T);
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