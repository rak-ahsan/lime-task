import { cookies } from "next/headers";
import { eraseCookie } from "./utils";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FetchWithAuthOptions extends RequestInit {
  next?: NextFetchRequestConfig;
}

export async function fetchWithAuth(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

export async function fetchWithAuthJSON<T = any>(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);

  if (response.status === 401) {
    eraseCookie('authToken');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}