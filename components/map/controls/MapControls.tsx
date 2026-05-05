"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, Transition } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useMapStore } from "@/stores/useMapStore";

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const openPanel = useMapStore((s) => s.openPanel);
  const dragY = useMotionValue(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Parallax effects
  const backgroundY = useTransform(dragY, [0, 300], [0, -15]);
  const noiseY = useTransform(dragY, [0, 300], [0, -28]);

  const controls = useMemo(() => [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "/images/dashboard.png",
      gradient: "from-[#5AC8FA]/60 to-[#007AFF]/60",
      action: () => openPanel("dashboard"),
    },
    {
      id: "save",
      label: "Save",
      icon: "/images/memory.png",
      gradient: "from-[#FFCC00]/60 to-[#FF9500]/60",
      action: () => console.log("Save clicked"),
    },
    {
      id: "cluster",
      label: "Cluster",
      icon: "/images/cluster.png",
      gradient: "from-[#AF52DE]/60 to-[#5856D6]/60",
      action: () => console.log("Cluster clicked"),
    },
    {
      id: "excel",
      label: "Excel",
      icon: "/images/excel.png",
      gradient: "from-[#34C759]/60 to-[#30B14E]/60",
      action: () => openPanel("excel"),
    },
    {
      id: "input",
      label: "Input",
      icon: "/images/input.png",
      gradient: "from-[#FF3B30]/60 to-[#D70015]/60",
      action: () => openPanel("input"),
    },
    {
      id: "pointlist",
      label: "Point List",
      icon: "/images/point-list.png",
      gradient: "from-[#5E5CE6]/60 to-[#3634A3]/60",
      action: () => openPanel("pointlist"),
    },
  ], [openPanel]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const haptic = useCallback((pattern: number | number[] = 10) => {
    if ("vibrate" in navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

  const handleClose = useCallback(() => {
    haptic(5);
    setOpen(false);
  }, [haptic]);

  const handleOpen = useCallback(() => {
    haptic([5, 10, 5]);
    setOpen(true);
  }, [haptic]);

  const handleDragEnd = useCallback((_: any, info: any) => {
    dragY.set(0);
    const velocityThreshold = 300;
    const offsetThreshold = 110;
    
    if (info.offset.y > offsetThreshold || info.velocity.y > velocityThreshold) {
      handleClose();
    } else if (info.offset.y < -offsetThreshold || info.velocity.y < -velocityThreshold) {
      handleOpen();
    }
  }, [dragY, handleClose, handleOpen]);

  // Close with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleClose]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const buttons = document.querySelectorAll('[data-drawer-button]');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const firstButton = buttons[0] as HTMLElement;
        const lastButton = buttons[buttons.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstButton) {
          e.preventDefault();
          lastButton?.focus();
        } else if (!e.shiftKey && document.activeElement === lastButton) {
          e.preventDefault();
          firstButton?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const getTransitionConfig = (): Transition => {
    if (prefersReducedMotion) {
      return { duration: 0 };
    }
    return { 
      type: "spring", 
      stiffness: 320, 
      damping: 32, 
      mass: 0.8 
    };
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main Drawer */}
      <motion.div
        ref={drawerRef}
        drag={!prefersReducedMotion ? "y" : false}
        dragElastic={0.12}
        dragConstraints={{ top: -20, bottom: 0 }}
        style={{ y: dragY }}
        onDragEnd={handleDragEnd}
        animate={{ y: open ? 0 : 280 }}
        transition={getTransitionConfig()}
        className="fixed max-w-6xl mx-auto left-0 right-0 bottom-0 z-50 h-[340px] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Control panel"
        aria-expanded={open}
      >
        {/* Glassmorphic Container */}
        <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
          {/* Base Glass Layer */}
          <motion.div
            style={{ y: backgroundY }}
            className={`absolute inset-[-20px] rounded-t-3xl backdrop-blur-xl transition-colors duration-500
              ${open
                ? "bg-gradient-to-b from-white/60 via-white/50 to-white/40 dark:from-neutral-800/70 dark:via-neutral-900/60 dark:to-neutral-900/50"
                : "bg-gradient-to-b from-white/55 via-white/45 to-white/35 dark:from-neutral-800/65 dark:via-neutral-900/55 dark:to-neutral-900/45"
              }`}
          />

          {/* Noise Texture Layer */}
          <motion.div
            style={{ y: noiseY }}
            className="absolute inset-[-30px] rounded-t-3xl opacity-[0.045] dark:opacity-[0.07] mix-blend-overlay pointer-events-none noise-texture"
          />

          {/* Vignette Layer */}
          <div className="absolute inset-0 rounded-t-3xl bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/20 pointer-events-none" />

          {/* Top Specular Highlight */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

          {/* Inner Glow & Shadow */}
          <div className="absolute inset-0 rounded-t-3xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.08),0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.3),0_20px_60px_rgba(0,0,0,0.45)] pointer-events-none" />

          {/* Animated Light Sweep */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 -bottom-10 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
            />
          )}
        </div>

        {/* Content */}
        <div className="relative h-full p-5 pt-2">
          {/* Grab Handle */}
          <button
            onClick={handleClose}
            onTouchStart={() => haptic(3)}
            className="mx-auto block py-3 touch-manipulation group"
            aria-label="Close drawer"
          >
            <div className="w-11 h-1 bg-gray-400/70 dark:bg-white/40 rounded-full group-active:scale-x-90 transition-transform" />
          </button>

          <h3 className="text-center text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100 mb-6">
            Controls
          </h3>

          {/* Controls Grid */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 px-1">
            {controls.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-2">
                <button
                  data-drawer-button
                  onClick={() => {
                    haptic([6, 4, 8]);
                    c.action();
                    if (c.id !== "save") handleClose();
                  }}
                  onTouchStart={() => haptic(4)}
                  className={`group relative w-16 h-16 rounded-2xl bg-gradient-to-b ${c.gradient} 
                    backdrop-blur-2xl shadow-lg active:scale-90 active:brightness-90 
                    transition-all duration-200 overflow-hidden touch-manipulation 
                    focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 
                    focus:ring-offset-transparent flex items-center justify-center`}
                  aria-label={c.label}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_35%,rgba(255,255,255,0.45)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.2)]" />
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Image
                      src={c.icon}
                      width={36}
                      height={36}
                      alt=""
                      draggable={false}
                      className="drop-shadow-md pointer-events-none object-contain"
                      style={{ width: '36px', height: '36px' }}
                      aria-hidden="true"
                    />
                  </div>
                </button>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight tracking-wide">
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            Drag down or tap handle to close
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        .noise-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
        }
      `}</style>
    </>
  );
}