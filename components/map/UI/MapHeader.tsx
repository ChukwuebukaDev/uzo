"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MapHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Map", path: "/map" },
    { name: "Plan Routes", path: "/planRoutes" },
    { name: "About", path: "/about" },
    { name: "Settings", path: "/settings" },
  ];

  // Detect scroll for glass effect intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md"
        }`}
      >
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />

        <div className="max-w-6xl mx-auto flex items-center justify-between p-4 px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="relative group flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-all duration-300"
            >
              <span className="bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Uzo
              </span>
              <span className="text-2xl">🌍</span>
              
              {/* Logo underline on hover */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.path;

              return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={link.path}
                    className="relative px-4 py-2 rounded-xl transition-all duration-300 group"
                  >
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? "text-gray-900 dark:text-white font-semibold"
                          : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {link.name}
                    </span>

                    {/* Animated background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover background */}
                    <span className="absolute inset-0 rounded-xl bg-linear-to-r from-gray-100/50 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Bottom underline indicator */}
                    <span
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                        isActive ? "w-6" : "w-0 group-hover:w-4"
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Toggle menu"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="sr-only">Menu</span>
              <div className="w-5 flex flex-col gap-1.5">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-0.5 bg-gray-800 dark:bg-white rounded-full block"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-0.5 bg-gray-800 dark:bg-white rounded-full block"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-0.5 bg-gray-800 dark:bg-white rounded-full block"
                />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Bottom border glow on scroll */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0  w-80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl z-500 md:hidden"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-4 gap-2">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.path;

                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        href={link.path}
                        onClick={handleLinkClick}
                        className={`relative block px-4 py-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? "bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-900 dark:text-white font-semibold"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {link.name}
                          {isActive && (
                            <motion.div
                              layoutId="activeMobileIndicator"
                              className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-blue-500 to-purple-500"
                            />
                          )}
                        </span>
                        
                        {/* Hover effect */}
                        {!isActive && (
                          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-0 bg-linear-to-b from-blue-500 to-purple-500 transition-all duration-300 group-hover:h-6" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  © 2024 Uzo. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
}