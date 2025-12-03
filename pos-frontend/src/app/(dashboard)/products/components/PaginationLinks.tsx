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

  // Generate smart page numbers (only show nearby pages)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Show 2 pages before and after current

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(last - 1, current + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Add pages around current
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < last - 1) {
      pages.push("...");
    }

    // Always show last page (if there's more than 1 page)
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
            prefetch={false} // ← CRITICAL: Disable prefetch!
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
  prefetch = false, // ← Add this prop
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

