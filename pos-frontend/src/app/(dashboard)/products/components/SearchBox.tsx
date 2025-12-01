"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";

export default function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.replace(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="w-64">
      <Input
        name="search"
        placeholder="Search product..."
        defaultValue={searchParams.get("search") || ""}
        onChange={handleChange}
      />
    </div>
  );
}
