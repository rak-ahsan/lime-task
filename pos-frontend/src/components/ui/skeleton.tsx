import { cn } from "@/lib/utils";

function Skeleton({ className, color = "default", ...props }) {
  const colorMap = {
    default: "bg-muted",
    gray: "bg-gray-300",
    dark: "bg-gray-700",       // <-- blackish/dark-gray
    darker: "bg-gray-800",     // <-- even darker option
    blackish: "bg-neutral-900" // <-- almost black
  };

  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        colorMap[color] || colorMap.default,
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
