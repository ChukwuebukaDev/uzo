"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useState } from "react";
import { useMapStore } from "@/stores/useMapStore";

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const openPanel = useMapStore((s) => s.openPanel);

  const controls = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <Image
          src="/images/dashboard.png"
          width={34}
          height={25}
          alt="dashboard"
        />
      ),
      action: () => openPanel("dashboard"),
    },
    {
      id: "save",
      label: "Save",
      icon: (
        <Image src="/images/memory.png" width={34} height={25} alt="save" />
      ),
      action: () => console.log("Save clicked"),
    },
    {
      id: "cluster",
      label: "Cluster",
      icon: (
        <Image src="/images/cluster.png" width={34} height={25} alt="cluster" />
      ),
      action: () => console.log("Cluster clicked"),
    },
    {
      id: "excel",
      label: "Excel",
      icon: (
        <Image src="/images/excel.png" width={34} height={25} alt="excel" />
      ),
      action: () => openPanel("excel"),
    },
    {
      id: "input",
      label: "Input",
      icon: (
        <Image src="/images/input.png" width={34} height={25} alt="input" />
      ),
      action: () => openPanel("input"),
    },
  ];

  return (
    <motion.div
      drag="y"
      dragElastic={0.15}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120) setOpen(false);
        else if (info.offset.y < -80) setOpen(true);
      }}
      animate={{ y: open ? 0 : 260 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="
        fixed max-w-6xl mx-auto left-0 right-0 bottom-0 z-50
        h-[60vh]
        bg-white/80 dark:bg-neutral-900/70
        backdrop-blur-2xl
        border border-white/20 dark:border-white/10
        rounded-t-[28px]
        shadow-[0_-10px_40px_rgba(0,0,0,0.15)]
        p-5
      "
    >
      {/* Grab Handle */}
      <div className="flex justify-center mb-5">
        <div className="w-14 h-1.5 bg-gray-300/70 dark:bg-white/20 rounded-full" />
      </div>

      {/* Title */}
      <h3 className="text-center font-semibold text-base tracking-tight mb-5 text-gray-800 dark:text-gray-100">
        Controls
      </h3>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {controls.map((c) => (
          <Button
            key={c.id}
            variant="glass"
            onClick={c.action || (() => {})}
            className="
              group relative
              flex flex-col items-center justify-center
              gap-2
              w-full min-h-24
              text-xs sm:text-sm
              px-3 py-4
              rounded-2xl
              border border-white/20 dark:border-white/10
              bg-white/40 dark:bg-white/5
              backdrop-blur-xl
              shadow-sm
              hover:shadow-lg
              hover:scale-[1.03]
              active:scale-[0.97]
              transition-all duration-200 ease-out
            "
          >
            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-300 bg-blue-400/30" />
              {c.icon}
            </div>

            {/* Label */}
            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition">
              {c.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center tracking-wide">
        Drag up for more options
      </div>
    </motion.div>
  );
}
