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
        <Image src="/images/dashboard.png" width={34} height={25} alt="memory" />
      ),
      action: () => openPanel('dashboard'),
    },
    {
      id: "save",
      label: "Save",
      icon: (
        <Image src="/images/memory.png" width={34} height={25} alt="memory" />
      ),
      action: () => console.log("Save clicked"), // replace null
    },
    {
      id: "cluster",
      label: "Cluster",
      icon: (
        <Image src="/images/cluster.png" width={34} height={25} alt="cluster" />
      ),
      action: () => console.log("Cluster clicked"), // replace null
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
      dragElastic={0.2}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120) setOpen(false);
        else if (info.offset.y < -80) setOpen(true);
      }}
      animate={{ y: open ? 0 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        fixed left-0 right-0 bottom-0 z-500
        h-[60vh]
        bg-white/95 backdrop-blur-xl
        dark:bg-neutral-900/95
        rounded-t-3xl shadow-2xl
        p-4
        pointer-events-auto
      "
    >
      {/* Grab Handle */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

      {/* Title */}
      <h3 className="text-center font-semibold mb-4">Controls</h3>

      {/* Row of Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {controls.map((c) => (
          <Button
            key={c.id}
            variant="glass"
            onClick={c.action || (() => {})} 
            className="
              flex flex-col items-center justify-center
              gap-1
              w-full min-h-20
              sm:min-h-25 sm:w-full
              text-xs sm:text-sm
              px-2 py-3
            "
          >
            {c.icon}
            <span>{c.label}</span>
          </Button>
        ))}
      </div>

      {/* Optional extra content */}
      <div className="mt-6 text-sm text-gray-500 text-center">
        Drag up for more options
      </div>
    </motion.div>
  );
}
