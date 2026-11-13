"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Table2,
  Award,
  Users,
  Calendar,
  LogOut,
  Menu,
  Settings,
  GraduationCap,
} from "lucide-react";

interface PortalSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const NAV_ITEMS = [
  {
    label: "Inicio",
    href: "/portal",
    icon: Home,
  },
  {
    label: "Planillas",
    href: "/portal/planillas",
    icon: Table2,
  },
  {
    label: "Boletines",
    href: "/portal/boletines",
    icon: Award,
  },
  {
    label: "Mis grados",
    href: "/portal/grados",
    icon: Users,
  },
];

const ADMIN_ITEMS = [
  {
    label: "Docentes y usuarios",
    href: "/portal/admin/users",
    icon: Users,
  },
  {
    label: "Grados y áreas",
    href: "/portal/admin/degrees",
    icon: GraduationCap,
  },
  {
    label: "Periodos",
    href: "/portal/admin/periods",
    icon: Calendar,
  },
  {
    label: "Estudiantes",
    href: "/portal/admin/students",
    icon: Users,
  },
];

function SidebarContent({ user, onItemClick }: PortalSidebarProps & { onItemClick?: () => void }) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";
  
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
  
  const roleLabel = isAdmin ? "Administración" : "Docente";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#E3E5EE]">
        <div className="w-10 h-10 rounded-full bg-white shadow-[0_1px_2px_rgba(27,31,59,.06),0_4px_16px_rgba(27,31,59,.06)] ring-1 ring-[#E3E5EE] flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 40 40"
            className="w-7 h-7"
            aria-label="Escudo Instituto Angelitos Alegres"
          >
            <path
              d="M8 7h24v13c0 8-6 12-12 14C14 32 8 28 8 20z"
              fill="#3FA9C9"
              stroke="#1B1F3B"
              strokeWidth="1.6"
            />
            <path
              d="M8 22h24c-1 6-6 10-12 12-6-2-11-6-12-12z"
              fill="#FFC83D"
              stroke="#1B1F3B"
              strokeWidth="1.2"
            />
            <path
              d="M13 13c3-1 5 0 7 1 2-1 4-2 7-1v8c-3-1-5 0-7 1-2-1-4-2-7-1z"
              fill="#fff"
              stroke="#1B1F3B"
              strokeWidth="1.1"
            />
            <path d="M20 14v8" stroke="#1B1F3B" strokeWidth="1" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold text-[#1B1F3B]">
            Portal Docentes
          </div>
          <div className="text-xs text-[#596074]">
            Instituto Angelitos Alegres
          </div>
        </div>
      </div>

      {/* Period Card */}
      <div className="px-4 pt-4">
        <div className="rounded-xl bg-[#FFF7E0] border border-[#FFC83D]/40 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#9A5B00]">
            <Calendar className="w-3.5 h-3.5" />
            Periodo actual
          </div>
          <div className="text-sm font-semibold text-[#1B1F3B] mt-0.5">
            Periodo 3 · 2026
          </div>
          <div className="text-xs text-[#596074]">
            Cierre de notas: 27 nov
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 pt-4 flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#F3F1FF] text-[#4A36C7] font-semibold"
                  : "text-[#596074] hover:bg-[#F7F7FB]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="px-3 pt-6 pb-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#596074]">
                Administración
              </div>
            </div>
            {ADMIN_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F3F1FF] text-[#4A36C7] font-semibold"
                      : "text-[#596074] hover:bg-[#F7F7FB]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Menu */}
      <div className="mt-auto p-3 border-t border-[#E3E5EE]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F7FB] text-left"
              aria-label={`Tu cuenta: ${user.name || "Usuario"}, ${roleLabel}`}
            >
              <Avatar className="w-9 h-9 bg-[#FDEEF6] text-[#C42A82]">
                <AvatarFallback className="bg-[#FDEEF6] text-[#C42A82] font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 leading-tight">
                <span className="block text-sm font-semibold text-[#1F2433]">
                  {user.name || "Usuario"}
                </span>
                <span className="block text-xs text-[#596074]">
                  {roleLabel}
                </span>
              </span>
              <svg
                className="w-4 h-4 text-[#596074]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-[264px]">
            {/* Identity Block */}
            <div className="px-3 pt-2.5 pb-3 flex gap-3 items-start">
              <Avatar className="w-10 h-10 bg-[#FDEEF6] text-[#C42A82]">
                <AvatarFallback className="bg-[#FDEEF6] text-[#C42A82] font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[#1F2433]">
                  {user.name || "Usuario"}
                </div>
                <div className="text-xs text-[#596074] truncate" title={user.email || ""}>
                  {user.email || ""}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex items-center h-5 px-2 rounded-full bg-[#F3F1FF] text-[#4A36C7] text-[11px] font-semibold">
                    {roleLabel}
                  </span>
                  {!isAdmin && (
                    <span className="text-[11px] text-[#596074]">
                      {/* TODO: show assigned grados */}
                      Primero · Segundo
                    </span>
                  )}
                  {isAdmin && (
                    <span className="text-[11px] text-[#596074]">
                      Todos los grados
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Hidden for now - pages don't exist yet
            <DropdownMenuItem asChild>
              <Link href="/portal/profile" className="flex items-center gap-3 h-10 px-3 rounded-md text-sm">
                <User className="w-4 h-4 text-[#596074]" />
                Mi perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/portal/change-password" className="flex items-center gap-3 h-10 px-3 rounded-md text-sm">
                <KeyRound className="w-4 h-4 text-[#596074]" />
                Cambiar contraseña
              </Link>
            </DropdownMenuItem>
            */}
            
            {isAdmin && (
              <>
                <div role="separator" className="my-1 h-px bg-[#E3E5EE]" />
                <DropdownMenuItem asChild>
                  <Link href="/portal/admin" className="flex items-center gap-3 h-10 px-3 rounded-md text-sm">
                    <Settings className="w-4 h-4 text-[#596074]" />
                    Administración
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            <div role="separator" className="my-1 h-px bg-[#E3E5EE]" />
            <DropdownMenuItem asChild>
              <button
                onClick={() => {
                  // TODO: Wire to autosave state check
                  window.location.href = "/api/auth/signout";
                }}
                className="w-full flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Always visible sign-out row */}
        <button
          onClick={() => {
            // TODO: Wire to autosave state check
            window.location.href = "/api/auth/signout";
          }}
          className="mt-1 flex items-center gap-3 h-9 px-3 rounded-lg text-sm text-[#596074] hover:bg-[#F7F7FB] w-full text-left"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function PortalSidebar({ user }: PortalSidebarProps) {
  const isAdmin = user.role === "ADMIN";
  const roleLabel = isAdmin ? "Administración" : "Docente";
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-[248px] shrink-0 h-screen sticky top-0"
        aria-label="Navegación del portal"
      >
        <SidebarContent user={user} />
      </aside>

      {/* Mobile/Tablet Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#E3E5EE] flex items-center px-4">
        {/* Hamburger Menu - full sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-3">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent user={user} onItemClick={() => {}} />
          </SheetContent>
        </Sheet>
        
        {/* Logo */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm ring-1 ring-[#E3E5EE] flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-6 h-6">
              <path
                d="M8 7h24v13c0 8-6 12-12 14C14 32 8 28 8 20z"
                fill="#3FA9C9"
                stroke="#1B1F3B"
                strokeWidth="1.6"
              />
              <path
                d="M8 22h24c-1 6-6 10-12 12-6-2-11-6-12-12z"
                fill="#FFC83D"
                stroke="#1B1F3B"
                strokeWidth="1.2"
              />
              <path
                d="M13 13c3-1 5 0 7 1 2-1 4-2 7-1v8c-3-1-5 0-7 1-2-1-4-2-7-1z"
                fill="#fff"
                stroke="#1B1F3B"
                strokeWidth="1.1"
              />
              <path d="M20 14v8" stroke="#1B1F3B" strokeWidth="1" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#1B1F3B]">
            Portal Docentes
          </span>
        </div>
        
        {/* Account Avatar - opens bottom sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="w-11 h-11 rounded-full bg-[#FDEEF6] text-[#C42A82] flex items-center justify-center font-semibold text-sm"
              aria-label={`Cuenta: ${user.name || "Usuario"}, ${roleLabel}`}
            >
              {initials}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <div className="pb-6">
              {/* Identity Block */}
              <div className="flex gap-3 items-start mb-4">
                <Avatar className="w-10 h-10 bg-[#FDEEF6] text-[#C42A82]">
                  <AvatarFallback className="bg-[#FDEEF6] text-[#C42A82] font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#1F2433]">
                    {user.name || "Usuario"}
                  </div>
                  <div className="text-xs text-[#596074] truncate">
                    {user.email || ""}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center h-5 px-2 rounded-full bg-[#F3F1FF] text-[#4A36C7] text-[11px] font-semibold">
                      {roleLabel}
                    </span>
                    {!isAdmin && (
                      <span className="text-[11px] text-[#596074]">
                        Primero · Segundo
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Hidden for now - pages don't exist
              <Link
                href="/portal/profile"
                className="flex items-center gap-3 h-12 px-4 rounded-lg hover:bg-[#F7F7FB] text-sm"
              >
                <User className="w-4 h-4 text-[#596074]" />
                Mi perfil
                <svg className="w-4 h-4 text-[#596074] ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link
                href="/portal/change-password"
                className="flex items-center gap-3 h-12 px-4 rounded-lg hover:bg-[#F7F7FB] text-sm"
              >
                <KeyRound className="w-4 h-4 text-[#596074]" />
                Cambiar contraseña
                <svg className="w-4 h-4 text-[#596074] ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              */}
              
              {/* Save Status - TODO: wire to actual autosave state */}
              <div className="flex items-center gap-2 text-sm text-[#596074] px-4 py-3">
                <svg className="w-4 h-4 text-[#15803D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z" />
                </svg>
                <span>Todos los cambios guardados</span>
              </div>
              
              {/* Sign Out Button */}
              <button
                onClick={() => {
                  // TODO: Wire to autosave state check
                  window.location.href = "/api/auth/signout";
                }}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-full border-2 border-[#5B47E0] text-[#4A36C7] font-semibold text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
