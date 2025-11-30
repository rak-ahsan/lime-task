import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "default" | "gray" | "dark" | "darker" | "blackish"
}

function Skeleton({ className, color = "default", ...props }: SkeletonProps) {
  const colorMap: Record<string, string> = {
    default: "bg-muted",
    gray: "bg-gray-300",
    dark: "bg-gray-700",
    darker: "bg-gray-800",
    blackish: "bg-neutral-900",
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        colorMap[color] ?? colorMap.default,
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
