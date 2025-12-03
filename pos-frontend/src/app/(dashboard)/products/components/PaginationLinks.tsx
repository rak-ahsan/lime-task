"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ current, last }: { current: number; last: number }) {
  const searchParams = useSearchParams();

  const getUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; 

    pages.push(1);
    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(last - 1, current + delta);
    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < last - 1) {
      pages.push("...");
    }

    if (last > 1) {
      pages.push(last);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Previous */}
      <PageButton disabled={current <= 1} href={getUrl(current - 1)}>
        <span className="hidden sm:inline">Previous</span>
        <ChevronLeft />
      </PageButton>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center size-9 text-muted-foreground"
            >
              ...
            </span>
          );
        }

        return (
          <PageButton
            key={page}
            href={getUrl(page as number)}
            active={current === page}
            size="icon"
            prefetch={false} 
          >
            {page}
          </PageButton>
        );
      })}

      {/* Next */}
      <PageButton disabled={current >= last} href={getUrl(current + 1)}>
        <span className="hidden sm:inline">Next</span>
        <ChevronRight />
      </PageButton>
    </div>
  );
}

function PageButton({
  href,
  disabled,
  active,
  size = "default",
  prefetch = false, 
  children,
}: {
  href?: string;
  disabled?: boolean;
  active?: boolean;
  size?: "default" | "icon";
  prefetch?: boolean;
  children: React.ReactNode;
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md border transition-colors text-sm";

  const sizes = {
    default: "px-3 py-2 gap-1",
    icon: "size-9",
  };

  const states = disabled
    ? "opacity-50 cursor-not-allowed text-muted-foreground"
    : active
      ? "border-primary text-primary bg-primary/10"
      : "border-transparent hover:bg-muted";

  if (disabled) {
    return <span className={cn(baseClasses, sizes[size], states)}>{children}</span>;
  }

  return (
    <Link
      href={href!}
      prefetch={prefetch} // ← Pass prefetch prop
      className={cn(baseClasses, sizes[size], states)}
    >
      {children}
    </Link>
  );
}

