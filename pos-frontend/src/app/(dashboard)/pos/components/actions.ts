"use server";

import { api } from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function getInitialPosProducts() {
  const json = await api.get(`products?per_page=10`);
  return json.data.data;
}

export async function searchProductsAction(term: string) {
  const json = await api.get(`products?search=${term}`);
  return json.data.data;
}

export async function processSaleAction(payload: any) {
  try {
    await api.post("pos", payload);
    revalidateTag("products", "default");
    return { success: true };

  } catch (e) {
    console.log("Sale error:", e);
    return { success: false };
  }
}
