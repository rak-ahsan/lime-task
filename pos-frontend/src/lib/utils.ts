import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function setCookie(name: string, value: string, days: number) {
  if (typeof window === 'undefined') return; 
  
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

export function getCookie(name: string) {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

export function eraseCookie(name: string) {
  if (typeof window === 'undefined') return; 
  
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | undefined | null): string {
  const numValue = Number(value);
  if (isNaN(numValue)) return "$0.00";
  return "$" + numValue.toFixed(2);
}


export function parseLaravelErrors(err: any): string[] {
  const axiosErrors = err?.response?.data?.errors;
  if (axiosErrors && typeof axiosErrors === "object") {
    // @ts-ignore
    return Object.values(axiosErrors).flat().filter(Boolean);
  }

  const directErrors = err?.errors;
  if (directErrors && typeof directErrors === "object") {
    // @ts-ignore
    return Object.values(directErrors).flat().filter(Boolean);
  }

  const msg = err?.response?.data?.message || err?.message;
  return msg ? [msg] : ["Something went wrong."];
}