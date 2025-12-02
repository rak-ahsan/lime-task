"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Pagination({ current, last }: { current: number; last: number }) {
  const searchParams = useSearchParams();

  const getUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Previous */}
      <PageButton
        disabled={current <= 1}
        href={getUrl(current - 1)}
      >
        <span className="hidden sm:inline">Previous</span>
        <ChevronLeft />
      </PageButton>

      {/* Page Numbers */}
      {[...Array(last)].map((_, i) => {
        const page = i + 1;
        return (
          <PageButton
            key={page}
            href={getUrl(page)}
            active={current === page}
            size="icon"
          >
            {page}
          </PageButton>
        );
      })}

      {/* Next */}
      <PageButton
        disabled={current >= last}
        href={getUrl(current + 1)}
      >
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
  children,
}: {
  href?: string;
  disabled?: boolean;
  active?: boolean;
  size?: "default" | "icon";
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
    return (
      <span className={cn(baseClasses, sizes[size], states)}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href!}
      className={cn(baseClasses, sizes[size], states)}
    >
      {children}
    </Link>
  );
}


function ChevronLeft() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
