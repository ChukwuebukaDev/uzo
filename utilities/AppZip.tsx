"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown,ChevronUp } from "lucide-react";

interface ZipUpProps {
  children: ReactNode;

}

export default function ZipUp({ children }: ZipUpProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full z-500">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer fixed right-25"
      >
        {!open ?<ChevronDown size={30}/>: <ChevronUp size={30}/>}
      </button>

      {/* Animated container */}
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden bg-white/5 backdrop-blur rounded-2xl border border-white/10"
      >
        <div>{children}</div>
      </motion.div>
    </div>
  );
}