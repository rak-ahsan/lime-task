"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/logoutAction";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await logoutAction();
          router.push("/login");
        })
      }
      disabled={isPending}
      className="px-3 py-1 rounded bg-red-500 text-white"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
