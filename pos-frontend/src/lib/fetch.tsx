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
  
  // Add Accept header to request JSON response from Laravel
  headers.set("Accept", "application/json");
  
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

  const responseClone = response.clone();
  const contentType = response.headers.get("content-type");


  if (response.status === 401) {
    console.log("Unauthorized - clearing auth token");
    eraseCookie('authToken');
        try {
      const errorText = await responseClone.text();
      console.log("401 Response:", errorText.substring(0, 300));
    } catch (e) {
      console.log("Could not read 401 response body");
    }
    
    throw new Error("Unauthorized - please login again");
  }

  if (!response.ok) {
    eraseCookie('authToken');
    
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorText = await responseClone.text();
            if (contentType?.includes("application/json")) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage += ` - Non-JSON response received`;
      }
    } catch (e) {
      console.log("Could not parse error response");
    }
    
    throw new Error(errorMessage);
  }
  try {
    return await response.json();
  } catch (error) {
    const text = await responseClone.text();
    console.error("Failed to parse response as JSON:", text.substring(0, 200));
    throw new Error("Invalid JSON response from server");
  }
}