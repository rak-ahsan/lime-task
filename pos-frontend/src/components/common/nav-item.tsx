import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavItem({ icon, label, open, link }: any) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted",
        !open && "justify-center"
      )}
    >
      {/* Icon */}
      <span className={cn(isActive && "text-primary")}>{icon}</span>

      {/* Label */}
      <span
        className={cn(
          "whitespace-nowrap overflow-hidden transition-all duration-300",
          open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
        )}
      >
        {label}
      </span>
    </Link>
  );
}