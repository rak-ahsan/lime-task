"use server";

import { api } from "@/lib/api";
import { revalidateTag } from "next/cache";
import { fetchWithAuthJSON } from "@/lib/fetch";

export async function getInitialPosProducts() {
  const json = await fetchWithAuthJSON(`products?per_page=10`);
  return json.data.data;
}

export async function searchProductsAction(term: string) {
  const json = await fetchWithAuthJSON(`products?search=${term}`);
  return json.data.data;
}

export async function processSaleAction(payload:unknown) {
  try {
    await api.post("pos/sale", payload);
    revalidateTag("products", "default");
    return { success: true };

  } catch (e) {
    console.log("Sale error:", e);
    return { success: false, message: e };
  }
}
