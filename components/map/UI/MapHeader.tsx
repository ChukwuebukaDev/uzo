"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MapHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Map", path: "/map" },
    {name: 'Plan Routes', path:'/planRoutes'},
    { name: "About", path: "/about" },
    {name:'Settings',path:'/settings'},
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          Uzo 🌍
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative group"
              >
                <span
                  className={`transition ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                >
                  {link.name}
                </span>

                {/* animated underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-black transition-all duration-300 ${
                    isActive
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>


        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden cursor-pointer text-2xl pointer-cursor"
        >
          ☰
        </button>

      </div>


      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-40 border-t" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 p-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`${
                pathname === link.path
                  ? "font-semibold text-black"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}