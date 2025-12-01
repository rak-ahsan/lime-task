"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-6">

      {/* Search */}
      <Input
        placeholder="Search..."
        className="w-72 bg-muted/30"
      />

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-muted overflow-hidden">
                {/* Avatar -- Replace with actual user image */}
                <img
                  src="/avatar-placeholder.png"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* User info (hidden on small screens) */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium">Rakib Ahsan</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              Billing
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
