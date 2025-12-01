"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/logout";

  try {
    await fetch(backendURL, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
  }
  (await cookies()).delete("token");

  return { success: true };
}
