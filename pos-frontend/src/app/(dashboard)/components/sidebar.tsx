"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  LayoutDashboard,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={cn(
        "h-screen border-r bg-card transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Header (fixed) */}
      <div className="flex items-center justify-between h-16 px-4 border-b shrink-0">
        <div
          className={cn(
            "font-semibold text-lg whitespace-nowrap overflow-hidden transition-all duration-300",
            open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
          )}
        >
          Dashboard
        </div>

        <button onClick={() => setOpen(!open)}>
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* SCROLLABLE NAV AREA */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted hover:scrollbar-thumb-muted/70">
        <nav className="flex flex-col gap-1 mt-4 px-3 pb-10">
          <NavItem open={open} icon={<LayoutDashboard />} label="Overview" link="/" />
          <NavItem open={open} icon={<ShoppingBag />} label="Products" link="/products" />
          <NavItem open={open} icon={<BarChart2 />} label="POS" link="/pos" />
          <NavItem open={open} icon={<Settings />} label="Settings" link="/settings" />

          {/* Example: Add many to test scroll */}
          {/* [...Array(20)].map(_,i => <NavItem ... />) */}
        </nav>
      </div>

      {/* Footer (fixed) */}
      <div className="p-3 border-t shrink-0">
        <NavItem open={open} icon={<LogOut />} label="Logout" link="/logout" />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, open, link }) {
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
