"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { requestSignOut } from "@/lib/auth-client";

interface AccountMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    degreeIds: string[];
  };
  degrees?: Array<{ id: string; name: string }>;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (!name && !email) return "??";
  
  const displayName = name || email?.split("@")[0] || "";
  const words = displayName.trim().split(/\s+/);
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

function getDisplayName(name?: string | null, email?: string | null): string {
  if (name) return name;
  if (email) return email.split("@")[0];
  return "Usuario";
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "TEACHER":
      return "Docente";
    case "ADMIN":
      return "Administrador";
    default:
      return role;
  }
}

function getGradosText(
  role: string,
  degreeIds: string[],
  degrees?: Array<{ id: string; name: string }>
): string {
  if (role === "ADMIN") {
    return "Todos los grados";
  }
  
  if (!degrees || degrees.length === 0) {
    return "";
  }
  
  const assignedDegrees = degrees.filter((d) => degreeIds.includes(d.id));
  return assignedDegrees.map((d) => d.name).join(" · ");
}

export function AccountMenu({ user, degrees }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initials = getInitials(user.name, user.email);
  const displayName = getDisplayName(user.name, user.email);
  const roleLabel = getRoleLabel(user.role);
  const gradosText = getGradosText(user.role, user.degreeIds, degrees);
  
  const handleSignOut = async () => {
    setIsOpen(false);
    await requestSignOut();
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="flex h-11 items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 text-sm transition-colors hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label={`Tu cuenta: ${displayName}, ${roleLabel}`}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-pink-600 text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900">{displayName}</span>
          <span className="text-xs text-gray-600">{roleLabel}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-pink-600 text-sm font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-gray-900">{displayName}</div>
              <div
                className="truncate text-xs text-gray-600"
                title={user.email || ""}
              >
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {roleLabel}
                </Badge>
              </div>
              {gradosText && (
                <div className="text-xs text-gray-600">{gradosText}</div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
