"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  Users,
  BookOpen,
  GraduationCap,
  Phone,
  FileText,
  Award,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Quienes Somos",
    href: "#nosotros",
    icon: <Users className="w-4 h-4" />,
    description: "Conoce nuestra historia",
  },
  {
    label: "Grados",
    href: "#programs",
    icon: <BookOpen className="w-4 h-4" />,
    description: "Nuestros grados educativos",
  },
  {
    label: "Galería",
    href: "#galeria",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Momentos especiales",
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {NAV_ITEMS.map((item) => (
        <div key={item.label} className="relative group">
          <Link
            href={item.href}
            onClick={(e) => handleSmoothScroll(e, item.href)}
            className={`font-medium transition-all duration-300 ${
              isMobile
                ? "flex items-center gap-3 rounded-xl px-4 py-3 text-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                : `relative text-sm hover:text-blue-600 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm ${
                    pathname === item.href
                      ? "text-blue-600 bg-white/20 shadow-lg"
                      : "text-gray-700"
                  }`
            }`}
            onMouseEnter={() => !isMobile && setActiveDropdown(item.label)}
            onMouseLeave={() => !isMobile && setActiveDropdown(null)}
          >
            {isMobile && (
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                {item.icon}
              </div>
            )}
            <span>{item.label}</span>
            {!isMobile && (
              <div
                className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                  pathname === item.href ? "w-full" : "group-hover:w-full"
                }`}
              />
            )}
          </Link>

          {/* Hover tooltip for desktop */}
          {!isMobile && activeDropdown === item.label && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white rounded-lg shadow-xl border border-gray-100 text-xs text-gray-600 whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95 duration-200">
              {item.description}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-100 rotate-45" />
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-2xl border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animation */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-white rounded-full p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  priority
                  src="/logo.png"
                  alt="Instituto Angelitos Alegres"
                  width={120}
                  height={40}
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20 shadow-lg">
            <NavLinks />
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 bg-transparent border border-gray-300 hover:border-blue-300">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Portal Docentes
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/planillas"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            <FileText className="w-4 h-4" />
                            Planillas
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/boletines"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            <Award className="w-4 h-4" />
                            Boletines
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "#contact")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contáctanos
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-gradient-to-br from-blue-50 to-purple-50 border-l border-white/20"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="relative p-2">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <Image
                            src="/logo.png"
                            alt="Logo"
                            width={80}
                            height={30}
                            className="h-8 w-auto"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Instituto Angelitos Alegres
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 space-y-2">
                    <NavLinks isMobile />
                  </nav>

                  {/* Mobile CTA */}
                  <div className="py-6 px-3 border-t border-gray-200 space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 px-3">
                        Portal Docentes
                      </p>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-white/50 border-gray-200 hover:bg-white"
                        asChild
                      >
                        <Link href="/planillas">
                          <FileText className="w-4 h-4 mr-3" />
                          Planillas
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-white/50 border-gray-200 hover:bg-white"
                        asChild
                      >
                        <Link href="/boletines">
                          <Award className="w-4 h-4 mr-3" />
                          Boletines
                        </Link>
                      </Button>
                    </div>
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      asChild
                    >
                      <Link
                        href="#contact"
                        onClick={(e) => handleSmoothScroll(e, "#contact")}
                      >
                        <Phone className="w-4 h-4 mr-3" />
                        Contáctanos Ahora
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
