"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";

// Navigation links data
const NAV_ITEMS = [
  {
    label: "Profesores",
    href: "#",
    hasDropdown: true,
    dropdownItems: [
      { label: "Planillas", href: "/planillas" },
      { label: "Boletines", href: "/boletines" },
    ],
  },
  { label: "Cursos", href: "/cursos" },
  { label: "Programas", href: "/programas" },
  { label: "Contactanos", href: "/contactanos" },
];

// Mobile menu item component
const MobileMenuItem = ({
  item,
  isOpen,
  toggleDropdown,
}: {
  item: (typeof NAV_ITEMS)[0];
  isOpen?: boolean;
  toggleDropdown?: () => void;
}) => {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={toggleDropdown}
          className="w-full text-left flex justify-between items-center text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
        >
          {item.label}
          <svg
            className="ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="pl-4">
            {item.dropdownItems?.map((dropdownItem, index) => (
              <Link
                key={index}
                href={dropdownItem.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {dropdownItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
    >
      {item.label}
    </Link>
  );
};

// Desktop menu item component
const DesktopMenuItem = ({
  item,
  isOpen,
  toggleDropdown,
}: {
  item: (typeof NAV_ITEMS)[0];
  isOpen?: boolean;
  toggleDropdown?: () => void;
}) => {
  if (item.hasDropdown) {
    return (
      <div className="relative group">
        <button
          onClick={toggleDropdown}
          className="inline-flex items-center text-gray-700 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium"
        >
          {item.label}
          <svg
            className="ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="py-1">
            {item.dropdownItems?.map((dropdownItem, index) => (
              <Link
                key={index}
                href={dropdownItem.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {dropdownItem.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="text-gray-700 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium"
    >
      {item.label}
    </Link>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTeacherMenu = () => setIsTeacherMenuOpen(!isTeacherMenuOpen);

  return (
    <header className="w-full bg-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                priority
                src="/logo.png"
                alt="Educate Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item, index) => (
              <DesktopMenuItem
                key={index}
                item={item}
                isOpen={
                  item.label === "Profesores" ? isTeacherMenuOpen : undefined
                }
                toggleDropdown={
                  item.label === "Profesores" ? toggleTeacherMenu : undefined
                }
              />
            ))}
          </nav>

          {/* Desktop Sign In/Sign Up buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline">Iniciar sesión</Button>
            <Button>Registrarse</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_ITEMS.map((item, index) => (
            <MobileMenuItem
              key={index}
              item={item}
              isOpen={
                item.label === "Profesores" ? isTeacherMenuOpen : undefined
              }
              toggleDropdown={
                item.label === "Profesores" ? toggleTeacherMenu : undefined
              }
            />
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 px-4">
            <Button
              variant="ghost"
              className="w-full text-gray-700 hover:text-blue-600"
            >
              Iniciar sesión
            </Button>
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-none">
              Registrarse
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
