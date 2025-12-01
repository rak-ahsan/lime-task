import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

// -----------------------------
// Root Pagination Container
// -----------------------------
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

// -----------------------------
// UL wrapper
// -----------------------------
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

// -----------------------------
// Pagination Link (core button)
// -----------------------------
type PaginationLinkProps = {
  isActive?: boolean
  asChild?: boolean
} & Omit<React.ComponentProps<typeof Button>, "size"> & {
    size?: "default" | "icon"
  }

function PaginationLink({
  className,
  isActive,
  size = "icon",
  asChild = false,
  ...props
}: PaginationLinkProps) {
  const Comp = asChild ? Slot : "a"
  
  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

// -----------------------------
// Previous Button
// -----------------------------
function PaginationPrevious({
  className,
  size: _ignored,
  asChild = false,
  ...props
}: Omit<PaginationLinkProps, "size"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a"
  
  return (
    <Comp
      aria-label="Go to previous page"
      data-slot="pagination-link"
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "gap-1 px-2.5 sm:pl-2.5",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:block">Previous</span>
    </Comp>
  )
}

// -----------------------------
// Next Button
// -----------------------------
function PaginationNext({
  className,
  size: _ignored,
  asChild = false,
  ...props
}: Omit<PaginationLinkProps, "size"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a"
  
  return (
    <Comp
      aria-label="Go to next page"
      data-slot="pagination-link"
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "gap-1 px-2.5 sm:pr-2.5",
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="size-4" />
    </Comp>
  )
}

// -----------------------------
// Ellipsis ("...")
// -----------------------------
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

// -----------------------------
// Exports
// -----------------------------
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}