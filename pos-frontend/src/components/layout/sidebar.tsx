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
import { logout } from "../../../lib/auth-actions";
import { NavItem } from "../common/nav-item";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
          {/* <NavItem open={open} icon={<Settings />} label="Settings" link="/settings" /> */}
        </nav>
      </div>

      {/* Footer (fixed) */}
      <div className="p-3 border-t shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all duration-300",
            "text-muted-foreground hover:bg-muted",
            !open && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300",
              open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

