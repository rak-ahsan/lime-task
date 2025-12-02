"use server";

import { fetchWithAuth } from "@/lib/fetch";

import { fetchWithAuthJSON } from "@/lib/fetch";
import { revalidatePath } from "next/cache";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/products";

export async function createProductAction(formData: FormData) {

  try {
    const response = await fetchWithAuth(backendURL, {
      method: "POST",
      body: formData,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: json.message || "Validation failed",
        errors: json.errors || null,
      };
    }

    revalidatePath("/products");

    return {
      success: true,
      data: json.data,
    };
  } catch (e: any) {
    return {
      success: false,
      message: "Server error",
    };
  }
}


export async function updateProductAction(id: number, formData: FormData) {
  try {
    const response = await fetchWithAuthJSON(`${backendURL}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to update product",
        errors: response.errors || {},
      };
    }

    revalidatePath("/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("updateProductAction error:", error);

    return {
      success: false,
      message: "Something went wrong while updating product",
      errors: {},
    };
  }
}